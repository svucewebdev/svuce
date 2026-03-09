import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Plus, Edit, Trash2, Save, X, Building2, Quote } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Skeleton = ({ className }: { className?: string }) => (
    <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
);

const RowSkeleton = () => (
    <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
            </div>
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
        </div>
    </div>
);

const PlacementsManager = () => {
    const [activeTab, setActiveTab] = useState('stats');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [stats, setStats] = useState<any>(null);
    const [statsForm, setStatsForm] = useState({ year: '', placementRate: 0, highestPackage: '', averagePackage: '', companiesVisited: 0 });
    const [editingStats, setEditingStats] = useState(false);

    const [recruiters, setRecruiters] = useState<any[]>([]);
    const [recruiterForm, setRecruiterForm] = useState({ companyName: '', logoUrl: '', order: 1 });
    const [editingRecruiterId, setEditingRecruiterId] = useState<string | null>(null);
    const [showRecruiterForm, setShowRecruiterForm] = useState(false);

    const [placements, setPlacements] = useState<any[]>([]);
    const [placementForm, setPlacementForm] = useState({ studentName: '', company: '', package: '', role: '', department: '', year: '', imageUrl: '' });
    const [editingPlacementId, setEditingPlacementId] = useState<string | null>(null);
    const [showPlacementForm, setShowPlacementForm] = useState(false);

    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [testimonialForm, setTestimonialForm] = useState({ studentName: '', company: '', quote: '', imageUrl: '', year: '' });
    const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
    const [showTestimonialForm, setShowTestimonialForm] = useState(false);

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        setInitialLoading(true);
        await Promise.all([fetchStats(), fetchRecruiters(), fetchPlacements(), fetchTestimonials()]);
        setInitialLoading(false);
    };

    const fetchStats = async () => {
        const snapshot = await getDocs(query(collection(db, 'placementStats'), orderBy('year', 'desc')));
        if (!snapshot.empty) { const d = snapshot.docs[0]; setStats({ id: d.id, ...d.data() }); setStatsForm(d.data() as any); }
    };

    const handleSaveStats = async () => {
        setLoading(true);
        try {
            stats?.id ? await updateDoc(doc(db, 'placementStats', stats.id), statsForm) : await addDoc(collection(db, 'placementStats'), statsForm);
            await fetchStats(); setEditingStats(false); alert('Saved!');
        } catch { alert('Failed'); }
        setLoading(false);
    };

    const fetchRecruiters = async () => {
        const s = await getDocs(query(collection(db, 'recruiters'), orderBy('order', 'asc')));
        setRecruiters(s.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    const handleSaveRecruiter = async () => {
        setLoading(true);
        try {
            editingRecruiterId ? await updateDoc(doc(db, 'recruiters', editingRecruiterId), recruiterForm) : await addDoc(collection(db, 'recruiters'), recruiterForm);
            await fetchRecruiters(); resetRecruiterForm();
        } catch { alert('Failed'); }
        setLoading(false);
    };

    const resetRecruiterForm = () => { setRecruiterForm({ companyName: '', logoUrl: '', order: recruiters.length + 1 }); setEditingRecruiterId(null); setShowRecruiterForm(false); };

    const fetchPlacements = async () => {
        const s = await getDocs(query(collection(db, 'placements'), orderBy('year', 'desc')));
        setPlacements(s.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    const handleSavePlacement = async () => {
        setLoading(true);
        try {
            editingPlacementId ? await updateDoc(doc(db, 'placements', editingPlacementId), placementForm) : await addDoc(collection(db, 'placements'), placementForm);
            await fetchPlacements(); resetPlacementForm();
        } catch { alert('Failed'); }
        setLoading(false);
    };

    const resetPlacementForm = () => { setPlacementForm({ studentName: '', company: '', package: '', role: '', department: '', year: '', imageUrl: '' }); setEditingPlacementId(null); setShowPlacementForm(false); };

    const fetchTestimonials = async () => {
        const s = await getDocs(query(collection(db, 'testimonials'), orderBy('year', 'desc')));
        setTestimonials(s.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    const handleSaveTestimonial = async () => {
        setLoading(true);
        try {
            editingTestimonialId ? await updateDoc(doc(db, 'testimonials', editingTestimonialId), testimonialForm) : await addDoc(collection(db, 'testimonials'), testimonialForm);
            await fetchTestimonials(); resetTestimonialForm();
        } catch { alert('Failed'); }
        setLoading(false);
    };

    const resetTestimonialForm = () => { setTestimonialForm({ studentName: '', company: '', quote: '', imageUrl: '', year: '' }); setEditingTestimonialId(null); setShowTestimonialForm(false); };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Placements Management</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                    <TabsTrigger value="recruiters">Recruiters ({recruiters.length})</TabsTrigger>
                    <TabsTrigger value="placements">Placements ({placements.length})</TabsTrigger>
                    <TabsTrigger value="testimonials">Testimonials ({testimonials.length})</TabsTrigger>
                </TabsList>

                {/* Statistics */}
                <TabsContent value="stats" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Placement Statistics</h2>
                        {!editingStats && <Button onClick={() => setEditingStats(true)} className="bg-iare-blue"><Edit className="w-4 h-4 mr-2" />Edit</Button>}
                    </div>
                    {editingStats ? (
                        <div className="bg-white rounded-lg shadow p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Academic Year', key: 'year', placeholder: '2023-24', type: 'text' },
                                    { label: 'Placement Rate (%)', key: 'placementRate', placeholder: '95', type: 'number' },
                                    { label: 'Highest Package', key: 'highestPackage', placeholder: '45 LPA', type: 'text' },
                                    { label: 'Average Package', key: 'averagePackage', placeholder: '8.5 LPA', type: 'text' },
                                    { label: 'Companies Visited', key: 'companiesVisited', placeholder: '150', type: 'number' },
                                ].map(({ label, key, placeholder, type }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium mb-2">{label}</label>
                                        <Input type={type} value={(statsForm as any)[key]} onChange={(e) => setStatsForm({ ...statsForm, [key]: type === 'number' ? Number(e.target.value) : e.target.value })} placeholder={placeholder} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={handleSaveStats} disabled={loading} className="bg-iare-blue"><Save className="w-4 h-4 mr-2" />{loading ? 'Saving...' : 'Save'}</Button>
                                <Button variant="outline" onClick={() => setEditingStats(false)}>Cancel</Button>
                            </div>
                        </div>
                    ) : initialLoading ? (
                        <div className="bg-white rounded-lg shadow p-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[...Array(5)].map((_, i) => <div key={i}><Skeleton className="h-3 w-24 mb-2" /><Skeleton className="h-7 w-16" /></div>)}
                        </div>
                    ) : stats ? (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div><p className="text-sm text-gray-500">Year</p><p className="text-xl font-bold">{stats.year}</p></div>
                                <div><p className="text-sm text-gray-500">Placement Rate</p><p className="text-xl font-bold text-blue-600">{stats.placementRate}%</p></div>
                                <div><p className="text-sm text-gray-500">Highest Package</p><p className="text-xl font-bold text-green-600">{stats.highestPackage}</p></div>
                                <div><p className="text-sm text-gray-500">Average Package</p><p className="text-xl font-bold text-purple-600">{stats.averagePackage}</p></div>
                                <div><p className="text-sm text-gray-500">Companies</p><p className="text-xl font-bold text-orange-600">{stats.companiesVisited}+</p></div>
                            </div>
                        </div>
                    ) : <p className="text-gray-500 bg-white rounded-lg shadow p-6">No stats yet. Click "Edit" to add.</p>}
                </TabsContent>

                {/* Recruiters */}
                <TabsContent value="recruiters" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Top Recruiters</h2>
                        {!showRecruiterForm && <Button onClick={() => setShowRecruiterForm(true)} className="bg-iare-blue"><Plus className="w-4 h-4 mr-2" />Add</Button>}
                    </div>
                    {showRecruiterForm && (
                        <div className="bg-white rounded-lg shadow p-6 space-y-4">
                            <div className="flex justify-between"><h3 className="text-lg font-semibold">{editingRecruiterId ? 'Edit' : 'Add'} Recruiter</h3><Button variant="ghost" onClick={resetRecruiterForm}><X className="w-5 h-5" /></Button></div>
                            <div className="grid grid-cols-3 gap-4">
                                <div><label className="block text-sm font-medium mb-2">Company Name</label><Input value={recruiterForm.companyName} onChange={(e) => setRecruiterForm({ ...recruiterForm, companyName: e.target.value })} placeholder="Google" /></div>
                                <div><label className="block text-sm font-medium mb-2">Logo URL</label><Input value={recruiterForm.logoUrl} onChange={(e) => setRecruiterForm({ ...recruiterForm, logoUrl: e.target.value })} placeholder="https://..." /></div>
                                <div><label className="block text-sm font-medium mb-2">Order</label><Input type="number" value={recruiterForm.order} onChange={(e) => setRecruiterForm({ ...recruiterForm, order: Number(e.target.value) })} /></div>
                            </div>
                            {recruiterForm.logoUrl && <div className="flex items-center gap-3"><img src={recruiterForm.logoUrl} alt="preview" className="h-10 border rounded px-2 py-1 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /><span className="text-xs text-gray-400">Preview</span></div>}
                            <div className="flex gap-3"><Button onClick={handleSaveRecruiter} disabled={loading} className="bg-iare-blue"><Save className="w-4 h-4 mr-2" />{loading ? 'Saving...' : 'Save'}</Button><Button variant="outline" onClick={resetRecruiterForm}>Cancel</Button></div>
                        </div>
                    )}
                    <div className="space-y-3">
                        {initialLoading ? [...Array(4)].map((_, i) => <RowSkeleton key={i} />) : recruiters.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    {item.logoUrl && item.logoUrl !== '#' ? <img src={item.logoUrl} alt={item.companyName} className="h-8 w-20 object-contain border rounded p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : <Building2 className="w-8 h-8 text-iare-blue" />}
                                    <div><h3 className="font-semibold">{item.companyName}</h3><p className="text-sm text-gray-500">Order #{item.order}</p></div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => { setRecruiterForm(item); setEditingRecruiterId(item.id); setShowRecruiterForm(true); }}><Edit className="w-4 h-4" /></Button>
                                    <Button variant="outline" size="sm" onClick={async () => { if (confirm('Delete?')) { await deleteDoc(doc(db, 'recruiters', item.id)); fetchRecruiters(); } }}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Placement Records */}
                <TabsContent value="placements" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Placement Records</h2>
                        {!showPlacementForm && <Button onClick={() => setShowPlacementForm(true)} className="bg-iare-blue"><Plus className="w-4 h-4 mr-2" />Add</Button>}
                    </div>
                    {showPlacementForm && (
                        <div className="bg-white rounded-lg shadow p-6 space-y-4">
                            <div className="flex justify-between"><h3 className="text-lg font-semibold">{editingPlacementId ? 'Edit' : 'Add'} Placement</h3><Button variant="ghost" onClick={resetPlacementForm}><X className="w-5 h-5" /></Button></div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Student Name', key: 'studentName', placeholder: 'Rajesh Kumar' },
                                    { label: 'Company', key: 'company', placeholder: 'Google' },
                                    { label: 'Role / Designation', key: 'role', placeholder: 'Software Engineer' },
                                    { label: 'Package', key: 'package', placeholder: '42 LPA' },
                                    { label: 'Department', key: 'department', placeholder: 'CSE' },
                                    { label: 'Year (Batch)', key: 'year', placeholder: '2024' },
                                ].map(({ label, key, placeholder }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium mb-2">{label}</label>
                                        <Input value={(placementForm as any)[key]} onChange={(e) => setPlacementForm({ ...placementForm, [key]: e.target.value })} placeholder={placeholder} />
                                    </div>
                                ))}
                                <div className="col-span-2"><label className="block text-sm font-medium mb-2">Photo URL (Optional)</label><Input value={placementForm.imageUrl} onChange={(e) => setPlacementForm({ ...placementForm, imageUrl: e.target.value })} placeholder="https://..." /></div>
                            </div>
                            <div className="flex gap-3"><Button onClick={handleSavePlacement} disabled={loading} className="bg-iare-blue"><Save className="w-4 h-4 mr-2" />{loading ? 'Saving...' : 'Save'}</Button><Button variant="outline" onClick={resetPlacementForm}>Cancel</Button></div>
                        </div>
                    )}
                    <div className="space-y-3">
                        {initialLoading ? [...Array(5)].map((_, i) => <RowSkeleton key={i} />) : placements.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-iare-blue flex items-center justify-center text-white text-sm font-bold overflow-hidden flex-shrink-0">
                                        {item.imageUrl && item.imageUrl !== '#' ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : item.studentName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{item.studentName}</h3>
                                        <p className="text-sm text-iare-blue">{item.company}{item.role ? ` · ${item.role}` : ''} · <span className="text-green-600 font-medium">{item.package}</span></p>
                                        <p className="text-xs text-gray-400">{item.department} · {item.year}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => { setPlacementForm({...item, role: item.role || ''}); setEditingPlacementId(item.id); setShowPlacementForm(true); }}><Edit className="w-4 h-4" /></Button>
                                    <Button variant="outline" size="sm" onClick={async () => { if (confirm('Delete?')) { await deleteDoc(doc(db, 'placements', item.id)); fetchPlacements(); } }}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Testimonials */}
                <TabsContent value="testimonials" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Student Testimonials</h2>
                        {!showTestimonialForm && <Button onClick={() => setShowTestimonialForm(true)} className="bg-iare-blue"><Plus className="w-4 h-4 mr-2" />Add</Button>}
                    </div>
                    {showTestimonialForm && (
                        <div className="bg-white rounded-lg shadow p-6 space-y-4">
                            <div className="flex justify-between"><h3 className="text-lg font-semibold">{editingTestimonialId ? 'Edit' : 'Add'} Testimonial</h3><Button variant="ghost" onClick={resetTestimonialForm}><X className="w-5 h-5" /></Button></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-2">Student Name</label><Input value={testimonialForm.studentName} onChange={(e) => setTestimonialForm({ ...testimonialForm, studentName: e.target.value })} placeholder="Priya Sharma" /></div>
                                <div><label className="block text-sm font-medium mb-2">Company</label><Input value={testimonialForm.company} onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })} placeholder="Microsoft" /></div>
                                <div><label className="block text-sm font-medium mb-2">Year</label><Input value={testimonialForm.year} onChange={(e) => setTestimonialForm({ ...testimonialForm, year: e.target.value })} placeholder="2023" /></div>
                                <div><label className="block text-sm font-medium mb-2">Photo URL (Optional)</label><Input value={testimonialForm.imageUrl} onChange={(e) => setTestimonialForm({ ...testimonialForm, imageUrl: e.target.value })} placeholder="https://..." /></div>
                                <div className="col-span-2"><label className="block text-sm font-medium mb-2">Quote / Testimonial</label><Textarea value={testimonialForm.quote} onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} placeholder="Student's experience..." rows={3} /></div>
                            </div>
                            <div className="flex gap-3"><Button onClick={handleSaveTestimonial} disabled={loading} className="bg-iare-blue"><Save className="w-4 h-4 mr-2" />{loading ? 'Saving...' : 'Save'}</Button><Button variant="outline" onClick={resetTestimonialForm}>Cancel</Button></div>
                        </div>
                    )}
                    <div className="space-y-3">
                        {initialLoading ? [...Array(4)].map((_, i) => <RowSkeleton key={i} />) : testimonials.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <Quote className="w-5 h-5 text-iare-blue flex-shrink-0" />
                                        <div><h3 className="font-semibold">{item.studentName}</h3><p className="text-sm text-iare-blue">{item.company} · {item.year}</p></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => { setTestimonialForm(item); setEditingTestimonialId(item.id); setShowTestimonialForm(true); }}><Edit className="w-4 h-4" /></Button>
                                        <Button variant="outline" size="sm" onClick={async () => { if (confirm('Delete?')) { await deleteDoc(doc(db, 'testimonials', item.id)); fetchTestimonials(); } }}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic text-sm mt-2 ml-8 line-clamp-2">"{item.quote}"</p>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PlacementsManager;
