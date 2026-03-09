import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Calendar, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      // Simpler query - just get all news and filter/sort in JavaScript
      const querySnapshot = await getDocs(collection(db, 'news'));
      const newsData: NewsItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newsData.push({ id: doc.id, ...data } as NewsItem);
      });

      // Filter and sort in JavaScript
      const filteredNews = newsData
        .filter(item => item.published)
        .sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

      setNewsItems(filteredNews);
      console.log('Fetched news items:', filteredNews.length);
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
              <div key={news.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {news.imageUrl ? (
                    <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-iare-blue opacity-50">
                      <span className="text-4xl font-bold">SVUCE</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-iare-teal hover:bg-teal-700">{news.category}</Badge>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(news.date)}
                  </div>
                  <h3 className="text-xl font-bold text-iare-blue mb-3 line-clamp-2">{news.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">
                    {news.content}
                  </p>

                  <Button variant="ghost" className="w-full justify-between group text-iare-teal hover:text-teal-800 hover:bg-teal-50">
                    Read More <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default News;
