import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Plus, Edit, Trash2, Save, X, Newspaper } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Skeleton = ({ className }: { className?: string }) => (
    <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
);

const NewsCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-20 w-32 rounded-lg" />
    </div>
);

interface NewsItem {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    category: string;
    date: any;
    published: boolean;
}

const NewsManager = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNews, setCurrentNews] = useState<Partial<NewsItem>>({
        title: '',
        content: '',
        imageUrl: '',
        category: 'General',
        published: true,
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setInitialLoading(true);
        try {
            const q = query(collection(db, 'news'), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            const newsData: NewsItem[] = [];
            querySnapshot.forEach((doc) => {
                newsData.push({ id: doc.id, ...doc.data() } as NewsItem);
            });
            setNews(newsData);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (editingId) {
                await updateDoc(doc(db, 'news', editingId), {
                    ...currentNews,
                    date: new Date(),
                });
            } else {
                await addDoc(collection(db, 'news'), {
                    ...currentNews,
                    date: new Date(),
                });
            }
            resetForm();
            fetchNews();
        } catch (error) {
            console.error('Error saving news:', error);
            alert('Failed to save news item');
        }
        setLoading(false);
    };

    const handleEdit = (item: NewsItem) => {
        setCurrentNews(item);
        setEditingId(item.id);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this news item?')) {
            try {
                await deleteDoc(doc(db, 'news', id));
                fetchNews();
            } catch (error) {
                console.error('Error deleting news:', error);
            }
        }
    };

    const resetForm = () => {
        setCurrentNews({
            title: '',
            content: '',
            imageUrl: '',
            category: 'General',
            published: true,
        });
        setEditingId(null);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="bg-iare-blue">
                        <Plus className="w-4 h-4 mr-2" />
                        Add News
                    </Button>
                )}
            </div>

            {isEditing && (
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            {editingId ? 'Edit News' : 'Add New News'}
                        </h2>
                        <Button variant="ghost" onClick={resetForm}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                            value={currentNews.title}
                            onChange={(e) => setCurrentNews({ ...currentNews, title: e.target.value })}
                            placeholder="News title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Content</label>
                        <Textarea
                            value={currentNews.content}
                            onChange={(e) => setCurrentNews({ ...currentNews, content: e.target.value })}
                            placeholder="News content"
                            rows={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Image URL</label>
                        <Input
                            value={currentNews.imageUrl}
                            onChange={(e) => setCurrentNews({ ...currentNews, imageUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                            value={currentNews.category}
                            onChange={(e) => setCurrentNews({ ...currentNews, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="General">General</option>
                            <option value="Academic">Academic</option>
                            <option value="Event">Event</option>
                            <option value="Achievement">Achievement</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={currentNews.published}
                            onChange={(e) => setCurrentNews({ ...currentNews, published: e.target.checked })}
                            className="mr-2"
                        />
                        <label className="text-sm font-medium">Published</label>
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
                {initialLoading ? (
                    [...Array(3)].map((_, i) => <NewsCardSkeleton key={i} />)
                ) : news.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400">No news items yet. Click "Add News" to create one.</p>
                    </div>
                ) : news.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-start hover:shadow-md transition-shadow">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <span className={`px-2 py-1 rounded text-xs ${item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {item.published ? 'Published' : 'Draft'}
                                </span>
                                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                    {item.category}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-2 line-clamp-2">{item.content}</p>
                            {item.imageUrl && (
                                <img src={item.imageUrl} alt={item.title} className="w-32 h-20 object-cover rounded mt-2" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            )}
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

export default NewsManager;
