import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    TrendingUp, Building2, Users, Award, Quote, Briefcase,
    MapPin, GraduationCap, Star, Filter, ChevronDown, Trophy
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface PlacementStats {
    id: string;
    year: string;
    placementRate: number;
    highestPackage: string;
    averagePackage: string;
    companiesVisited: number;
}

interface Recruiter {
    id: string;
    companyName: string;
    logoUrl: string;
    order: number;
}

interface Placement {
    id: string;
    studentName: string;
    company: string;
    package: string;
    role?: string;
    department: string;
    year: string;
    imageUrl?: string;
}

interface Testimonial {
    id: string;
    studentName: string;
    company: string;
    quote: string;
    imageUrl?: string;
    year: string;
}

// --- Skeleton helpers ---
const Skeleton = ({ className }: { className?: string }) => (
    <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
);

const StatCardSkeleton = () => (
    <div className="bg-white border-l-4 border-gray-200 rounded-xl shadow-md p-6">
        <Skeleton className="h-4 w-28 mb-3" />
        <Skeleton className="h-10 w-20" />
    </div>
);

const PlacementCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center gap-3">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-20" />
        <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
        </div>
    </div>
);

const Placements = () => {
    const [stats, setStats] = useState<PlacementStats | null>(null);
    const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
    const [placements, setPlacements] = useState<Placement[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string>('All');
    const [years, setYears] = useState<string[]>([]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [statsSnap, recruitersSnap, placementsSnap, testimonialsSnap] = await Promise.all([
                getDocs(query(collection(db, 'placementStats'), orderBy('year', 'desc'), limit(1))),
                getDocs(query(collection(db, 'recruiters'), orderBy('order', 'asc'))),
                getDocs(query(collection(db, 'placements'), orderBy('year', 'desc'))),
                getDocs(query(collection(db, 'testimonials'), orderBy('year', 'desc'), limit(4))),
            ]);

            if (!statsSnap.empty) {
                const d = statsSnap.docs[0];
                setStats({ id: d.id, ...d.data() } as PlacementStats);
            }

            setRecruiters(recruitersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Recruiter)));

            const allPlacements = placementsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Placement));
            setPlacements(allPlacements);

            // Compute unique years for filter
            const uniqueYears = Array.from(new Set(allPlacements.map(p => p.year).filter(Boolean))).sort((a, b) => b.localeCompare(a));
            setYears(uniqueYears);

            setTestimonials(testimonialsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));
        } catch (error) {
            console.error('Error fetching placement data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPlacements = selectedYear === 'All'
        ? placements
        : placements.filter(p => p.year === selectedYear);

    const visiblePlacements = filteredPlacements.slice(0, 12);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            <Header />

            {/* Hero Banner */}
            <div className="relative bg-gradient-to-br from-iare-blue via-blue-800 to-blue-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white transform translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-yellow-400 transform -translate-x-1/3 translate-y-1/3" />
                </div>
                <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                        <Trophy className="w-4 h-4" /> Placement Excellence
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Placements &amp; <span className="text-yellow-400">Career Growth</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                        SVUCE alumni thrive at the world's leading companies. Discover the career success stories shaping tomorrow's industry.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 flex-grow">

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 -mt-8 relative z-10">
                    {loading ? (
                        [1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)
                    ) : stats ? (
                        <>
                            <Card className="bg-white border-l-4 border-blue-600 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">Placement Rate</p>
                                            <p className="text-4xl font-extrabold text-blue-600">{stats.placementRate}<span className="text-2xl">%</span></p>
                                            <p className="text-xs text-gray-400 mt-1">{stats.year}</p>
                                        </div>
                                        <TrendingUp className="w-10 h-10 text-blue-200" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white border-l-4 border-green-600 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">Highest Package</p>
                                            <p className="text-3xl font-extrabold text-green-600">{stats.highestPackage}</p>
                                        </div>
                                        <Award className="w-10 h-10 text-green-200" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white border-l-4 border-purple-600 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">Avg Package</p>
                                            <p className="text-3xl font-extrabold text-purple-600">{stats.averagePackage}</p>
                                        </div>
                                        <Briefcase className="w-10 h-10 text-purple-200" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white border-l-4 border-orange-600 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">Companies</p>
                                            <p className="text-4xl font-extrabold text-orange-600">{stats.companiesVisited}<span className="text-2xl">+</span></p>
                                        </div>
                                        <Building2 className="w-10 h-10 text-orange-200" />
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : null}
                </div>

                {/* Top Recruiters */}
                <section className="mb-14">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Our Top Recruiters</h2>
                        <p className="text-gray-500 mt-2">Industry leaders who trust SVUCE graduates</p>
                        <div className="h-1 w-16 bg-iare-blue rounded mx-auto mt-3" />
                    </div>
                    {loading ? (
                        <div className="bg-white rounded-2xl shadow p-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                            {[...Array(12)].map((_, i) => (
                                <Skeleton key={i} className="h-16 rounded-xl" />
                            ))}
                        </div>
                    ) : recruiters.length > 0 ? (
                        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {recruiters.map((recruiter) => (
                                    <div
                                        key={recruiter.id}
                                        className="flex items-center justify-center p-4 border border-gray-100 rounded-xl hover:shadow-md hover:border-iare-blue transition-all duration-200 bg-gray-50 hover:bg-white group"
                                    >
                                        {recruiter.logoUrl && recruiter.logoUrl !== '#' ? (
                                            <img src={recruiter.logoUrl} alt={recruiter.companyName} className="max-h-10 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-600 text-center group-hover:text-iare-blue transition-colors">{recruiter.companyName}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </section>

                {/* Recent Placements */}
                <section className="mb-14">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Placement Records</h2>
                            <p className="text-gray-500 mt-1">Students who landed their dream jobs</p>
                            <div className="h-1 w-16 bg-iare-blue rounded mt-3" />
                        </div>
                        {years.length > 0 && (
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm self-start md:self-auto">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <select
                                    value={selectedYear}
                                    onChange={e => setSelectedYear(e.target.value)}
                                    className="text-sm text-gray-700 bg-transparent border-none outline-none cursor-pointer"
                                >
                                    <option value="All">All Years</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {[...Array(8)].map((_, i) => <PlacementCardSkeleton key={i} />)}
                        </div>
                    ) : visiblePlacements.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {visiblePlacements.map((placement) => (
                                    <div
                                        key={placement.id}
                                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 group"
                                    >
                                        {/* Card Header with gradient */}
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 flex flex-col items-center">
                                            <div className="w-20 h-20 rounded-full bg-iare-blue shadow-lg flex items-center justify-center mb-3 ring-4 ring-white overflow-hidden">
                                                {placement.imageUrl && placement.imageUrl !== '#' ? (
                                                    <img src={placement.imageUrl} alt={placement.studentName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-white text-xl font-bold">
                                                        {placement.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-center">{placement.studentName}</h3>
                                        </div>
                                        {/* Card Body */}
                                        <div className="p-4 flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-iare-blue flex-shrink-0" />
                                                <span className="text-iare-blue font-semibold text-sm truncate">{placement.company}</span>
                                            </div>
                                            {placement.role && (
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span className="text-gray-600 text-sm truncate">{placement.role}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span className="text-green-600 font-bold">{placement.package}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-500 text-xs">{placement.department}</span>
                                            </div>
                                            <div className="mt-1">
                                                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">Batch {placement.year}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {filteredPlacements.length > 12 && (
                                <p className="text-center text-gray-400 mt-6 text-sm">Showing 12 of {filteredPlacements.length} placements</p>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400">No placement records available yet.</p>
                        </div>
                    )}
                </section>

                {/* Testimonials */}
                {(loading || testimonials.length > 0) && (
                    <section className="mb-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Student Success Stories</h2>
                            <p className="text-gray-500 mt-2">In their own words</p>
                            <div className="h-1 w-16 bg-yellow-400 rounded mx-auto mt-3" />
                        </div>
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-white rounded-xl shadow-md p-6 space-y-3">
                                        <Skeleton className="h-4 w-8" />
                                        <Skeleton className="h-16 w-full" />
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-12 h-12 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {testimonials.map((t) => (
                                    <div key={t.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-l-4 border-iare-blue p-6 group hover:-translate-y-1 duration-300">
                                        <Quote className="w-8 h-8 text-iare-blue mb-4 opacity-60" />
                                        <p className="text-gray-700 italic leading-relaxed mb-5">"{t.quote}"</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-iare-blue to-blue-700 flex items-center justify-center flex-shrink-0 overflow-hidden shadow">
                                                {t.imageUrl && t.imageUrl !== '#' ? (
                                                    <img src={t.imageUrl} alt={t.studentName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-white text-sm font-bold">
                                                        {t.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{t.studentName}</p>
                                                <p className="text-sm text-iare-blue">{t.company} &bull; {t.year}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Empty State */}
                {!loading && !stats && recruiters.length === 0 && placements.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No placement data available.</p>
                        <p className="text-gray-300 text-sm mt-1">Admin can add data from the CRM dashboard.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Placements;
