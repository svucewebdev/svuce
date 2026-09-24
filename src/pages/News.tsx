import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Calendar, ChevronRight, X, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  date: any;
  published: boolean;
}

const News = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'news'));
      const newsData: NewsItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newsData.push({ id: doc.id, ...data } as NewsItem);
      });

      // Filter and sort in JavaScript
      const filteredNews = newsData
        .filter(item => item.published !== false)
        .sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date || 0);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date || 0);
          return dateB.getTime() - dateA.getTime();
        });

      setNewsItems(filteredNews);

      // Check if there is an id in searchParams to open automatically
      const targetId = searchParams.get('id');
      if (targetId) {
        const targetItem = filteredNews.find(item => item.id === targetId);
        if (targetItem) {
          setSelectedNews(targetItem);
        }
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Error loading news. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iare-blue"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto my-12 px-4 flex-grow">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-iare-blue mb-2">College News & Events</h1>
          <p className="text-gray-600">Stay updated with the latest happenings at SVUCE.</p>
        </div>

        {newsItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No news items available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {newsItems.map((news) => (
              <div
                key={news.id}
                onClick={() => setSelectedNews(news)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer group hover:-translate-y-1"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {news.imageUrl ? (
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-iare-blue opacity-50">
                      <span className="text-4xl font-bold">SVUCE</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-iare-teal hover:bg-teal-700 shadow-sm">{news.category}</Badge>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2 text-iare-blue" />
                    {formatDate(news.date)}
                  </div>
                  <h3 className="text-xl font-bold text-iare-blue mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow leading-relaxed">
                    {news.content}
                  </p>

                  <Button
                    variant="ghost"
                    className="w-full justify-between group-hover:bg-teal-50 text-iare-teal group-hover:text-teal-800 transition-colors font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNews(news);
                    }}
                  >
                    Read More <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full News Details Modal Dialog */}
      <Dialog open={!!selectedNews} onOpenChange={(open) => { if (!open) setSelectedNews(null); }}>
        {selectedNews && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-none shadow-2xl bg-white">
            {/* Header Image if available */}
            {selectedNews.imageUrl && (
              <div className="relative w-full h-64 sm:h-80 bg-gray-100 overflow-hidden">
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-iare-teal text-white border-none shadow-md text-xs font-bold px-3 py-1">
                    {selectedNews.category}
                  </Badge>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1.5 bg-blue-50 text-iare-blue px-3 py-1 rounded-full font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedNews.date)}</span>
                </div>
                {!selectedNews.imageUrl && selectedNews.category && (
                  <Badge className="bg-iare-teal text-white border-none">
                    {selectedNews.category}
                  </Badge>
                )}
              </div>

              <DialogHeader className="text-left space-y-2">
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                  {selectedNews.title}
                </DialogTitle>
              </DialogHeader>

              <div className="prose max-w-none text-gray-700 leading-relaxed text-base pt-2 whitespace-pre-line border-t border-gray-100">
                {selectedNews.content}
              </div>

              {selectedNews.imageUrl && (
                <div className="pt-2">
                  <a
                    href={selectedNews.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-iare-blue hover:underline bg-blue-50 px-3 py-1.5 rounded-lg"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View original full-size image
                  </a>
                </div>
              )}

              <div className="pt-6 border-t flex justify-end">
                <Button
                  onClick={() => setSelectedNews(null)}
                  className="bg-iare-blue hover:bg-blue-900 text-white px-6"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Footer />
    </div>
  );
};

export default News;
