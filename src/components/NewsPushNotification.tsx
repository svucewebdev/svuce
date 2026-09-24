import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Bell, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NewsItem {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    category?: string;
    date?: any;
    published?: boolean;
}

const NewsPushNotification: React.FC = () => {
    const [latestNews, setLatestNews] = useState<NewsItem | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Listen in real-time for news updates
        const q = query(collection(db, 'news'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newsList: NewsItem[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.published !== false) {
                    newsList.push({ id: doc.id, ...data } as NewsItem);
                }
            });

            // Sort by date descending
            newsList.sort((a, b) => {
                const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date || 0);
                const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date || 0);
                return dateB.getTime() - dateA.getTime();
            });

            if (newsList.length > 0) {
                const newest = newsList[0];
                const isDismissed = sessionStorage.getItem(`svuce_dismissed_news_${newest.id}`);
                if (!isDismissed) {
                    setLatestNews(newest);
                    // Add slight delay for smooth entrance after page load
                    const timer = setTimeout(() => {
                        setIsVisible(true);
                    }, 1000);
                    return () => clearTimeout(timer);
                }
            }
        }, (error) => {
            console.error('Error listening to news:', error);
        });

        return () => unsubscribe();
    }, []);

    const handleDismiss = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (latestNews) {
            sessionStorage.setItem(`svuce_dismissed_news_${latestNews.id}`, 'true');
        }
        setIsVisible(false);
    };

    const handleOpenNews = () => {
        setIsVisible(false);
        if (latestNews) {
            navigate(`/news?id=${latestNews.id}`);
        } else {
            navigate('/news');
        }
    };

    const formatNotificationTime = (date: any) => {
        if (!date) return 'Just now';
        const d = date.toDate ? date.toDate() : new Date(date);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 5) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (!latestNews) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <m.div
                    initial={{ y: -80, opacity: 0, scale: 0.94 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -60, opacity: 0, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    className="fixed top-4 left-3 right-3 sm:left-auto sm:right-6 sm:top-24 md:top-28 md:right-8 z-[9999] sm:max-w-md w-auto sm:w-[24rem] md:w-[26rem] cursor-pointer"
                    onClick={handleOpenNews}
                >
                    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-200/80 hover:border-iare-teal transition-all overflow-hidden ring-1 ring-black/10 hover:shadow-blue-900/15">
                        {/* Notification Header */}
                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-blue-50/90 via-white to-blue-50/60 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-iare-blue flex items-center justify-center text-white shadow-sm flex-shrink-0">
                                    <Bell className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-bold text-iare-blue tracking-wide uppercase">
                                    SVUCE News
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="text-[11px] text-gray-500 font-medium">
                                    {formatNotificationTime(latestNews.date)}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleDismiss}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors p-1"
                                title="Dismiss notification"
                                aria-label="Dismiss notification"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Notification Content Body */}
                        <div className="p-3.5 sm:p-4 flex gap-3 items-start">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                                    {latestNews.category && (
                                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-iare-teal/10 text-iare-teal border border-iare-teal/20">
                                            {latestNews.category}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                        <Sparkles className="w-2.5 h-2.5" /> New Update
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-iare-blue transition-colors">
                                    {latestNews.title}
                                </h4>
                                <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                                    {latestNews.content}
                                </p>
                            </div>

                            {/* Optional Thumbnail Image */}
                            {latestNews.imageUrl && (
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                                    <img
                                        src={latestNews.imageUrl}
                                        alt={latestNews.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Notification Action Buttons */}
                        <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-gray-50/90 border-t border-gray-100 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handleDismiss}
                                className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors px-2 py-1"
                            >
                                Dismiss
                            </button>

                            <Button
                                size="sm"
                                className="bg-iare-blue hover:bg-blue-900 text-white text-xs h-7 px-3.5 rounded-full flex items-center gap-1 shadow-sm font-medium"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenNews();
                                }}
                            >
                                <span>Read News</span>
                                <ArrowRight className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    );
};

export default NewsPushNotification;
