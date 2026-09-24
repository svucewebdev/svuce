
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
    const [selectedRegulation, setSelectedRegulation] = useState<string>("All");
    const [loading, setLoading] = useState(true);

    const defaultRegulations = ['All', 'R25','R23', 'R20',];

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

    const matchesRegulation = (resource: any, reg: string) => {
        if (reg === 'All') return true;
        const target = reg.toLowerCase();
        if (resource.regulation && resource.regulation.trim()) {
            return resource.regulation.toLowerCase() === target;
        }
        // Smart fallback for existing resources without explicit regulation field
        const year = reg.replace(/\D/g, '');
        const fullYear = year ? `20${year}` : '';
        const title = (resource.title || '').toLowerCase();
        const desc = (resource.description || '').toLowerCase();
        return title.includes(target) || (fullYear && title.includes(fullYear)) || desc.includes(target) || (fullYear && desc.includes(fullYear));
    };

    // Helper function to render resources for any category with regulation filter
    const renderResources = (categoryKey: string) => {
        const categoryResources = resources[categoryKey] || [];

        if (categoryResources.length > 0) {
            // Find any additional custom regulations in this category's data
            const customRegulations = Array.from(
                new Set(
                    categoryResources
                        .map((r: any) => r.regulation)
                        .filter((reg: string | undefined): reg is string => Boolean(reg && !defaultRegulations.includes(reg)))
                )
            ) as string[];
            const availableRegulations = [...defaultRegulations, ...customRegulations];

            const filteredResources = categoryResources.filter((r: any) => matchesRegulation(r, selectedRegulation));

            return (
                <div className="space-y-4">
                    {/* Regulation Filter Buttons */}
                    <div className="bg-white p-3 rounded-lg border flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mr-1">
                            Regulation:
                        </span>
                        {availableRegulations.map((reg) => (
                            <Button
                                key={reg}
                                size="sm"
                                variant={selectedRegulation === reg ? "default" : "outline"}
                                className={`text-xs h-8 px-3 transition-all ${
                                    selectedRegulation === reg
                                        ? "bg-iare-blue text-white shadow-sm font-semibold hover:bg-blue-900"
                                        : "bg-white hover:bg-blue-50 text-gray-700 border-gray-200"
                                }`}
                                onClick={() => setSelectedRegulation(reg)}
                            >
                                {reg === 'All' ? 'All Regulations' : reg}
                            </Button>
                        ))}
                    </div>

                    {filteredResources.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
                            <p className="text-base font-medium">No resources found for {selectedRegulation} regulations.</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRegulation('All')}
                                className="mt-3 text-iare-blue border-iare-blue hover:bg-blue-50"
                            >
                                Show All Regulations
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredResources.map((resource: any) => (
                                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <CardTitle className="text-iare-blue text-lg">{resource.title}</CardTitle>
                                            <div className="flex flex-wrap gap-2 flex-shrink-0">
                                                {resource.regulation && (
                                                    <span className="px-2.5 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                                                        {resource.regulation}
                                                    </span>
                                                )}
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
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                                                    <Download className="mr-2 h-4 w-4" /> View/Download
                                                </a>
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
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
                        renderResources('courses')
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
