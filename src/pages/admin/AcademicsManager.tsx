import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Plus, Edit, Trash2, Save, X, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AcademicResource {
    id: string;
    category: string;
    title: string;
    description: string;
    fileUrl: string;
    semester?: string;
    department?: string;
}

const AcademicsManager = () => {
    const [resources, setResources] = useState<AcademicResource[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentResource, setCurrentResource] = useState<Partial<AcademicResource>>({
        category: 'courses',
        title: '',
        description: '',
        fileUrl: '',
        semester: '',
        department: '',
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('courses');
    const [loading, setLoading] = useState(false);

    const categories = [
        { value: 'courses', label: 'Courses Offered' },
        { value: 'calendar', label: 'Academic Calendar' },
        { value: 'exams', label: 'Examination Schedule' },
        { value: 'regulations', label: 'Academic Regulations' },
        { value: 'syllabus', label: 'Syllabus' },
        { value: 'timetables', label: 'Time Tables' },
    ];

    useEffect(() => {
        fetchResources();
    }, [selectedCategory]);

    const fetchResources = async () => {
        try {
            const q = query(collection(db, 'academics'), where('category', '==', selectedCategory));
            const querySnapshot = await getDocs(q);
            const resourcesData: AcademicResource[] = [];
            querySnapshot.forEach((doc) => {
                resourcesData.push({ id: doc.id, ...doc.data() } as AcademicResource);
            });
            setResources(resourcesData);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (editingId) {
                await updateDoc(doc(db, 'academics', editingId), currentResource);
            } else {
                await addDoc(collection(db, 'academics'), currentResource);
            }
            resetForm();
            fetchResources();
        } catch (error) {
            console.error('Error saving resource:', error);
            alert('Failed to save resource');
        }
        setLoading(false);
    };

    const handleEdit = (item: AcademicResource) => {
        setCurrentResource(item);
        setEditingId(item.id);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            try {
                await deleteDoc(doc(db, 'academics', id));
                fetchResources();
            } catch (error) {
                console.error('Error deleting resource:', error);
            }
        }
    };

    const resetForm = () => {
        setCurrentResource({
            category: selectedCategory,
            title: '',
            description: '',
            fileUrl: '',
            semester: '',
            department: '',
        });
        setEditingId(null);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Academics Management</h1>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="bg-iare-blue">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Resource
                    </Button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <label className="block text-sm font-medium mb-2">Filter by Category</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                    {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                </select>
            </div>

            {isEditing && (
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            {editingId ? 'Edit Resource' : 'Add New Resource'}
                        </h2>
                        <Button variant="ghost" onClick={resetForm}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                            value={currentResource.category}
                            onChange={(e) => setCurrentResource({ ...currentResource, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                            value={currentResource.title}
                            onChange={(e) => setCurrentResource({ ...currentResource, title: e.target.value })}
                            placeholder="Resource title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                            value={currentResource.description}
                            onChange={(e) => setCurrentResource({ ...currentResource, description: e.target.value })}
                            placeholder="Resource description"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">File/Document URL</label>
                        <Input
                            value={currentResource.fileUrl}
                            onChange={(e) => setCurrentResource({ ...currentResource, fileUrl: e.target.value })}
                            placeholder="https://example.com/document.pdf"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Semester (Optional)</label>
                            <Input
                                value={currentResource.semester}
                                onChange={(e) => setCurrentResource({ ...currentResource, semester: e.target.value })}
                                placeholder="e.g., Semester 1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Department (Optional)</label>
                            <Input
                                value={currentResource.department}
                                onChange={(e) => setCurrentResource({ ...currentResource, department: e.target.value })}
                                placeholder="e.g., CSE"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={handleSave} disabled={loading} className="bg-iare-blue">
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                        <Button variant="outline" onClick={resetForm}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {resources.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <FileText className="w-5 h-5 text-iare-blue" />
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                {item.semester && (
                                    <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                        {item.semester}
                                    </span>
                                )}
                                {item.department && (
                                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                        {item.department}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 mb-2">{item.description}</p>
                            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-iare-blue hover:underline">
                                View Document →
                            </a>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AcademicsManager;
