
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, MapPin, Phone, Clock, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto my-8 sm:my-10 md:my-12 px-4 flex-grow">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-iare-blue text-center mb-8 sm:mb-10 md:mb-12">Contact Us</h1>

                <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 max-w-6xl mx-auto items-start">

                    {/* Contact Information */}
                    <div className="flex-1 space-y-8 w-full">
                        <div className="bg-white p-8 rounded-xl shadow-sm border h-full">
                            <h2 className="text-2xl font-semibold text-iare-maroon mb-6">Get in Touch</h2>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-blue-50 p-3 rounded-full mr-4">
                                        <MapPin className="h-6 w-6 text-iare-blue" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Address</h3>
                                        <p className="text-gray-600 mt-1">
                                            Sri Venkateswara University College of Engineering,<br />
                                            Tirupati - 517502,<br />
                                            Andhra Pradesh, India.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-blue-50 p-3 rounded-full mr-4">
                                        <Phone className="h-6 w-6 text-iare-blue" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Phone</h3>
                                        <p className="text-gray-600 mt-1">+91-877-2289561</p>
                                        <p className="text-gray-600">+91-877-2248509 (Fax)</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-blue-50 p-3 rounded-full mr-4">
                                        <Mail className="h-6 w-6 text-iare-blue" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Email</h3>
                                        <p className="text-gray-600 mt-1">principal_svuce2003@yahoo.co.in</p>
                                        <p className="text-gray-600">principal@svuce.edu.in</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-blue-50 p-3 rounded-full mr-4">
                                        <Clock className="h-6 w-6 text-iare-blue" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Office Hours</h3>
                                        <p className="text-gray-600 mt-1">Monday - Saturday: 10:00 AM - 5:00 PM</p>
                                        <p className="text-gray-600">Sunday: Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="flex-1 w-full bg-gray-200 rounded-xl overflow-hidden h-96 shadow-sm border">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3334.8576007053057!2d79.39476755459395!3d13.627616143940829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4d4b6b271b4ffd%3A0x30859fdc6c661028!2sSri%20Venkateshwara%20University%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1769504429682!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="SVUCE Location"
                        ></iframe>                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
