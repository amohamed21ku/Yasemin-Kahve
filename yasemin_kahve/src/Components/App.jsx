import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import HomePage from '../Pages/HomePage/HomePage'
import AboutUsPage from '../Pages/AboutUs/AboutUs'
import ProductsPage from '../Pages/Products/Products'
import ProductDetailPage from '../Pages/ProductDetail/ProductDetail'
import AcademyV2 from '../Pages/Academy/AcademyV2'

import CourseDetailPage from '../Pages/CourseDetail/CourseDetail'
import AdminPanel from '../Pages/Admin/AdminPanel'
import Auth from '../Pages/Auth/Auth'
import UserProfile from '../Pages/UserProfile/UserProfile'

import { AuthProvider } from '../AuthContext'
import { LanguageProvider } from '../LanguageContext'
import { useAuth } from '../AuthContext'
import { useTranslation } from '../useTranslation'

import 'flag-icons/css/flag-icons.min.css'
import '../index.css'


// Placeholder components
const RegisterPage = ({ onNavigate }) => (
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
      Register/Login Page - Coming Soon
      <div style={{
        marginTop: '2rem'
      }}>
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
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
);

const AdminConsole = ({ onNavigate }) => (
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
      Admin Console - Coming Soon
      <div style={{
        marginTop: '2rem'
      }}>
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
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
);


// Protected Route Component for Admin Access
const ProtectedAdminRoute = ({ children }) => {
  const { currentUser, getUserData } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
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
            onClick={() => navigate('/auth')}
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
            ðŸš«
          </div>
          <h2 style={{ marginBottom: '1rem', color: '#EF4444' }}>
            {t("adminAccessRequired") || "Admin Access Required"}
          </h2>
          <p style={{ marginBottom: '2rem', color: '#8D6E63' }}>
            {t("adminAccessMessage") || "You don't have administrator privileges to access this area."}
          </p>
          <button
            onClick={() => navigate('/')}
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

// Wrapper components to convert navigation props
const HomePageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page, scrollToSection, product) => {
    if (page === 'product-detail' && product) {
      navigate('/product-detail', { state: { product, previousPage: 'home' } });
    } else {
      navigate(`/${page === 'home' ? '' : page}`);
    }
  };
  return <HomePage onNavigate={handleNavigate} />;
};

const AboutPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };
  return <AboutUsPage onNavigate={handleNavigate} />;
};

const ProductsPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page, scrollToSection, product) => {
    if (page === 'product-detail' && product) {
      navigate('/product-detail', { state: { product, previousPage: 'products' } });
    } else {
      navigate(`/${page === 'home' ? '' : page}`);
    }
  };
  return <ProductsPage onNavigate={handleNavigate} />;
};

const ProductDetailWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  // Force scroll to top immediately
  React.useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  const handleNavigate = (page) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  return <ProductDetailPage onNavigate={handleNavigate} product={product} previousPage={location.state?.previousPage} />;
};

const AcademyWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page, scrollToSection, course) => {
    if (page === 'course-detail' && course) {
      navigate('/course-detail', { state: { course } });
    } else {
      navigate(`/${page === 'home' ? '' : page}`);
    }
  };
  return <AcademyV2 onNavigate={handleNavigate} />;
};

const CourseDetailWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const course = location.state?.course;

  const handleNavigate = (page) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  const handleCourseEnroll = async (course) => {
    try {
      console.log('Enrolling in course:', course);
      alert(`Successfully enrolled in: ${course.title?.en || course.title}!`);
      navigate('/academy');
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('An error occurred during enrollment. Please try again.');
    }
  };

  return <CourseDetailPage onNavigate={handleNavigate} course={course} onEnroll={handleCourseEnroll} />;
};

const AuthWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };
  return <Auth onNavigate={handleNavigate} />;
};

const UserProfileWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };
  return <UserProfile onNavigate={handleNavigate} />;
};

const AdminPanelWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };
  return (
    <ProtectedAdminRoute>
      <AdminPanel onNavigate={handleNavigate} />
    </ProtectedAdminRoute>
  );
};

const ContactPage = () => (
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
        ðŸ"ž
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

// Scroll to top component for route changes
const ScrollToTop = () => {
  const location = useLocation();

  React.useEffect(() => {
    // Disable automatic scroll restoration by browser
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  React.useEffect(() => {
    // Scroll to top instantly on every route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <LanguageProvider>
        <AuthProvider>
          <div className="app">
            <Routes>
              <Route path="/" element={<HomePageWrapper />} />
              <Route path="/about" element={<AboutPageWrapper />} />
              <Route path="/products" element={<ProductsPageWrapper />} />
              <Route path="/product-detail" element={<ProductDetailWrapper />} />
              <Route path="/academy" element={<AcademyWrapper />} />
              <Route path="/course-detail" element={<CourseDetailWrapper />} />
              <Route path="/auth" element={<AuthWrapper />} />
              <Route path="/register" element={<AuthWrapper />} />
              <Route path="/profile" element={<UserProfileWrapper />} />
              <Route path="/admin" element={<AdminPanelWrapper />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  )
}

export default App;