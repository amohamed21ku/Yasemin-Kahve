import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useTranslation } from '../../useTranslation';
import { BarChart3, Coffee, Users, GraduationCap, Database, Home, LogOut, User } from 'lucide-react';
import ProductManagement from './components/ProductManagement';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import DataMigration from './components/DataMigration';
import AcademyManagement from './components/AcademyManagement';
import './AdminPanel.css';

const AdminPanel = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState(null);
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
      id: 'dashboard',
      label: t('dashboard') || 'Dashboard',
      icon: BarChart3,
      description: t('dashboardDesc') || 'Overview and analytics'
    },
    {
      id: 'products',
      label: t('products') || 'Products',
      icon: Coffee,
      description: t('productsDesc') || 'Manage coffee products'
    },
    {
      id: 'migration',
      label: t('dataMigration') || 'Data Migration',
      icon: Database,
      description: t('migrationDesc') || 'Import sample data'
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
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'migration':
        return <DataMigration />;
      case 'users':
        return <UserManagement />;
      case 'academy':
        return <AcademyManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-header">
          <div className="brand-section">
            <img src="/src/assets/yasemin.png" alt="Yasemin Kahve" className="admin-logo" />
            <div className="admin-brand">
              <span>{t('adminPanel') || 'Admin Panel'}</span>
            </div>
          </div>
          
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
                <div className="nav-content">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
                {item.disabled && <span className="coming-soon">Soon</span>}
              </button>
            );
          })}
        </nav>

        <div className="admin-footer">
          <button className="nav-item" onClick={() => onNavigate('home')}>
            <span className="nav-icon">
              <Home size={20} />
            </span>
            <div className="nav-content">
              <span className="nav-label">{t('backToWebsite') || 'Back to Website'}</span>
            </div>
          </button>
          
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon">
              <LogOut size={20} />
            </span>
            <div className="nav-content">
              <span className="nav-label">{t('signOut') || 'Sign Out'}</span>
            </div>
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