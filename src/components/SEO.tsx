import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SEO: React.FC<SEOProps> = ({
    title = "SVUCE - Sri Venkateswara University College of Engineering",
    description = "Sri Venkateswara University College of Engineering (SVUCE), Tirupati - NAAC A+ Accredited. Established in 1959, offering B.Tech, M.Tech, and Ph.D. programs in Civil, Electrical, Mechanical, ECE, CSE, and Chemical Engineering.",
    keywords = "SVUCE, Sri Venkateswara University College of Engineering, Tirupati Engineering College, NAAC A+ College, Engineering College Andhra Pradesh, B.Tech Tirupati, M.Tech Programs, Ph.D Engineering, Civil Engineering, Electrical Engineering, Mechanical Engineering, ECE, Computer Science Engineering, Chemical Engineering, SVU Engineering College",
    image = "/logo.png",
    url = "https://svuce.edu.in",
    type = "website"
}) => {
    const fullTitle = title.includes("SVUCE") ? title : `${title} | SVUCE`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Robots */}
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />

            {/* Author and Copyright */}
            <meta name="author" content="Sri Venkateswara University College of Engineering" />
            <meta name="copyright" content="SVUCE" />

            {/* Geographic Tags */}
            <meta name="geo.region" content="IN-AP" />
            <meta name="geo.placename" content="Tirupati" />
            <meta name="geo.position" content="13.627616;79.396767" />
            <meta name="ICBM" content="13.627616, 79.396767" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="SVUCE" />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Additional Educational Institution Tags */}
            <meta property="og:type" content="education.school" />
            <meta name="classification" content="Education" />
            <meta name="category" content="Engineering College" />

            {/* Mobile */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="theme-color" content="#1e40af" />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />
        </Helmet>
    );
};

export default SEO;
