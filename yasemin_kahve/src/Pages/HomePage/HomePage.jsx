// Fixed HomePage.jsx
import React from "react";
import Header from "/src/Pages/HomePage/components/Header";
import Hero from "/src/Pages/HomePage/components/Hero";
import CompanyOverview from "/src/Pages/HomePage/components/CompanyOverview";
import ProductsPreview from "/src/Pages/HomePage/components/ProductsPreview";
import ContactSection from "/src/Pages/HomePage/components/ContactSection";
import Footer from "/src/Pages/HomePage/components/Footer";
import './HomePage.css';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="home-page">
      <Header activeSection="home" onNavigate={onNavigate} />
      <Hero onNavigate={onNavigate} />
      <CompanyOverview onNavigate={onNavigate} />
      <ProductsPreview onNavigate={onNavigate} />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default HomePage;