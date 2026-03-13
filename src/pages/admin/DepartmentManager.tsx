import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Save, Plus, Trash2, Users, Building2, ChevronDown, ChevronRight, Edit2, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FacultyMember {
    name: string;
    designation: string;
    mobile: string;
    email: string;
    profileLink: string;
}

interface DepartmentData {
    id: string;
    name: string;
    tagline: string;
    description: string;
    established: number;
    vision: string;
    mission: string[];
    hod: string;
    hodImageUrl: string;
    hodDesignation: string;
    faculty: FacultyMember[];
    programs: string[];
    labs: string[];
    contact: {
        email: string;
        phone: string;
    };
}

const emptyDept = (id: string = '', name: string = ''): DepartmentData => ({
    id,
    name,
    tagline: '',
    description: '',
    established: new Date().getFullYear(),
    vision: '',
    mission: [''],
    hod: '',
    hodImageUrl: '',
    hodDesignation: '',
    faculty: [],
    programs: [''],
    labs: [''],
    contact: { email: '', phone: '' },
});

const emptyFaculty = (): FacultyMember => ({ name: '', designation: '', mobile: '', email: '', profileLink: '' });

const DepartmentManager = () => {
    const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
    const [selectedDept, setSelectedDept] = useState<string>('');
    const [deptData, setDeptData] = useState<DepartmentData | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [listLoading, setListLoading] = useState(true);

    // New department modal state
    const [showNewDept, setShowNewDept] = useState(false);
    const [newId, setNewId] = useState('');
    const [newName, setNewName] = useState('');
    const [newIdError, setNewIdError] = useState('');

    // Delete confirm state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Fetch list of departments from Firestore
    useEffect(() => {
        fetchDepartmentList();
    }, []);

    const fetchDepartmentList = async () => {
        setListLoading(true);
        try {
            const snapshot = await getDocs(collection(db, 'departments'));
            const list = snapshot.docs.map(d => ({ id: d.id, name: (d.data() as DepartmentData).name || d.id }));
            list.sort((a, b) => a.name.localeCompare(b.name));
            setDepartments(list);
            if (list.length > 0 && !selectedDept) {
                setSelectedDept(list[0].id);
            }
        } catch (err) {
            console.error('Failed to fetch departments list:', err);
        }
        setListLoading(false);
    };

    useEffect(() => {
        if (selectedDept) fetchDepartment(selectedDept);
    }, [selectedDept]);

    const fetchDepartment = async (id: string) => {
        setLoading(true);
        setDeptData(null);
        try {
            const docSnap = await getDoc(doc(db, 'departments', id));
            if (docSnap.exists()) {
                const data = docSnap.data() as DepartmentData;
                setDeptData({
                    ...emptyDept(id),
                    ...data,
                    hodImageUrl: data.hodImageUrl || '',
                    hodDesignation: data.hodDesignation || '',
                    faculty: data.faculty || [],
                });
            } else {
                setDeptData(emptyDept(id, departments.find(d => d.id === id)?.name || ''));
            }
        } catch (err) {
            console.error('Error fetching department:', err);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!deptData) return;
        setSaving(true);
        try {
            await setDoc(doc(db, 'departments', deptData.id), deptData);
            // Refresh list name if changed
            setDepartments(prev => prev.map(d => d.id === deptData.id ? { ...d, name: deptData.name } : d));
            alert('Department saved successfully!');
        } catch (err) {
            console.error('Error saving department:', err);
            alert('Failed to save department');
        }
        setSaving(false);
    };

    const handleCreateDepartment = async () => {
        const slug = newId.trim().toLowerCase().replace(/\s+/g, '-');
        if (!slug) { setNewIdError('ID is required'); return; }
        if (!newName.trim()) { setNewIdError('Name is required'); return; }
        if (departments.some(d => d.id === slug)) { setNewIdError('A department with this ID already exists'); return; }

        const data = emptyDept(slug, newName.trim());
        try {
            await setDoc(doc(db, 'departments', slug), data);
            const newList = [...departments, { id: slug, name: newName.trim() }].sort((a, b) => a.name.localeCompare(b.name));
            setDepartments(newList);
            setSelectedDept(slug);
            setShowNewDept(false);
            setNewId('');
            setNewName('');
            setNewIdError('');
        } catch (err) {
            console.error(err);
            alert('Failed to create department');
        }
    };

    const handleDeleteDepartment = async () => {
        if (!selectedDept) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, 'departments', selectedDept));
            const newList = departments.filter(d => d.id !== selectedDept);
            setDepartments(newList);
            setSelectedDept(newList[0]?.id || '');
            setDeptData(null);
            setShowDeleteConfirm(false);
        } catch (err) {
            console.error(err);
            alert('Failed to delete department');
        }
        setDeleting(false);
    };

    // --- String array helpers ---
    const addArrayItem = (field: 'mission' | 'programs' | 'labs') => {
        if (!deptData) return;
        setDeptData({ ...deptData, [field]: [...deptData[field], ''] });
    };
    const updateArrayItem = (field: 'mission' | 'programs' | 'labs', index: number, value: string) => {
        if (!deptData) return;
        const arr = [...deptData[field]];
        arr[index] = value;
        setDeptData({ ...deptData, [field]: arr });
    };
    const removeArrayItem = (field: 'mission' | 'programs' | 'labs', index: number) => {
        if (!deptData) return;
        setDeptData({ ...deptData, [field]: deptData[field].filter((_, i) => i !== index) });
    };

    // --- Faculty helpers ---
    const addFaculty = () => { if (!deptData) return; setDeptData({ ...deptData, faculty: [...deptData.faculty, emptyFaculty()] }); };
    const updateFaculty = (index: number, field: keyof FacultyMember, value: string) => {
        if (!deptData) return;
        setDeptData({ ...deptData, faculty: deptData.faculty.map((f, i) => i === index ? { ...f, [field]: value } : f) });
    };
    const removeFaculty = (index: number) => {
        if (!deptData) return;
        setDeptData({ ...deptData, faculty: deptData.faculty.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-8 h-8 text-iare-blue" /> Department Management
                </h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowNewDept(true)} className="border-iare-blue text-iare-blue hover:bg-blue-50">
                        <Plus className="w-4 h-4 mr-2" /> New Department
                    </Button>
                    {deptData && (
                        <Button onClick={handleSave} disabled={saving} className="bg-iare-blue">
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    )}
                </div>
            </div>

            {/* New Department Modal */}
            {showNewDept && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Create New Department</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">Department ID <span className="text-gray-400 text-xs">(slug, e.g. "it" or "mba")</span></label>
                            <Input
                                value={newId}
                                onChange={(e) => { setNewId(e.target.value); setNewIdError(''); }}
                                placeholder="e.g. it"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Department Name</label>
                            <Input
                                value={newName}
                                onChange={(e) => { setNewName(e.target.value); setNewIdError(''); }}
                                placeholder="e.g. Information Technology"
                            />
                        </div>
                        {newIdError && <p className="text-red-500 text-sm">{newIdError}</p>}
                        <div className="flex gap-2 justify-end pt-2">
                            <Button variant="outline" onClick={() => { setShowNewDept(false); setNewId(''); setNewName(''); setNewIdError(''); }}>Cancel</Button>
                            <Button onClick={handleCreateDepartment} className="bg-iare-blue">Create</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
                        <div className="flex items-center gap-3 text-red-600">
                            <AlertTriangle className="w-6 h-6" />
                            <h2 className="text-xl font-bold">Delete Department?</h2>
                        </div>
                        <p className="text-gray-600">
                            This will permanently delete <strong>{deptData?.name}</strong> from Firestore. This action cannot be undone.
                        </p>
                        <div className="flex gap-2 justify-end pt-2">
                            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                            <Button onClick={handleDeleteDepartment} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">
                                {deleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Department Selector Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Departments</h2>
                        {listLoading ? (
                            <div className="flex justify-center py-6"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-iare-blue"></div></div>
                        ) : departments.length === 0 ? (
                            <p className="text-gray-400 text-sm italic text-center py-4">No departments yet.</p>
                        ) : (
                            <nav className="space-y-1">
                                {departments.map((dept) => (
                                    <button
                                        key={dept.id}
                                        onClick={() => setSelectedDept(dept.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${selectedDept === dept.id ? 'bg-iare-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <span className="truncate">{dept.name}</span>
                                        {selectedDept === dept.id && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                                    </button>
                                ))}
                            </nav>
                        )}
                        {selectedDept && (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="mt-4 w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-700 text-xs py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-3 h-3" /> Delete Selected
                            </button>
                        )}
                    </div>
                </div>

                {/* Department Form */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iare-blue"></div></div>
                    ) : !deptData ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
                            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Select a department or create a new one.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-6 space-y-6">
                            {/* Basic Info */}
                            <section>
                                <h2 className="text-base font-semibold text-gray-700 border-b pb-2 mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Department Name</label>
                                        <Input value={deptData.name} onChange={(e) => setDeptData({ ...deptData, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Established Year</label>
                                        <Input
                                            type="number"
                                            value={deptData.established}
                                            onChange={(e) => setDeptData({ ...deptData, established: parseInt(e.target.value) || 0 })}
                                            placeholder="e.g. 1986"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium mb-1">Tagline</label>
                                    <Input
                                        value={deptData.tagline}
                                        onChange={(e) => setDeptData({ ...deptData, tagline: e.target.value })}
                                        placeholder="e.g. Building the Foundation of Modern Society"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <Textarea value={deptData.description} onChange={(e) => setDeptData({ ...deptData, description: e.target.value })} rows={4} />
                                </div>
                            </section>

                            {/* Vision & Mission */}
                            <section>
                                <h2 className="text-base font-semibold text-gray-700 border-b pb-2 mb-4">Vision & Mission</h2>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Vision</label>
                                    <Textarea value={deptData.vision} onChange={(e) => setDeptData({ ...deptData, vision: e.target.value })} rows={3} />
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium">Mission Points</label>
                                        <Button size="sm" variant="outline" onClick={() => addArrayItem('mission')}><Plus className="w-4 h-4" /></Button>
                                    </div>
                                    {deptData.mission.map((item, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <Input value={item} onChange={(e) => updateArrayItem('mission', index, e.target.value)} placeholder={`Mission point ${index + 1}`} />
                                            <Button size="sm" variant="outline" onClick={() => removeArrayItem('mission', index)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Programs & Labs */}
                            <section>
                                <h2 className="text-base font-semibold text-gray-700 border-b pb-2 mb-4">Programs & Laboratories</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium">Programs Offered</label>
                                            <Button size="sm" variant="outline" onClick={() => addArrayItem('programs')}><Plus className="w-4 h-4" /></Button>
                                        </div>
                                        {deptData.programs.map((item, index) => (
                                            <div key={index} className="flex gap-2 mb-2">
                                                <Input value={item} onChange={(e) => updateArrayItem('programs', index, e.target.value)} placeholder={`Program ${index + 1}`} />
                                                <Button size="sm" variant="outline" onClick={() => removeArrayItem('programs', index)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium">Laboratories</label>
                                            <Button size="sm" variant="outline" onClick={() => addArrayItem('labs')}><Plus className="w-4 h-4" /></Button>
                                        </div>
                                        {deptData.labs.map((item, index) => (
                                            <div key={index} className="flex gap-2 mb-2">
                                                <Input value={item} onChange={(e) => updateArrayItem('labs', index, e.target.value)} placeholder={`Lab ${index + 1}`} />
                                                <Button size="sm" variant="outline" onClick={() => removeArrayItem('labs', index)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* HOD Section */}
                            <section>
                                <h2 className="text-base font-semibold text-gray-700 border-b pb-2 mb-4">Head of Department</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">HOD Name</label>
                                        <Input value={deptData.hod} onChange={(e) => setDeptData({ ...deptData, hod: e.target.value })} placeholder="Dr. Name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">HOD Designation</label>
                                        <Input value={deptData.hodDesignation} onChange={(e) => setDeptData({ ...deptData, hodDesignation: e.target.value })} placeholder="Professor & HOD" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium mb-1">HOD Photo URL <span className="text-gray-400 text-xs">(from Firebase Storage)</span></label>
                                    <Input
                                        value={deptData.hodImageUrl}
                                        onChange={(e) => setDeptData({ ...deptData, hodImageUrl: e.target.value })}
                                        placeholder="https://firebasestorage.googleapis.com/..."
                                    />
                                    {deptData.hodImageUrl && (
                                        <div className="mt-3 flex items-center gap-4">
                                            <img
                                                src={deptData.hodImageUrl}
                                                alt="HOD Preview"
                                                className="w-16 h-16 rounded-full object-cover border-2 border-iare-blue"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                            <span className="text-sm text-gray-500">Photo preview</span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Faculty Members */}
                            <section>
                                <div className="flex justify-between items-center border-b pb-2 mb-4">
                                    <h2 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-iare-blue" /> Faculty Members
                                    </h2>
                                    <Button size="sm" onClick={addFaculty} className="bg-iare-blue text-white">
                                        <Plus className="w-4 h-4 mr-1" /> Add Faculty
                                    </Button>
                                </div>
                                {deptData.faculty.length === 0 ? (
                                    <p className="text-gray-400 text-sm italic text-center py-4 bg-gray-50 rounded-lg">No faculty added yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                                            <span>Name</span><span>Designation</span><span>Mobile</span><span>Email</span><span>Profile Link</span><span></span>
                                        </div>
                                        {deptData.faculty.map((member, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-3 items-center bg-gray-50 p-3 rounded-lg">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1 md:hidden">Name</label>
                                                    <Input value={member.name} onChange={(e) => updateFaculty(index, 'name', e.target.value)} placeholder="Dr. Faculty Name" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1 md:hidden">Designation</label>
                                                    <Input value={member.designation} onChange={(e) => updateFaculty(index, 'designation', e.target.value)} placeholder="Associate Professor" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1 md:hidden">Mobile</label>
                                                    <Input value={member.mobile} onChange={(e) => updateFaculty(index, 'mobile', e.target.value)} placeholder="+91 9876543210" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1 md:hidden">Email</label>
                                                    <Input value={member.email} onChange={(e) => updateFaculty(index, 'email', e.target.value)} placeholder="faculty@svuce.edu.in" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1 md:hidden">Profile Link</label>
                                                    <Input value={member.profileLink} onChange={(e) => updateFaculty(index, 'profileLink', e.target.value)} placeholder="https://..." />
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => removeFaculty(index)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Contact */}
                            <section>
                                <h2 className="text-base font-semibold text-gray-700 border-b pb-2 mb-4">Contact Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Contact Email</label>
                                        <Input value={deptData.contact.email} onChange={(e) => setDeptData({ ...deptData, contact: { ...deptData.contact, email: e.target.value } })} placeholder="hod_dept@svuce.edu.in" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Contact Phone</label>
                                        <Input value={deptData.contact.phone} onChange={(e) => setDeptData({ ...deptData, contact: { ...deptData.contact, phone: e.target.value } })} placeholder="+91-xxx-xxxxxxx" />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentManager;
