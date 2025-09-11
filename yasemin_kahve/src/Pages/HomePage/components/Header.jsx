// Header.jsx with fixed user menu dropdown behavior
import React, { useEffect, useState, useRef } from "react";
import { Menu, X, User, Settings, LogOut, Shield, Coffee } from "lucide-react";
import { useTranslation } from "/src/useTranslation";
import { useAuth } from "/src/AuthContext";
import LanguageSwitcher from "/src/Pages/HomePage/components/LanguageSwitcher";

const Header = ({ activeSection = "home", onNavigate, darkContent = false }) => {
  const { t } = useTranslation();
  const { currentUser, logout, getUserData } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fixed: Handle click outside user menu with proper event handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    // Only add listener when menu is open
    if (isUserMenuOpen) {
      // Use capture phase to ensure we catch the event before other handlers
      document.addEventListener("mousedown", handleClickOutside, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isUserMenuOpen]);

  // Load user data when user changes
  useEffect(() => {
    if (currentUser) {
      getUserData(currentUser.uid).then(data => {
        setUserData(data);
      });
    } else {
      setUserData(null);
    }
  }, [currentUser, getUserData]);

  const navItems = [
    { name: t("home") || "Home", path: "home" },
    { name: t("about") || "About", path: "about" },
    { name: t("products") || "Products", path: "products" },
    { name: t("academy") || "Academy", path: "academy" }
  ];

  const handleNavClick = (path, e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: path } }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      handleNavClick('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Fixed: Prevent event propagation when clicking user menu trigger
  const handleUserMenuToggle = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Fixed: Prevent dropdown from closing when clicking inside it
  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  const isAdmin = userData?.isAdmin === true;

  return (
    <nav className={`fix-header ${scrollY > 50 ? "scrolled" : ""} ${darkContent ? "dark-content" : ""} ${activeSection === "productDetail" ? "product-detail-header" : ""}`}>
      <div className="fix-container">
        <div className="fix-header-content">
          <div className="fix-logo-section glow-effect floating">
            <div className="fix-logo-container animated-border patterned">
              <img
                src={activeSection === 'academy' ? "/static/images/assets/Academy_logo.png" : "/static/images/assets/yaso2.png"}
                alt={activeSection === 'academy' ? "Academy Logo" : "Yasemin Kahve Logo"}
                className="fix-logo-img high-contrast extra-large"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>

          <div className="fix-desktop-nav">
            {navItems.map((item) => {
              const isActive = activeSection === item.path;
              return (
                <a
                  key={item.name}
                  href={`#${item.path}`}
                  className={`fix-nav-link ${isActive ? "active" : ""}`}
                  onClick={(e) => handleNavClick(item.path, e)}
                >
                  {item.name}
                </a>
              );
            })}
            
            {/* Admin link with improved design */}
            {isAdmin && (
              <a
                href="#admin"
                className={`fix-nav-link fix-admin-nav-link ${activeSection === 'admin' ? "active" : ""}`}
                onClick={(e) => handleNavClick('admin', e)}
              >
                <Coffee size={16} className="fix-admin-icon" />
                <span>{t("admin") || "Admin"}</span>
              </a>
            )}
          </div>

          {/* Authentication Section */}
          <div className="fix-auth-section">
            <LanguageSwitcher />
            {currentUser ? (
              <div className="fix-user-menu-container" ref={userMenuRef}>
                <button 
                  className="fix-user-menu-trigger"
                  onClick={handleUserMenuToggle}
                >
                  {userData?.photoURL ? (
                    <img 
                      src={userData.photoURL} 
                      alt="Profile" 
                      className="fix-user-avatar-img"
                    />
                  ) : (
                    <User size={18} />
                  )}
                  <span className="fix-user-name">
                    {userData?.firstName || userData?.displayName?.split(' ')[0] || currentUser.email?.split('@')[0]}
                  </span>
                  {isAdmin && <span className="fix-admin-badge">ADMIN</span>}
                </button>
                
                {isUserMenuOpen && (
                  <div className="fix-user-dropdown" onClick={handleDropdownClick}>
                    <div className="fix-user-info">
                      <strong>{userData?.displayName || `${userData?.firstName} ${userData?.lastName}`.trim()}</strong>
                      <span className="fix-user-email">{currentUser.email}</span>
                    </div>
                    <div className="fix-dropdown-divider"></div>
                    <button 
                      className="fix-dropdown-item"
                      onClick={(e) => handleNavClick('profile', e)}
                    >
                      <User size={16} />
                      {t("myProfile") || "My Profile"}
                    </button>
                    {isAdmin && (
                      <button 
                        className="fix-dropdown-item fix-admin-item"
                        onClick={(e) => handleNavClick('admin', e)}
                      >
                        <Coffee size={16} />
                        {t("adminConsole") || "Admin Console"}
                      </button>
                    )}
                    <button className="fix-dropdown-item" onClick={handleLogout}>
                      <LogOut size={16} />
                      {t("signOut") || "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="fix-auth-buttons">
                <button 
                  className="fix-auth-btn fix-sign-in-btn"
                  onClick={(e) => handleNavClick('register', e)}
                >
                  {t("signIn") || "Sign In"}
                </button>
                <button 
                  className="fix-auth-btn fix-register-btn"
                  onClick={(e) => handleNavClick('register', e)}
                >
                  {t("register") || "Register"}
                </button>
              </div>
            )}
          </div>

          {/* Mobile actions - Language switcher and menu button */}
          <div className="fix-mobile-actions">
            <div className="fix-mobile-header-language-switcher">
              <LanguageSwitcher />
            </div>
            <button
              className="fix-mobile-menu-btn"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`fix-mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="fix-mobile-menu-content">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={`#${item.path}`}
              className="fix-mobile-nav-link"
              onClick={(e) => handleNavClick(item.path, e)}
            >
              {item.name}
            </a>
          ))}
          
          {/* Mobile admin link */}
          {isAdmin && (
            <a
              href="#admin"
              className={`fix-mobile-nav-link fix-admin-nav-link ${activeSection === 'admin' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('admin', e)}
            >
              <Coffee size={16} />
              {t("adminConsole") || "Admin Console"}
            </a>
          )}
          
          {/* Mobile Auth Section */}
          <div className="fix-mobile-auth-section">
            {currentUser ? (
              <>
                <div className="fix-mobile-user-info">
                  <User size={18} />
                  <span>{userData?.displayName || userData?.firstName || currentUser.email?.split('@')[0]}</span>
                  {isAdmin && <span className="fix-admin-badge">ADMIN</span>}
                </div>
                <button 
                  className="fix-mobile-nav-link"
                  onClick={(e) => handleNavClick('profile', e)}
                >
                  <User size={16} />
                  {t("myProfile") || "My Profile"}
                </button>
                <button className="fix-mobile-logout-btn" onClick={handleLogout}>
                  <LogOut size={16} />
                  {t("signOut") || "Sign Out"}
                </button>
              </>
            ) : (
              <div className="fix-mobile-auth-buttons">
                <button 
                  className="fix-mobile-auth-btn sign-in"
                  onClick={(e) => handleNavClick('register', e)}
                >
                  {t("signIn") || "Sign In"}
                </button>
                <button 
                  className="fix-mobile-auth-btn register"
                  onClick={(e) => handleNavClick('register', e)}
                >
                  {t("register") || "Register"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;