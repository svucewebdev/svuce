
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Award, Building, Glasses, GraduationCap, Target, Users, Quote } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface LeaderMessage {
  name: string;
  designation: string;
  message: string;
  imageUrl: string;
}

const AboutUs = () => {
  const [principal, setPrincipal] = useState<LeaderMessage | null>(null);
  const [vicePrincipal, setVicePrincipal] = useState<LeaderMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const [pSnap, vpSnap] = await Promise.all([
          getDoc(doc(db, 'leadership', 'principal')),
          getDoc(doc(db, 'leadership', 'vice_principal')),
        ]);
        if (pSnap.exists()) setPrincipal(pSnap.data() as LeaderMessage);
        if (vpSnap.exists()) setVicePrincipal(vpSnap.data() as LeaderMessage);
      } catch (e) {
        console.error('Error fetching leadership messages:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const stats = [
    { icon: <Building className="w-6 h-6" />, label: "Established", value: "1959" },
    { icon: <Users className="w-6 h-6" />, label: "Students", value: "3500+" },
    { icon: <Glasses className="w-6 h-6" />, label: "Faculty", value: "150+" },
    { icon: <Award className="w-6 h-6" />, label: "Departments", value: "6" }
  ];

  const MessageCard = ({ leader, side }: { leader: LeaderMessage; side: 'left' | 'right' }) => (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-8 items-start">
      <div className={`flex-shrink-0 ${side === 'right' ? 'md:order-last' : ''}`}>
        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-iare-blue shadow-md mx-auto">
          {leader.imageUrl ? (
            <img src={leader.imageUrl} alt={leader.name} className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <div className="w-full h-full bg-iare-blue flex items-center justify-center text-white text-3xl font-bold">
              {leader.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          )}
        </div>
        <div className="text-center mt-3">
          <p className="font-bold text-gray-900 text-sm">{leader.name}</p>
          <p className="text-iare-blue text-xs font-medium">{leader.designation}</p>
        </div>
      </div>
      <div className="flex-1">
        <Quote className="w-8 h-8 text-iare-blue opacity-30 mb-2" />
        <p className="text-gray-600 leading-relaxed italic">{leader.message}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-10 md:py-12">

        {/* About Section */}
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-200 mb-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Welcome to SVUCE</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sri Venkateswara University College of Engineering (SVUCE) was established in 1959.
                It is a constituent college of Sri Venkateswara University, Tirupati. The College has
                been playing a pivotal role in the field of Technical Education and Research for the last six decades.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                The College offers B.Tech programs in Civil, Electrical &amp; Electronics, Mechanical,
                Electronics &amp; Communication, Computer Science &amp; Engineering, and Chemical Engineering.
                It also offers M.Tech and Ph.D. programs in various specializations.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-iare-blue">{stat.icon}</div>
                    <div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src="https://www.igs.org.in/storage/local-chapter-student/SVUCE-210923112923.jpg"
                alt="SVUCE Campus"
                className="rounded-xl shadow-lg w-full h-auto object-cover"
                onError={(e) => { e.currentTarget.src = '/main.avif'; }}
              />
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-iare-blue rounded-lg flex items-center justify-center text-white mr-4">
                <Glasses className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To be a centre of excellence in technical education and research, producing globally
              competent engineers with ethical values and social responsibility.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-iare-blue rounded-lg flex items-center justify-center text-white mr-4">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Mission</h2>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start"><span className="text-iare-blue mr-2 mt-1">•</span><span>Provide quality technical education through innovative teaching-learning practices</span></li>
              <li className="flex items-start"><span className="text-iare-blue mr-2 mt-1">•</span><span>Foster research and development in emerging technologies</span></li>
              <li className="flex items-start"><span className="text-iare-blue mr-2 mt-1">•</span><span>Establish strong industry-institute interaction</span></li>
              <li className="flex items-start"><span className="text-iare-blue mr-2 mt-1">•</span><span>Inculcate leadership qualities and ethical values</span></li>
            </ul>
          </div>
        </div>

        {/* Leadership Messages */}
        <div className="space-y-8 mb-12">

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-iare-blue"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {principal ? (
                <MessageCard leader={principal} side="left" />
              ) : (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center text-gray-400 italic text-sm">
                  Principal's message will be updated soon.
                </div>
              )}
              {vicePrincipal ? (
                <MessageCard leader={vicePrincipal} side="right" />
              ) : (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center text-gray-400 italic text-sm">
                  Vice Principal's message will be updated soon.
                </div>
              )}
            </div>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
