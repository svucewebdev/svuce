import React, { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import {
  ArrowRight, BookOpen, Calendar, ChevronRight, Code, Globe,
  Briefcase, Book, GraduationCap, Brain, Server, Grid, Network, HardHat, Lightbulb, Wrench, Wifi, Terminal, Microscope,
  Bell, GraduationCap as Admission, FileText, ExternalLink
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";

const Index = () => {
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeTab, setActiveTab] = useState<'circulars' | 'admissions' | 'events' | 'mous'>('circulars');
  const [announcements, setAnnouncements] = useState<{ circulars: any[]; admissions: any[]; events: any[]; mous: any[] }>({
    circulars: [], admissions: [], events: [], mous: []
  });
  const [loadingAnn, setLoadingAnn] = useState(true);

  useEffect(() => {
    fetchLatestNews();
    fetchAnnouncements();
  }, []);

  const fetchLatestNews = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'news'));
      const newsData: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newsData.push({ id: doc.id, ...data });
      });
      const filteredNews = newsData
        .filter(item => item.published)
        .sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 3);
      setLatestNews(filteredNews);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLatestNews([]);
    } finally {
      setLoadingNews(false);
    }
  };

  const fetchAnnouncements = async () => {
    setLoadingAnn(true);
    try {
      const fetchCol = async (col: string) => {
        const snap = await getDocs(collection(db, col));
        return snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter((item: any) => item.published !== false)
          .sort((a: any, b: any) => {
            const da = a.date?.toDate ? a.date.toDate() : new Date(a.date || 0);
            const db2 = b.date?.toDate ? b.date.toDate() : new Date(b.date || 0);
            return db2.getTime() - da.getTime();
          })
          .slice(0, 5);
      };
      const [circulars, admissions, events, mous] = await Promise.all([
        fetchCol('circulars'),
        fetchCol('admissions'),
        fetchCol('events'),
        fetchCol('mous'),
      ]);
      setAnnouncements({ circulars, admissions, events, mous });
    } catch (e) {
      console.error('Error fetching announcements:', e);
    } finally {
      setLoadingAnn(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const carouselImages = [
    {
      url: "https://www.igs.org.in/storage/local-chapter-student/SVUCE-210923112923.jpg",
      title: "Excellence in Engineering Education"
    },

    {
      url: "https://svuniversity.edu.in/storage/2022/10/Computer-Science-and-Engineering-Lab-3-scaled.jpg",
      title: "Research and Innovation Hub"
    }
  ];


  const cseSpecializations = [
    {
      title: "Artificial Intelligence & Machine Learning",
      icon: <Brain className="w-8 h-8 text-iare-blue" />,
      description: "Exploring neural networks, deep learning, natural language processing, and computer vision applications."
    },
    {
      title: "Cloud Computing & DevOps",
      icon: <Server className="w-8 h-8 text-iare-teal" />,
      description: "Learning cloud architecture, virtualization, containerization, and CI/CD pipelines."
    },
    {
      title: "Data Science & Big Data Analytics",
      icon: <Grid className="w-8 h-8 text-iare-yellow" />,
      description: "Analyzing large datasets, data visualization, statistical modeling, and predictive analytics."
    },
    {
      title: "Internet of Things & Embedded Systems",
      icon: <Network className="w-8 h-8 text-iare-blue" />,
      description: "Building connected devices, sensor networks, and real-time systems for smart applications."
    },
    {
      title: "Cyber Security & Blockchain",
      icon: <Code className="w-8 h-8 text-iare-teal" />,
      description: "Implementing security protocols, ethical hacking, digital forensics, and blockchain applications."
    },
    {
      title: "Web & Mobile Development",
      icon: <Globe className="w-8 h-8 text-iare-yellow" />,
      description: "Creating responsive web applications and cross-platform mobile solutions with modern frameworks."
    }
  ];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const intervalId = setInterval(() => {
      carouselApi.scrollNext();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [carouselApi]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
          <Carousel setApi={setCarouselApi} className="w-full h-full" opts={{ loop: true }}>
            <CarouselContent className="h-full">
              {carouselImages.map((image, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
                    <m.div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${image.url})` }}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 20, ease: "linear" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
                    </m.div>
                    <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 container mx-auto">
                      <div className="max-w-4xl">
                        <m.h1
                          className="text-xs sm:text-sm md:text-base font-semibold text-white/90 mb-3 sm:mb-4 uppercase tracking-wider"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          Welcome To
                        </m.h1>
                        <m.h2
                          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-5 md:mb-6 leading-tight"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        >
                          {image.title}
                        </m.h2>
                        <m.p
                          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-7 md:mb-8 font-light max-w-3xl"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        >
                          65 Years of Unwavering Trust, Shaping Future Engineers
                        </m.p>
                        <m.div
                          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                        >
                          <Link
                            to="/departments"
                            className="inline-flex items-center justify-center bg-iare-blue hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1"
                          >
                            Explore Programs
                          </Link>
                          <Link
                            to="/about-us"
                            className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-md transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                          >
                            Learn More
                          </Link>
                        </m.div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows - Always Visible */}
            <CarouselPrevious className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-iare-blue hover:border-iare-blue w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full transition-all duration-300 hover:scale-110 shadow-lg" />
            <CarouselNext className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-iare-blue hover:border-iare-blue w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full transition-all duration-300 hover:scale-110 shadow-lg" />

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 flex justify-center gap-2 sm:gap-2.5 md:gap-3 z-20">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  className="w-8 sm:w-10 md:w-12 h-1 sm:h-1.5 rounded-full bg-white/30 hover:bg-white transition-all duration-300 hover:w-12 sm:hover:w-14 md:hover:w-16"
                  onClick={() => carouselApi?.scrollTo(index)}
                />
              ))}
            </div>
          </Carousel>
        </section>

        {/* Circulars / Admissions / Events */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">

            {/* Tab Buttons */}
            <div className="flex justify-center gap-2 mb-8">
              {([
                { key: 'circulars', label: 'Circulars', icon: FileText },
                { key: 'admissions', label: 'Admissions', icon: Admission },
                { key: 'events', label: 'Events', icon: Bell },
                { key: 'mous', label: 'MOUs', icon: Briefcase },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 border ${activeTab === key
                    ? 'bg-iare-blue text-white border-iare-blue shadow-md'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-iare-blue hover:text-iare-blue'
                    }`}
                >
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="max-w-3xl mx-auto">
              {loadingAnn ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-iare-blue"></div>
                </div>
              ) : announcements[activeTab].length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm italic">No {activeTab} posted yet.</div>
              ) : (
                <div className="space-y-3">
                  {announcements[activeTab].map((item: any, idx: number) => (
                    <m.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.05 }}
                      className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md hover:border-iare-blue transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        {activeTab === 'circulars' && <FileText className="w-5 h-5 text-iare-blue" />}
                        {activeTab === 'admissions' && <Admission className="w-5 h-5 text-iare-blue" />}
                        {activeTab === 'events' && <Bell className="w-5 h-5 text-iare-blue" />}
                        {activeTab === 'mous' && <Briefcase className="w-5 h-5 text-iare-blue" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 leading-snug">{item.title}</p>
                        {item.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                        {item.date && (
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {(item.date?.toDate ? item.date.toDate() : new Date(item.date)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer"
                          className="flex-shrink-0 text-iare-blue hover:underline text-sm flex items-center gap-1">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </m.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Departments Preview */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <span className="bg-blue-100 text-iare-blue px-4 py-1 rounded-full text-sm font-semibold mb-8 inline-block">
              Departments
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[
                { title: "Civil Engineering", slug: "civ", icon: <HardHat className="w-8 h-8 text-iare-blue" />, desc: "Designing sustainable infrastructure for the future." },
                { title: "Electrical & Electronics", slug: "eee", icon: <Lightbulb className="w-8 h-8 text-iare-teal" />, desc: "Powering the world with innovative electrical systems." },
                { title: "Mechanical Engineering", slug: "mechanical", icon: <Wrench className="w-8 h-8 text-iare-yellow" />, desc: "Pioneering mechanics, robotics, and manufacturing." },
                { title: "Electronics & Communication", slug: "ece", icon: <Wifi className="w-8 h-8 text-iare-blue" />, desc: "Advancing communication technologies and electronics." },
                { title: "Computer Science", slug: "cse", icon: <Terminal className="w-8 h-8 text-iare-teal" />, desc: "Leading the digital revolution with software and AI." },
                { title: "Humanities & Sciences", slug: "sciences", icon: <Microscope className="w-8 h-8 text-iare-yellow" />, desc: "Strong foundations in science, mathematics, and humanities." }
              ].map((dept, index) => (
                <Link key={index} to={`/departments/${dept.slug}`}>
                  <m.div
                    className="bg-white p-8 border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all group h-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -5, borderColor: "var(--iare-blue)", transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center mb-4">
                      <m.div
                        className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {dept.icon}
                      </m.div>
                      <h3 className="text-lg font-semibold ml-4 group-hover:text-iare-blue">{dept.title}</h3>
                    </div>
                    <p className="text-gray-600">{dept.desc}</p>
                    <div className="mt-4 flex items-center text-iare-blue font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </m.div>
                </Link>
              ))}
            </div>
            <div className="mt-12">
              <Link to="/departments" className="bg-iare-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">View All Departments</Link>
            </div>
          </div>
        </section>

        {/* News */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-12">
              <span className="bg-blue-100 text-iare-blue px-4 py-1 rounded-full text-lg font-semibold mb-8 inline-block">
                Latest News
              </span>
              <Link to="/news" className="text-iare-blue font-semibold flex items-center group hover:text-blue-700">
                View All News <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {loadingNews ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iare-blue"></div>
                </div>
              ) : latestNews.length > 0 ? (
                latestNews.map((item, index) => (
                  <m.div
                    key={index}
                    className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg transition-all group"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(item.date)}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.content}</p>
                    <Link to="/news" className="text-iare-blue font-medium flex items-center group-hover:text-blue-700">
                      Read More <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </m.div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No news available</p>
              )}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>

  );
};

export default Index;
