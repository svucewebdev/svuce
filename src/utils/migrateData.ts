import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { departmentData } from '../data/departmentData';

// This script migrates existing static data to Firebase
// Run this once to populate your Firestore database

export const migrateDataToFirebase = async () => {
    try {
        console.log('Starting data migration...');

        // 1. Migrate Department Data
        console.log('Migrating departments...');
        for (const [deptId, deptInfo] of Object.entries(departmentData)) {
            await setDoc(doc(db, 'departments', deptId), deptInfo);
            console.log(`✓ Migrated ${deptId}`);
        }

        // 2. Migrate Sample News Data
        console.log('Migrating sample news...');
        const sampleNews = [
            {
                title: 'SVUCE Celebrates 65 Years of Excellence',
                content: 'Sri Venkateswara University College of Engineering marks its 65th anniversary with a grand celebration. The event was attended by distinguished alumni, faculty, and students.',
                imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
                category: 'General',
                date: new Date('2024-01-15'),
                published: true,
            },
            {
                title: 'CSE Department Hosts National Level Hackathon',
                content: 'The Department of Computer Science & Engineering successfully organized a 48-hour hackathon with participation from over 200 students across the country.',
                imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
                category: 'Event',
                date: new Date('2024-01-10'),
                published: true,
            },
            {
                title: 'Students Win First Prize at National Innovation Contest',
                content: 'A team of final-year students from the ECE department won the first prize at the National Innovation Contest held in Delhi.',
                imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
                category: 'Achievement',
                date: new Date('2024-01-05'),
                published: true,
            },
            {
                title: 'New Research Lab Inaugurated',
                content: 'A state-of-the-art research laboratory for advanced materials was inaugurated by the Vice-Chancellor.',
                imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
                category: 'Academic',
                date: new Date('2023-12-20'),
                published: true,
            },
        ];

        for (const newsItem of sampleNews) {
            await addDoc(collection(db, 'news'), newsItem);
            console.log(`✓ Added news: ${newsItem.title}`);
        }

        // 3. Migrate Sample Academic Resources
        console.log('Migrating academic resources...');
        const sampleAcademics = [
            {
                category: 'courses',
                title: 'B.Tech Programs Overview',
                description: 'Complete list of undergraduate programs offered at SVUCE',
                fileUrl: '#',
                semester: '',
                department: 'All',
            },
            {
                category: 'calendar',
                title: 'Academic Calendar 2023-24',
                description: 'Academic calendar for the current academic year',
                fileUrl: '#',
                semester: '',
                department: 'All',
            },
            {
                category: 'regulations',
                title: 'R20 Regulations',
                description: 'Academic regulations for students admitted in 2020 and onwards',
                fileUrl: '#',
                semester: '',
                department: 'All',
            },
            {
                category: 'syllabus',
                title: 'CSE B.Tech Syllabus',
                description: 'Complete syllabus for Computer Science & Engineering',
                fileUrl: '#',
                semester: '',
                department: 'CSE',
            },
            {
                category: 'timetables',
                title: 'Semester 1 Timetable',
                description: 'Class schedule for first semester',
                fileUrl: '#',
                semester: 'Semester 1',
                department: 'All',
            },
        ];

        for (const resource of sampleAcademics) {
            await addDoc(collection(db, 'academics'), resource);
            console.log(`✓ Added resource: ${resource.title}`);
        }

        // 4. Migrate Placement Statistics
        console.log('Migrating placement statistics...');
        const placementStats = {
            year: '2023-24',
            placementRate: 95,
            highestPackage: '45 LPA',
            averagePackage: '8.5 LPA',
            companiesVisited: 150
        };
        await addDoc(collection(db, 'placementStats'), placementStats);
        console.log('✓ Added placement statistics');

        // 5. Migrate Top Recruiters
        console.log('Migrating recruiters...');
        const recruiters = [
            { companyName: 'Google', logoUrl: '#', order: 1 },
            { companyName: 'Microsoft', logoUrl: '#', order: 2 },
            { companyName: 'Amazon', logoUrl: '#', order: 3 },
            { companyName: 'TCS', logoUrl: '#', order: 4 },
            { companyName: 'Infosys', logoUrl: '#', order: 5 },
            { companyName: 'Wipro', logoUrl: '#', order: 6 },
            { companyName: 'Cognizant', logoUrl: '#', order: 7 },
            { companyName: 'Accenture', logoUrl: '#', order: 8 },
            { companyName: 'IBM', logoUrl: '#', order: 9 },
            { companyName: 'Oracle', logoUrl: '#', order: 10 }
        ];
        for (const recruiter of recruiters) {
            await addDoc(collection(db, 'recruiters'), recruiter);
            console.log(`✓ Added recruiter: ${recruiter.companyName}`);
        }

        // 6. Migrate Sample Placements
        console.log('Migrating placements...');
        const placements = [
            { studentName: 'Rajesh Kumar', company: 'Google', package: '42 LPA', department: 'CSE', year: '2024', imageUrl: '#' },
            { studentName: 'Priya Sharma', company: 'Microsoft', package: '38 LPA', department: 'CSE', year: '2024', imageUrl: '#' },
            { studentName: 'Arun Reddy', company: 'Amazon', package: '35 LPA', department: 'ECE', year: '2024', imageUrl: '#' },
            { studentName: 'Sneha Patel', company: 'TCS', package: '7.5 LPA', department: 'EEE', year: '2024', imageUrl: '#' },
            { studentName: 'Karthik Rao', company: 'Infosys', package: '8 LPA', department: 'Mechanical', year: '2024', imageUrl: '#' },
            { studentName: 'Divya Menon', company: 'Wipro', package: '7 LPA', department: 'Civil', year: '2024', imageUrl: '#' },
            { studentName: 'Rahul Verma', company: 'Cognizant', package: '6.5 LPA', department: 'Chemical', year: '2024', imageUrl: '#' },
            { studentName: 'Anjali Singh', company: 'Accenture', package: '9 LPA', department: 'CSE', year: '2024', imageUrl: '#' }
        ];
        for (const placement of placements) {
            await addDoc(collection(db, 'placements'), placement);
            console.log(`✓ Added placement: ${placement.studentName}`);
        }

        // 7. Migrate Testimonials
        console.log('Migrating testimonials...');
        const testimonials = [
            {
                studentName: 'Priya Sharma',
                company: 'Microsoft',
                quote: 'SVUCE provided excellent training and placement support. The faculty guided us throughout the placement process.',
                imageUrl: '#',
                year: '2023'
            },
            {
                studentName: 'Rajesh Kumar',
                company: 'Google',
                quote: 'The technical skills and problem-solving abilities I developed at SVUCE helped me crack my dream job at Google.',
                imageUrl: '#',
                year: '2023'
            },
            {
                studentName: 'Arun Reddy',
                company: 'Amazon',
                quote: 'The placement cell at SVUCE is very supportive. They conducted mock interviews and aptitude tests that were very helpful.',
                imageUrl: '#',
                year: '2023'
            },
            {
                studentName: 'Sneha Patel',
                company: 'TCS',
                quote: 'I am grateful to SVUCE for providing me with the right platform and opportunities to launch my career.',
                imageUrl: '#',
                year: '2023'
            }
        ];
        for (const testimonial of testimonials) {
            await addDoc(collection(db, 'testimonials'), testimonial);
            console.log(`✓ Added testimonial: ${testimonial.studentName}`);
        }

        console.log('✅ Data migration completed successfully!');
        return { success: true, message: 'All data migrated successfully' };
    } catch (error) {
        console.error('❌ Migration failed:', error);
        return { success: false, error };
    }
};
