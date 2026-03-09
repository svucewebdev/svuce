
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Award, BookOpen, Building, Glasses, GraduationCap, Heart, Target, Users } from 'lucide-react';

const AboutUs = () => {
  const coreValues = [
    {
      icon: <Heart className="h-8 w-8 text-iare-blue" />,
      title: "Excellence",
      description: "Commitment to excellence in all academic and professional pursuits."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-iare-blue" />,
      title: "Innovation",
      description: "Fostering creativity and promoting innovation in engineering education."
    },
    {
      icon: <Users className="h-8 w-8 text-iare-blue" />,
      title: "Integrity",
      description: "Maintaining ethical standards and promoting academic integrity."
    },
    {
      icon: <Award className="h-8 w-8 text-iare-blue" />,
      title: "Inclusivity",
      description: "Embracing diversity and providing equal opportunities for all."
    },
    {
      icon: <Target className="h-8 w-8 text-iare-blue" />,
      title: "Social Responsibility",
      description: "Encouraging community service and sustainable practices."
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-iare-blue" />,
      title: "Student-Centered",
      description: "Prioritizing student welfare and holistic development."
    }
  ];

  const stats = [
    { icon: <Building className="w-6 h-6" />, label: "Established", value: "1959" },
    { icon: <Users className="w-6 h-6" />, label: "Students", value: "3500+" },
    { icon: <Glasses className="w-6 h-6" />, label: "Faculty", value: "150+" },
    { icon: <Award className="w-6 h-6" />, label: "Departments", value: "6" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-10 md:py-12">
        {/* About Section */}
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-200 mb-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Welcome to SVUCE
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sri Venkateswara University College of Engineering (SVUCE) was established in 1959.
                It is a constituent college of Sri Venkateswara University, Tirupati. The College has
                been playing a pivotal role in the field of Technical Education and Research for the
                last six decades.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                The College offers B.Tech programs in Civil, Electrical & Electronics, Mechanical,
                Electronics & Communication, Computer Science & Engineering, and Chemical Engineering.
                It also offers M.Tech and Ph.D. programs in various specializations.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-iare-blue">
                      {stat.icon}
                    </div>
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
                onError={(e) => {
                  e.currentTarget.src = '/main.avif';
                }}
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
              <li className="flex items-start">
                <span className="text-iare-blue mr-2 mt-1">•</span>
                <span>Provide quality technical education through innovative teaching-learning practices</span>
              </li>
              <li className="flex items-start">
                <span className="text-iare-blue mr-2 mt-1">•</span>
                <span>Foster research and development in emerging technologies</span>
              </li>
              <li className="flex items-start">
                <span className="text-iare-blue mr-2 mt-1">•</span>
                <span>Establish strong industry-institute interaction</span>
              </li>
              <li className="flex items-start">
                <span className="text-iare-blue mr-2 mt-1">•</span>
                <span>Inculcate leadership qualities and ethical values</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-200">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide our commitment to excellence in education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="p-6 border border-gray-200 rounded-xl hover:border-iare-blue hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
