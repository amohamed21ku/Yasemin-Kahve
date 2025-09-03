import React, { useState, useEffect } from 'react'
import HomePage from '../Pages/HomePage/HomePage'
import AboutUsPage from '../Pages/AboutUs/AboutUs'
import ProductsPage from '../Pages/Products/Products'
import AcademyPage from '../Pages/Academy/Academy'

import { AuthProvider } from '/src/AuthContext'
import { LanguageProvider } from '/src/LanguageContext'
import { useAuth } from '/src/AuthContext'
import { useTranslation } from '/src/useTranslation'


// Protected Route Component for Admin Access
const ProtectedAdminRoute = ({ children, currentPage, onNavigate }) => {
  const { currentUser, getUserData } = useAuth();
  const { t } = useTranslation();
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (currentUser) {
      getUserData(currentUser.uid).then(data => {
        setUserData(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [currentUser, getUserData]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
        color: '#8B4513',
        fontSize: '1.2rem',
        fontWeight: '600'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #D2691E',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          {t("loading") || "Loading..."}
        </div>
      </div>
    );
  }

  // Check if user is signed in
  if (!currentUser) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
        color: '#8B4513',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '2rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#D2691E' }}>
            {t("accessDenied") || "Access Denied"}
          </h2>
          <p style={{ marginBottom: '2rem', color: '#8D6E63' }}>
            {t("signInRequired") || "You need to sign in to access the admin console."}
          </p>
          <button 
            onClick={() => onNavigate('register')}
            style={{
              background: 'linear-gradient(135deg, #8B4513, #D2691E)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '2rem',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(139, 69, 19, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {t("signIn") || "Sign In"}
          </button>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!userData?.isAdmin) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
        color: '#8B4513',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '2rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #EF4444, #F87171)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            fontSize: '2rem'
          }}>
            🚫
          </div>
          <h2 style={{ marginBottom: '1rem', color: '#EF4444' }}>
            {t("adminAccessRequired") || "Admin Access Required"}
          </h2>
          <p style={{ marginBottom: '2rem', color: '#8D6E63' }}>
            {t("adminAccessMessage") || "You don't have administrator privileges to access this area."}
          </p>
          <button 
            onClick={() => onNavigate('home')}
            style={{
              background: 'linear-gradient(135deg, #8B4513, #D2691E)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '2rem',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(139, 69, 19, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {t("backToHome") || "Back to Home"}
          </button>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentScrollSection, setCurrentScrollSection] = useState(null);

  const handleNavigate = (page, scrollToSection = null) => {
    setCurrentPage(page);
    setCurrentScrollSection(scrollToSection);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Reset scroll section after it's been used
    if (currentScrollSection) {
      setCurrentScrollSection(null);
    }
  }, [currentScrollSection]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutUsPage onNavigate={handleNavigate} />;
      case 'products':
        return <ProductsPage onNavigate={handleNavigate} />;
      case 'academy':
        return <AcademyPage onNavigate={handleNavigate} />;
      // case 'instructors':
      //   return (
      //     <div style={{ 
      //       minHeight: '100vh', 
      //       display: 'flex', 
      //       alignItems: 'center', 
      //       justifyContent: 'center',
      //       background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
      //       color: '#8B4513',
      //       fontSize: '1.5rem',
      //       fontWeight: '600',
      //       textAlign: 'center',
      //       padding: '2rem'
      //     }}>
      //       <div style={{
      //         background: 'white',
      //         padding: '3rem',
      //         borderRadius: '2rem',
      //         boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
      //       }}>
      //         <div style={{
      //           fontSize: '4rem',
      //           marginBottom: '1rem'
      //         }}>
      //           👨‍🏫
      //         </div>
      //         Instructors Page - Coming Soon
      //         <div style={{
      //           marginTop: '1rem',
      //           fontSize: '1rem',
      //           color: '#8D6E63',
      //           fontWeight: '400'
      //         }}>
      //           We're preparing detailed instructor profiles for you
      //         </div>
      //       </div>
      //     </div>
      //   );
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'admin':
        return (
          <ProtectedAdminRoute currentPage={currentPage} onNavigate={handleNavigate}>
            <AdminConsole onNavigate={handleNavigate} />
          </ProtectedAdminRoute>
        );
      case 'contact':
        return (
          <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
            color: '#8B4513',
            fontSize: '1.5rem',
            fontWeight: '600',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <div style={{
              background: 'white',
              padding: '3rem',
              borderRadius: '2rem',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem'
              }}>
                📞
              </div>
              Contact Page - Coming Soon
              <div style={{
                marginTop: '1rem',
                fontSize: '1rem',
                color: '#8D6E63',
                fontWeight: '400'
              }}>
                Get in touch with our coffee experts
              </div>
            </div>
          </div>
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="app">
          {renderCurrentPage()}
        </div>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App;