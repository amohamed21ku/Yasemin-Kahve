import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useTranslation } from '../../useTranslation';
import { Coffee, Users, GraduationCap, Home, LogOut, User, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import ProductManagement from './components/ProductManagement';
import UserManagement from './components/UserManagement';
import AcademyManagement from './components/AcademyManagement';
import SampleOrderManagement from './components/SampleOrderManagement';
import './AdminPanel.css';

const AdminPanel = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [userData, setUserData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { currentUser, getUserData, logout } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (currentUser) {
      getUserData(currentUser.uid).then(setUserData);
    }
  }, [currentUser, getUserData]);

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      id: 'products',
      label: t('products') || 'Products',
      icon: Coffee,
      description: t('productsDesc') || 'Manage coffee products'
    },
    {
      id: 'sample-orders',
      label: t('sampleOrders') || 'Sample Orders',
      icon: Package,
      description: t('sampleOrdersDesc') || 'Manage sample requests'
    },
    {
      id: 'users',
      label: t('users') || 'Users',
      icon: Users,
      description: t('usersDesc') || 'Manage user accounts'
    },
    {
      id: 'academy',
      label: t('academy') || 'Academy',
      icon: GraduationCap,
      description: t('academyDesc') || 'Manage courses and enrollments',
      disabled: false
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'sample-orders':
        return <SampleOrderManagement />;
      case 'users':
        return <UserManagement />;
      case 'academy':
        return <AcademyManagement />;
      default:
        return <ProductManagement />;
    }
  };

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-header">
          <div className="sidebar-toggle">
            <button 
              className="toggle-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
          
          <div className="brand-section">
            <img src="/static/images/assets/yaso2.png" alt="Yasemin Kahve" className="admin-logo" />
            {!sidebarCollapsed && (
              <div className="admin-brand">
                <span>{t('adminPanel') || 'Admin Panel'}</span>
              </div>
            )}
          </div>
          
          {!sidebarCollapsed && (
            <div className="admin-user">
              <div className="user-avatar">
                {userData?.photoURL ? (
                  <img src={userData.photoURL} alt="User" />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="user-info">
                <div className="user-name">
                  {userData?.displayName || `${userData?.firstName} ${userData?.lastName}` || currentUser?.email}
                </div>
              </div>
            </div>
          )}
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
                onClick={() => !item.disabled && setActiveTab(item.id)}
                disabled={item.disabled}
                title={item.description}
              >
                <span className="nav-icon">
                  <IconComponent size={20} />
                </span>
                {!sidebarCollapsed && (
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                )}
                {item.disabled && !sidebarCollapsed && <span className="coming-soon">Soon</span>}
              </button>
            );
          })}
        </nav>

        <div className="admin-footer">
          <button className="nav-item" onClick={() => onNavigate('home')}>
            <span className="nav-icon">
              <Home size={20} />
            </span>
            {!sidebarCollapsed && (
              <div className="nav-content">
                <span className="nav-label">{t('backToWebsite') || 'Back to Website'}</span>
              </div>
            )}
          </button>
          
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon">
              <LogOut size={20} />
            </span>
            {!sidebarCollapsed && (
              <div className="nav-content">
                <span className="nav-label">{t('signOut') || 'Sign Out'}</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;