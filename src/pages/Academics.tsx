
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Calendar, Clock, BookOpen, FileText, GraduationCap, ClipboardList, Download, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Academics = () => {
    const [activeTab, setActiveTab] = useState("courses");
    const [resources, setResources] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const categories = ['courses', 'calendar', 'exams', 'regulations', 'syllabus', 'timetables'];
            const resourcesData: any = {};

            for (const category of categories) {
                const q = query(collection(db, 'academics'), where('category', '==', category));
                const querySnapshot = await getDocs(q);
                resourcesData[category] = [];
                querySnapshot.forEach((doc) => {
                    resourcesData[category].push({ id: doc.id, ...doc.data() });
                });
            }

            setResources(resourcesData);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to render resources for any category
    const renderResources = (categoryKey: string) => {
        const categoryResources = resources[categoryKey] || [];

        if (categoryResources.length > 0) {
            return (
                <div className="grid grid-cols-1 gap-4">
                    {categoryResources.map((resource: any) => (
                        <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-iare-blue">{resource.title}</CardTitle>
                                    <div className="flex gap-2">
                                        {resource.semester && (
                                            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                                {resource.semester}
                                            </span>
                                        )}
                                        {resource.department && (
                                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                                {resource.department}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <CardDescription>{resource.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {resource.fileUrl && resource.fileUrl !== '#' && (
                                    <Button variant="outline" asChild>
                                        <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" /> View/Download
                                        </a>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            );
        }

        return (
            <div className="text-center py-8 text-gray-500">
                <p>No resources available. Add resources from the Admin CRM.</p>
            </div>
        );
    };

    const academicSections = [
        {
            id: "courses",
            title: "Courses Offered",
            icon: <GraduationCap className="h-5 w-5" />,
            content: (
                <div className="space-y-6">
                    {resources.courses && resources.courses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {resources.courses.map((resource: any) => (
                                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-iare-blue">{resource.title}</CardTitle>
                                        <CardDescription>{resource.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {resource.fileUrl && resource.fileUrl !== '#' && (
                                            <Button variant="outline" asChild>
                                                <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                                                    <Download className="mr-2 h-4 w-4" /> View Details
                                                </a>
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-iare-blue">Undergraduate Programs (B.Tech)</CardTitle>
                                    <CardDescription>4-Year Full-Time Programs</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        <li className="flex items-center"><ChevronRight className="h-4 w-4 text-iare-teal mr-2" /> Civil Engineering</li>
                                        <li className="flex items-center"><ChevronRight className="h-4 w-4 text-iare-teal mr-2" /> Electrical & Electronics Engineering</li>
                                        <li className="flex items-center"><ChevronRight className="h-4 w-4 text-iare-teal mr-2" /> Mechanical Engineering</li>
                                        <li className="flex items-center"><ChevronRight className="h-4 w-4 text-iare-teal mr-2" /> Electronics & Communication Engineering</li>
                                        <li className="flex items-center"><ChevronRight className="h-4 w-4 text-iare-teal mr-2" /> Computer Science & Engineering</li>
                                        <li className="flex items-center"><ChevronRight className="h-4 w-4 text-iare-teal mr-2" /> Chemical Engineering</li>
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-iare-blue">Postgraduate Programs (M.Tech)</CardTitle>
                                    <CardDescription>2-Year Full-Time Programs</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        <li className="flex items-center"><ChevronRight className="h-4 w-4 text-iare-teal mr-2" /> Structural Engineering</li>
                                        <li className="flex items-center"><ChevronRight className="h-4 w-4 text-iare-teal mr-2" /> Power Systems</li>
                                        <li className="flex items-center"><ChevronRight className="h-4 w-4 text-iare-teal mr-2" /> CAD/CAM</li>
                                        <li className="flex items-center"><ChevronRight className="h-4 w-4 text-iare-teal mr-2" /> VLSI Design</li>
                                        <li className="flex items-center"><ChevronRight className="h-4 w-4 text-iare-teal mr-2" /> Computer Science</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            )
        },
        {
            id: "calendar",
            title: "Academic Calendar",
            icon: <Calendar className="h-5 w-5" />,
            content: (
                <div className="space-y-4">
                    {renderResources('calendar')}
                </div>
            )
        },
        {
            id: "exams",
            title: "Examination Schedule",
            icon: <ClipboardList className="h-5 w-5" />,
            content: (
                <div className="space-y-4">
                    {renderResources('exams')}
                </div>
            )
        },
        {
            id: "regulations",
            title: "Academic Regulations",
            icon: <BookOpen className="h-5 w-5" />,
            content: (
                <div className="space-y-4">
                    {renderResources('regulations')}
                </div>
            )
        },
        {
            id: "syllabus",
            title: "Syllabus",
            icon: <FileText className="h-5 w-5" />,
            content: (
                <div className="space-y-4">
                    {renderResources('syllabus')}
                </div>
            )
        },
        {
            id: "timetables",
            title: "Time Tables",
            icon: <Clock className="h-5 w-5" />,
            content: (
                <div className="space-y-4">
                    {renderResources('timetables')}
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto my-12 px-4 flex-grow">

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden min-h-[600px]">
                    <div className="md:grid md:grid-cols-4 h-full">
                        {/* Sidebar Navigation */}
                        <div className="bg-gray-50 border-r p-4 md:col-span-1">
                            <nav className="space-y-1">
                                {academicSections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveTab(section.id)}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === section.id
                                            ? 'bg-iare-blue text-white shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="mr-3">{section.icon}</span>
                                        {section.title}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 md:col-span-3 overflow-y-auto">
                            {academicSections.map((section) => (
                                <div key={section.id} className={activeTab === section.id ? 'block' : 'hidden'}>
                                    <div className="mb-6 pb-2 border-b">
                                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                            {section.icon && <span className="mr-3 p-2 bg-blue-50 rounded-full text-iare-blue">{section.icon}</span>}
                                            {section.title}
                                        </h2>
                                    </div>
                                    <div className="animate-in fade-in duration-300">
                                        {section.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Academics;
