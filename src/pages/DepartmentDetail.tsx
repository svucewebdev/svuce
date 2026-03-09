import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { departmentData } from '../data/departmentData';
import { ChevronRight, Mail, Phone, BookOpen, Users, GraduationCap, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NotFound from './NotFound';

interface FacultyMember {
    name: string;
    designation: string;
    qualification: string;
}

const DepartmentDetail = () => {
    const { id } = useParams();
    const [department, setDepartment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDepartment();
    }, [id]);

    const fetchDepartment = async () => {
        try {
            // Try to fetch from Firebase first
            const docRef = doc(db, 'departments', id as string);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setDepartment(docSnap.data());
            } else {
                // Fallback to static data
                const staticDept = departmentData[id as keyof typeof departmentData];
                setDepartment(staticDept);
            }
        } catch (error) {
            console.error('Error fetching department:', error);
            // Fallback to static data on error
            const staticDept = departmentData[id as keyof typeof departmentData];
            setDepartment(staticDept);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

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

    if (!department) {
        return <NotFound />;
    }

    const faculty: FacultyMember[] = department.faculty || [];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            <Header />

            {/* Hero Section */}
            <div className="bg-iare-blue text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900 opacity-50"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <p className="text-yellow-400 font-semibold mb-2 tracking-wider uppercase">Est. {department.established}</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{department.name}</h1>
                    <p className="text-xl md:text-2xl text-gray-200 italic max-w-2xl mx-auto">"{department.tagline}"</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* About Section */}
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-iare-blue mb-4 border-b pb-2">About the Department</h2>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {department.description}
                            </p>
                        </section>

                        {/* Vision & Mission */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <h3 className="text-xl font-bold text-iare-blue mb-3">Vision</h3>
                                <p className="text-gray-700">{department.vision}</p>
                            </section>
                            <section className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                                <h3 className="text-xl font-bold text-yellow-700 mb-3">Mission</h3>
                                <ul className="space-y-2">
                                    {department.mission.map((item: string, index: number) => (
                                        <li key={index} className="flex items-start">
                                            <ChevronRight className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        {/* Academic Programs */}
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-iare-blue mb-6 border-b pb-2 flex items-center">
                                <BookOpen className="mr-3" /> Academic Programs
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {department.programs.map((program: string, index: number) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-iare-blue">
                                        <span className="font-semibold text-gray-800">{program}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Laboratories */}
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-iare-blue mb-6 border-b pb-2 flex items-center">
                                Laboratories
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {department.labs.map((lab: string, index: number) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center">
                                        <div className="h-2 w-2 bg-iare-teal rounded-full mr-3"></div>
                                        <span className="font-medium text-gray-700">{lab}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Faculty Details — Full Section in Main Content */}
                        {faculty.length > 0 && (
                            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-iare-blue mb-6 border-b pb-2 flex items-center">
                                    <Users className="mr-3" /> Faculty Details
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-iare-blue text-white">
                                                <th className="px-4 py-3 text-sm font-semibold rounded-tl-lg">S.No</th>
                                                <th className="px-4 py-3 text-sm font-semibold">Name</th>
                                                <th className="px-4 py-3 text-sm font-semibold">Designation</th>
                                                <th className="px-4 py-3 text-sm font-semibold rounded-tr-lg">Qualification</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {faculty.map((member, index) => (
                                                <tr
                                                    key={index}
                                                    className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                                >
                                                    <td className="px-4 py-3 text-gray-500 text-sm">{index + 1}</td>
                                                    <td className="px-4 py-3 font-medium text-gray-800">{member.name}</td>
                                                    <td className="px-4 py-3 text-gray-600 text-sm">{member.designation}</td>
                                                    <td className="px-4 py-3 text-gray-600 text-sm">{member.qualification}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">

                        {/* HOD Profile */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="w-28 h-28 rounded-full mx-auto mb-4 overflow-hidden border-4 border-iare-blue shadow-md">
                                {department.hodImageUrl ? (
                                    <img
                                        src={department.hodImageUrl}
                                        alt={department.hod}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-iare-blue text-white text-3xl font-bold">
                                        {department.hod?.split(' ').map((n: string) => n[0]).join('') || <User />}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{department.hod}</h3>
                            <p className="text-iare-blue font-medium mb-1">Head of Department</p>
                            {department.hodDesignation && (
                                <p className="text-gray-500 text-sm mb-2">{department.hodDesignation}</p>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="bg-iare-blue text-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-lg font-bold mb-4 border-b border-blue-400 pb-2">Department Contact</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 mr-3 text-yellow-400" />
                                    <a href={`mailto:${department.contact.email}`} className="hover:text-yellow-300 break-all">{department.contact.email}</a>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 mr-3 text-yellow-400" />
                                    <span>{department.contact.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Faculty Details — Sidebar Summary Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <Users className="h-5 w-5 mr-2 text-iare-blue" /> Faculty Details
                            </h3>
                            {faculty.length === 0 ? (
                                <p className="text-gray-500 text-sm italic">Faculty details will be updated soon.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {faculty.map((member, i) => (
                                        <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                                            <div className="h-8 w-8 rounded-full bg-iare-blue text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm leading-tight">{member.name}</p>
                                                <p className="text-gray-500 text-xs">{member.designation}</p>
                                                <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                                                    <GraduationCap className="h-3 w-3" /> {member.qualification}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DepartmentDetail;
