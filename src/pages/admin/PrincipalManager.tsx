import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Save, User, Quote } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface LeaderMessage {
    name: string;
    designation: string;
    message: string;
    imageUrl: string;
}

const emptyLeader = (): LeaderMessage => ({ name: '', designation: '', message: '', imageUrl: '' });

const LeaderForm = ({
    title,
    docId,
}: {
    title: string;
    docId: 'principal' | 'vice_principal';
}) => {
    const [data, setData] = useState<LeaderMessage>(emptyLeader());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const snap = await getDoc(doc(db, 'leadership', docId));
                if (snap.exists()) setData(snap.data() as LeaderMessage);
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        fetchData();
    }, [docId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'leadership', docId), data);
            alert(`${title} message saved!`);
        } catch (e) {
            console.error(e);
            alert('Failed to save');
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="bg-white rounded-xl shadow border border-gray-100 p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iare-blue"></div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-iare-blue" /> {title}
                </h2>
                <Button onClick={handleSave} disabled={saving} className="bg-iare-blue">
                    <Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="Dr. Full Name" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Designation</label>
                    <Input value={data.designation} onChange={e => setData({ ...data, designation: e.target.value })} placeholder="Principal, SVUCE" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Photo URL</label>
                    <Input value={data.imageUrl} onChange={e => setData({ ...data, imageUrl: e.target.value })} placeholder="https://firebasestorage.googleapis.com/..." />
                    {data.imageUrl && (
                        <div className="mt-3 flex items-center gap-3">
                            <img src={data.imageUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-iare-blue"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            <span className="text-sm text-gray-500">Photo preview</span>
                        </div>
                    )}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <Textarea value={data.message} onChange={e => setData({ ...data, message: e.target.value })} rows={6}
                        placeholder="Enter the message from the principal..." />
                </div>
            </div>

            {/* Preview */}
            {data.message && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs font-semibold text-iare-blue mb-2 uppercase tracking-wide">Preview</p>
                    <Quote className="w-6 h-6 text-iare-blue opacity-30 mb-1" />
                    <p className="text-gray-600 text-sm italic leading-relaxed">{data.message}</p>
                    <p className="text-right text-sm font-semibold text-gray-800 mt-2">— {data.name || 'Name'}</p>
                    <p className="text-right text-xs text-iare-blue">{data.designation || 'Designation'}</p>
                </div>
            )}
        </div>
    );
};

const PrincipalManager = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <User className="w-8 h-8 text-iare-blue" /> Leadership Messages
            </h1>
            <p className="text-gray-500 text-sm">These messages appear on the About Us page under "Leadership Messages".</p>
            <LeaderForm title="Principal's Message" docId="principal" />
            <LeaderForm title="Vice Principal's Message" docId="vice_principal" />
        </div>
    );
};

export default PrincipalManager;
