import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../useTranslation';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Coffee, Users, TrendingUp, CheckCircle, Plus, Edit3, Eye, Settings, Package, HardHat } from 'lucide-react';
import { db } from '../../../firebase';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    recentSignUps: 0,
    productsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch products count
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const totalProducts = productsSnapshot.size;
      
      // Fetch users count
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;
      
      // Calculate recent sign-ups (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentUsers = usersSnapshot.docs.filter(doc => {
        const userData = doc.data();
        return userData.createdAt && userData.createdAt.toDate() > thirtyDaysAgo;
      });
      
      setStats({
        totalProducts,
        totalUsers,
        recentSignUps: recentUsers.length,
        productsThisMonth: totalProducts // Placeholder - you can implement month filtering
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t('totalProducts') || 'Total Products',
      value: stats.totalProducts,
      icon: Coffee,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: t('totalUsers') || 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'green',
      trend: `+${stats.recentSignUps}`
    },
    {
      title: t('recentSignUps') || 'Recent Sign-ups',
      value: stats.recentSignUps,
      icon: TrendingUp,
      color: 'purple',
      trend: 'Last 30 days'
    },
    {
      title: t('activeProducts') || 'Active Products',
      value: stats.totalProducts,
      icon: CheckCircle,
      color: 'orange',
      trend: 'All visible'
    }
  ];

  const quickActions = [
    {
      title: t('addNewProduct') || 'Add New Product',
      description: t('addProductDesc') || 'Create a new coffee product listing',
      icon: Plus,
      color: 'blue',
      action: () => console.log('Add product')
    },
    {
      title: t('manageProducts') || 'Manage Products',
      description: t('manageProductsDesc') || 'Edit existing product information',
      icon: Edit3,
      color: 'green',
      action: () => console.log('Manage products')
    },
    {
      title: t('viewUsers') || 'View Users',
      description: t('viewUsersDesc') || 'See all registered users',
      icon: Eye,
      color: 'purple',
      action: () => console.log('View users')
    },
    {
      title: t('siteSettings') || 'Site Settings',
      description: t('siteSettingsDesc') || 'Configure website settings',
      icon: Settings,
      color: 'orange',
      action: () => console.log('Settings'),
      disabled: true
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner">
          <div className="dashboard-spinner"></div>
        </div>
        <p>{t('loadingDashboard') || 'Loading dashboard...'}</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{t('dashboard') || 'Dashboard'}</h1>
        <p>{t('dashboardWelcome') || 'Welcome to your admin control panel'}</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className={`stat-card ${card.color}`}>
              <div className="stat-content">
                <div className="stat-header">
                  <h3>{card.title}</h3>
                  <span className="stat-icon">
                    <IconComponent size={24} />
                  </span>
                </div>
                <div className="stat-value">{card.value}</div>
                <div className="stat-trend">{card.trend}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>{t('quickActions') || 'Quick Actions'}</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                className={`action-card ${action.color} ${action.disabled ? 'disabled' : ''}`}
                onClick={action.action}
                disabled={action.disabled}
              >
                <div className="action-icon">
                  <IconComponent size={20} />
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                  {action.disabled && <span className="coming-soon">Coming Soon</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>{t('recentActivity') || 'Recent Activity'}</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <Package size={20} />
            </div>
            <div className="activity-content">
              <p><strong>System initialized</strong></p>
              <span>Products and user management ready</span>
            </div>
            <span className="activity-time">Just now</span>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <HardHat size={20} />
            </div>
            <div className="activity-content">
              <p><strong>Admin panel setup</strong></p>
              <span>Dashboard and management tools configured</span>
            </div>
            <span className="activity-time">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;