import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Save, Plus, Trash2, Bell, FileText, Edit2, AlertTriangle, X, ExternalLink, GraduationCap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TabKey = 'circulars' | 'admissions' | 'events' | 'mous';

interface AnnouncementItem {
    id: string;
    title: string;
    description: string;
    date: string;
    link: string;
    published: boolean;
}

const emptyItem = (): Omit<AnnouncementItem, 'id'> => ({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    link: '',
    published: true,
});

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'circulars', label: 'Circulars', icon: FileText },
    { key: 'admissions', label: 'Admissions', icon: GraduationCap },
    { key: 'events', label: 'Events', icon: Bell },
    { key: 'mous', label: 'MOUs', icon: FileText },
];

const AnnouncementsManager = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('circulars');
    const [items, setItems] = useState<AnnouncementItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyItem());

    // Delete confirm
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchItems(activeTab);
    }, [activeTab]);

    const fetchItems = async (col: TabKey) => {
        setLoading(true);
        setItems([]);
        try {
            const snap = await getDocs(collection(db, col));
            const list: AnnouncementItem[] = snap.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    title: data.title || '',
                    description: data.description || '',
                    date: data.date?.toDate ? data.date.toDate().toISOString().split('T')[0] : (data.date || ''),
                    link: data.link || '',
                    published: data.published !== false,
                };
            }).sort((a, b) => (b.date > a.date ? 1 : -1));
            setItems(list);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!form.title.trim()) return;
        setSaving(true);
        try {
            const payload = {
                title: form.title.trim(),
                description: form.description.trim(),
                date: form.date ? Timestamp.fromDate(new Date(form.date)) : Timestamp.now(),
                link: form.link.trim(),
                published: form.published,
            };
            if (editId) {
                await updateDoc(doc(db, activeTab, editId), payload);
            } else {
                await addDoc(collection(db, activeTab), payload);
            }
            await fetchItems(activeTab);
            resetForm();
        } catch (e) {
            console.error(e);
            alert('Failed to save');
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, activeTab, deleteId));
            setItems(prev => prev.filter(i => i.id !== deleteId));
            setDeleteId(null);
        } catch (e) {
            console.error(e);
            alert('Failed to delete');
        }
        setDeleting(false);
    };

    const startEdit = (item: AnnouncementItem) => {
        setForm({ title: item.title, description: item.description, date: item.date, link: item.link, published: item.published });
        setEditId(item.id);
        setShowForm(true);
    };

    const resetForm = () => {
        setForm(emptyItem());
        setEditId(null);
        setShowForm(false);
    };

    const togglePublish = async (item: AnnouncementItem) => {
        try {
            await updateDoc(doc(db, activeTab, item.id), { published: !item.published });
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, published: !i.published } : i));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="w-8 h-8 text-iare-blue" /> Announcements
                </h1>
                <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-iare-blue">
                    <Plus className="w-4 h-4 mr-2" /> Add New
                </Button>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 border-b border-gray-200 pb-0">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => { setActiveTab(key); resetForm(); }}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                            activeTab === key
                                ? 'border-iare-blue text-iare-blue'
                                : 'border-transparent text-gray-500 hover:text-iare-blue'
                        }`}
                    >
                        <Icon className="w-4 h-4" />{label}
                    </button>
                ))}
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">{editId ? 'Edit' : 'New'} {TABS.find(t => t.key === activeTab)?.label}</h2>
                        <button onClick={resetForm}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
                            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter title..." />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Optional description..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Link <span className="text-gray-400 text-xs">(optional)</span></label>
                            <Input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="published" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-iare-blue" />
                            <label htmlFor="published" className="text-sm font-medium">Published (visible on home page)</label>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                        <Button variant="outline" onClick={resetForm}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving || !form.title.trim()} className="bg-iare-blue">
                            <Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
                        <div className="flex items-center gap-3 text-red-600">
                            <AlertTriangle className="w-6 h-6" />
                            <h2 className="text-xl font-bold">Delete Item?</h2>
                        </div>
                        <p className="text-gray-600">This will permanently remove the item. This action cannot be undone.</p>
                        <div className="flex gap-2 justify-end pt-2">
                            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                            <Button onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">
                                {deleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Items List */}
            <div className="bg-white rounded-xl shadow border border-gray-100">
                {loading ? (
                    <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iare-blue"></div></div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 italic text-sm">No {activeTab} yet. Click "Add New" to create one.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Link</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={item.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className="px-5 py-3">
                                        <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                                        {item.description && <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{item.description}</p>}
                                    </td>
                                    <td className="px-5 py-3 text-sm text-gray-500">{item.date || '—'}</td>
                                    <td className="px-5 py-3">
                                        {item.link ? (
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-iare-blue hover:underline flex items-center gap-1 text-xs">
                                                <ExternalLink className="w-3 h-3" /> Link
                                            </a>
                                        ) : <span className="text-gray-300 text-xs">—</span>}
                                    </td>
                                    <td className="px-5 py-3">
                                        <button onClick={() => togglePublish(item)}
                                            className={`text-xs px-2 py-1 rounded-full font-semibold transition-colors ${item.published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                            {item.published ? 'Published' : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => setDeleteId(item.id)}>
                                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AnnouncementsManager;
