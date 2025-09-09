import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../useTranslation';
import { useAuth } from '../../../AuthContext';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const { setUserAsAdmin } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by creation date (newest first)
      usersData.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toDate() - a.createdAt.toDate();
      });
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async (userId, isAdmin) => {
    try {
      await setUserAsAdmin(userId, isAdmin);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin } : user
      ));
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(t('confirmDeleteUser') || 'Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="user-management-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>{t('loadingUsers') || 'Loading users...'}</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div className="header-content">
          <h1>{t('userManagement') || 'User Management'}</h1>
          <p>{t('manageUsersDesc') || 'Manage registered users and their permissions'}</p>
        </div>
        
        <div className="user-stats">
          <div className="stat">
            <span className="stat-number">{users.length}</span>
            <span className="stat-label">{t('totalUsers') || 'Total Users'}</span>
          </div>
          <div className="stat">
            <span className="stat-number">{users.filter(u => u.isAdmin).length}</span>
            <span className="stat-label">{t('admins') || 'Admins'}</span>
          </div>
        </div>
      </div>

      <div className="user-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder={t('searchUsers') || 'Search users...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="users-table-container">
        {filteredUsers.length === 0 ? (
          <div className="no-users">
            <div className="no-users-icon">👥</div>
            <h3>{searchTerm ? (t('noUsersFound') || 'No users found') : (t('noUsersYet') || 'No users registered yet')}</h3>
            <p>
              {searchTerm 
                ? (t('tryDifferentSearch') || 'Try a different search term') 
                : (t('usersWillAppear') || 'Users will appear here when they register')
              }
            </p>
          </div>
        ) : (
          <div className="users-table">
            <div className="table-header">
              <div className="header-cell">{t('user') || 'User'}</div>
              <div className="header-cell">{t('email') || 'Email'}</div>
              <div className="header-cell">{t('phone') || 'Phone'}</div>
              <div className="header-cell">{t('joinDate') || 'Join Date'}</div>
              <div className="header-cell">{t('role') || 'Role'}</div>
              <div className="header-cell">{t('actions') || 'Actions'}</div>
            </div>
            
            <div className="table-body">
              {filteredUsers.map((user) => (
                <div key={user.id} className="table-row">
                  <div className="table-cell user-info">
                    <div className="user-avatar">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || user.email} />
                      ) : (
                        <span>{user.firstName?.[0] || user.displayName?.[0] || user.email?.[0] || '👤'}</span>
                      )}
                    </div>
                    <div className="user-details">
                      <div className="user-name">
                        {user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}
                      </div>
                      <div className="user-provider">
                        {user.provider === 'google' ? '🔗 Google' : '📧 Email'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="table-cell email-cell">
                    {user.email}
                  </div>
                  
                  <div className="table-cell">
                    {user.phoneNumber || 'N/A'}
                  </div>
                  
                  <div className="table-cell">
                    {formatDate(user.createdAt)}
                  </div>
                  
                  <div className="table-cell">
                    <span className={`role-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                      {user.isAdmin ? (t('admin') || 'Admin') : (t('user') || 'User')}
                    </span>
                  </div>
                  
                  <div className="table-cell actions-cell">
                    <button
                      className="action-btn view-btn"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      title={t('viewDetails') || 'View Details'}
                    >
                      👁️
                    </button>
                    
                    <button
                      className={`action-btn ${user.isAdmin ? 'remove-admin-btn' : 'make-admin-btn'}`}
                      onClick={() => handleMakeAdmin(user.id, !user.isAdmin)}
                      title={user.isAdmin ? (t('removeAdmin') || 'Remove Admin') : (t('makeAdmin') || 'Make Admin')}
                    >
                      {user.isAdmin ? '👤' : '👑'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('userDetails') || 'User Details'}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="user-detail-section">
                <div className="detail-avatar">
                  {selectedUser.photoURL ? (
                    <img src={selectedUser.photoURL} alt={selectedUser.displayName || selectedUser.email} />
                  ) : (
                    <span>{selectedUser.firstName?.[0] || selectedUser.displayName?.[0] || selectedUser.email?.[0] || '👤'}</span>
                  )}
                </div>
                
                <div className="detail-info">
                  <div className="detail-row">
                    <label>{t('name') || 'Name'}:</label>
                    <span>{selectedUser.displayName || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>{t('email') || 'Email'}:</label>
                    <span>{selectedUser.email}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>{t('phone') || 'Phone'}:</label>
                    <span>{selectedUser.phoneNumber || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>{t('provider') || 'Sign-in Method'}:</label>
                    <span className="provider-badge">
                      {selectedUser.provider === 'google' ? '🔗 Google' : '📧 Email'}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <label>{t('joinDate') || 'Join Date'}:</label>
                    <span>{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>{t('lastLogin') || 'Last Login'}:</label>
                    <span>{formatDate(selectedUser.lastLogin)}</span>
                  </div>
                  
                  <div className="detail-row">
                    <label>{t('role') || 'Role'}:</label>
                    <span className={`role-badge ${selectedUser.isAdmin ? 'admin' : 'user'}`}>
                      {selectedUser.isAdmin ? (t('admin') || 'Admin') : (t('user') || 'User')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                className={`btn ${selectedUser.isAdmin ? 'remove-admin' : 'make-admin'}`}
                onClick={() => {
                  handleMakeAdmin(selectedUser.id, !selectedUser.isAdmin);
                  setSelectedUser({ ...selectedUser, isAdmin: !selectedUser.isAdmin });
                }}
              >
                {selectedUser.isAdmin ? (t('removeAdmin') || 'Remove Admin') : (t('makeAdmin') || 'Make Admin')}
              </button>
              
              <button
                className="btn delete"
                onClick={() => handleDeleteUser(selectedUser.id)}
              >
                {t('deleteUser') || 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;