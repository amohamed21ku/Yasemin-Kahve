import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, EyeOff, Archive, RefreshCw, User, Phone, Building2, MessageSquare, Calendar } from 'lucide-react';
import { contactService } from '/src/services/contactService';
import './ContactMessages.css';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, unread, read, archived

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactService.getAllMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      await contactService.updateMessageStatus(messageId, newStatus);
      await loadMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating message status:', err);
      alert('Failed to update message status');
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await contactService.deleteMessage(messageId);
      await loadMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message');
    }
  };

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);
    // Mark as read when opened
    if (message.status === 'unread') {
      await handleStatusChange(message.id, 'read');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getInquiryTypeLabel = (type) => {
    const labels = {
      wholesale: 'Wholesale Partnership',
      distribution: 'Distribution Inquiry',
      'product-info': 'Product Information',
      'quality-questions': 'Quality Questions',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const filteredMessages = messages.filter(message => {
    if (filterStatus === 'all') return true;
    return message.status === filterStatus;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  if (loading) {
    return (
      <div className="contact-messages-container">
        <div className="loading-spinner">
          <RefreshCw className="spin" size={40} />
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contact-messages-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadMessages} className="retry-button">
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-messages-container">
      <div className="messages-header">
        <div className="header-title">
          <Mail size={28} />
          <h1>Contact Messages</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} new</span>
          )}
        </div>
        <button onClick={loadMessages} className="refresh-button">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="messages-filters">
        <button
          className={`filter-button ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All ({messages.length})
        </button>
        <button
          className={`filter-button ${filterStatus === 'unread' ? 'active' : ''}`}
          onClick={() => setFilterStatus('unread')}
        >
          Unread ({messages.filter(m => m.status === 'unread').length})
        </button>
        <button
          className={`filter-button ${filterStatus === 'read' ? 'active' : ''}`}
          onClick={() => setFilterStatus('read')}
        >
          Read ({messages.filter(m => m.status === 'read').length})
        </button>
        <button
          className={`filter-button ${filterStatus === 'archived' ? 'active' : ''}`}
          onClick={() => setFilterStatus('archived')}
        >
          Archived ({messages.filter(m => m.status === 'archived').length})
        </button>
      </div>

      <div className="messages-layout">
        <div className="messages-list">
          {filteredMessages.length === 0 ? (
            <div className="empty-state">
              <Mail size={48} />
              <p>No messages found</p>
            </div>
          ) : (
            filteredMessages.map(message => (
              <div
                key={message.id}
                className={`message-item ${message.status === 'unread' ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                onClick={() => handleMessageClick(message)}
              >
                <div className="message-item-header">
                  <div className="message-sender">
                    <User size={16} />
                    <strong>{message.firstName} {message.lastName}</strong>
                  </div>
                  <span className={`status-badge ${message.status}`}>
                    {message.status}
                  </span>
                </div>
                <div className="message-item-info">
                  <span className="inquiry-type">{getInquiryTypeLabel(message.inquiryType)}</span>
                </div>
                <div className="message-item-preview">
                  {message.message.substring(0, 80)}
                  {message.message.length > 80 ? '...' : ''}
                </div>
                <div className="message-item-footer">
                  <Calendar size={14} />
                  <span className="message-date">{formatDate(message.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="message-detail">
          {selectedMessage ? (
            <>
              <div className="detail-header">
                <h2>Message Details</h2>
                <div className="detail-actions">
                  {selectedMessage.status === 'unread' && (
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                      className="action-button read"
                      title="Mark as Read"
                    >
                      <Eye size={18} />
                    </button>
                  )}
                  {selectedMessage.status === 'read' && (
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, 'unread')}
                      className="action-button unread"
                      title="Mark as Unread"
                    >
                      <EyeOff size={18} />
                    </button>
                  )}
                  {selectedMessage.status !== 'archived' ? (
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                      className="action-button archive"
                      title="Archive"
                    >
                      <Archive size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                      className="action-button unarchive"
                      title="Unarchive"
                    >
                      <Archive size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="action-button delete"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="detail-content">
                <div className="detail-section">
                  <h3>Contact Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <User size={18} />
                      <div>
                        <label>Name</label>
                        <p>{selectedMessage.firstName} {selectedMessage.lastName}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Mail size={18} />
                      <div>
                        <label>Email</label>
                        <p><a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a></p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Phone size={18} />
                      <div>
                        <label>Phone</label>
                        <p><a href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a></p>
                      </div>
                    </div>
                    {selectedMessage.company && (
                      <div className="detail-item">
                        <Building2 size={18} />
                        <div>
                          <label>Company</label>
                          <p>{selectedMessage.company}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Inquiry Details</h3>
                  <div className="detail-item">
                    <MessageSquare size={18} />
                    <div>
                      <label>Inquiry Type</label>
                      <p>{getInquiryTypeLabel(selectedMessage.inquiryType)}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Calendar size={18} />
                    <div>
                      <label>Received</label>
                      <p>{formatDate(selectedMessage.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Message</h3>
                  <div className="message-content">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-detail">
              <Mail size={64} />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
