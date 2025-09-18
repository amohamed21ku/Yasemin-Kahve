import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Eye, Edit3, Trash2, Calendar, User, Building } from 'lucide-react';
import { sampleOrderService } from '../../../services/sampleOrderService';
import { useTranslation } from '../../../useTranslation';
import './SampleOrderManagement.css';

const SampleOrderManagement = () => {
  const { t } = useTranslation();
  const [sampleOrders, setSampleOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadSampleOrders();
  }, []);

  const loadSampleOrders = async () => {
    try {
      setLoading(true);
      const orders = await sampleOrderService.getAllSampleOrders();
      setSampleOrders(orders);
    } catch (error) {
      console.error('Error loading sample orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      await sampleOrderService.updateOrderStatus(orderId, newStatus);
      await loadSampleOrders(); // Refresh the list
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await sampleOrderService.deleteSampleOrder(orderId);
      await loadSampleOrders(); // Refresh the list
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'processing': return '#007bff';
      case 'shipped': return '#28a745';
      case 'delivered': return '#6f42c1';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'processing': return <Package size={16} />;
      case 'shipped': return <Package size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredOrders = sampleOrders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';

    let date;
    if (timestamp.toDate) {
      // Firestore timestamp
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      // ISO string
      date = new Date(timestamp);
    }

    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="sample-orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading sample orders...</p>
      </div>
    );
  }

  return (
    <div className="sample-order-management">
      <div className="sample-orders-header">
        <h2>
          <Package size={24} />
          Sample Order Management
        </h2>
        <div className="order-stats">
          <div className="stat-card">
            <span className="stat-number">{sampleOrders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {sampleOrders.filter(o => o.status === 'pending').length}
            </span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {sampleOrders.filter(o => o.status === 'processing').length}
            </span>
            <span className="stat-label">Processing</span>
          </div>
        </div>
      </div>

      <div className="orders-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({sampleOrders.length})
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({sampleOrders.filter(o => o.status === 'pending').length})
        </button>
        <button
          className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
          onClick={() => setFilter('processing')}
        >
          Processing ({sampleOrders.filter(o => o.status === 'processing').length})
        </button>
        <button
          className={`filter-btn ${filter === 'shipped' ? 'active' : ''}`}
          onClick={() => setFilter('shipped')}
        >
          Shipped ({sampleOrders.filter(o => o.status === 'shipped').length})
        </button>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <Package size={48} />
            <p>No sample orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <strong>#{order.orderId}</strong>
                </div>
                <div className="order-status">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="order-info">
                <div className="order-meta">
                  <div className="meta-item">
                    <User size={16} />
                    <span>{order.userEmail}</span>
                  </div>
                  <div className="meta-item">
                    <Building size={16} />
                    <span>{order.orderDetails?.companyName || 'No company'}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div className="order-samples">
                  <strong>Samples ({order.samples?.length || 0}):</strong>
                  <div className="sample-items">
                    {order.samples?.map((sample, index) => (
                      <span key={index} className="sample-tag">
                        {sample.name}
                      </span>
                    )) || 'No samples'}
                  </div>
                </div>
              </div>

              <div className="order-actions">
                <button
                  className="action-btn view-btn"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowDetails(true);
                  }}
                  title="View Details"
                >
                  <Eye size={16} />
                </button>

                <select
                  className="status-select"
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  disabled={updating}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteOrder(order.id)}
                  title="Delete Order"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="order-details-modal" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.orderId}</h3>
              <button
                className="modal-close"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Email:</strong> {selectedOrder.userEmail}</p>
                <p><strong>Company:</strong> {selectedOrder.orderDetails?.companyName || 'Not provided'}</p>
                <p><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
              </div>

              <div className="detail-section">
                <h4>Shipping Address</h4>
                <p>{selectedOrder.orderDetails?.shippingAddress || 'Not provided'}</p>
              </div>

              {selectedOrder.orderDetails?.optionalMessage && (
                <div className="detail-section">
                  <h4>Customer Message</h4>
                  <p>{selectedOrder.orderDetails.optionalMessage}</p>
                </div>
              )}

              <div className="detail-section">
                <h4>Requested Samples</h4>
                <div className="samples-grid">
                  {selectedOrder.samples?.map((sample, index) => (
                    <div key={index} className="sample-detail-card">
                      <img
                        src={sample.image}
                        alt={sample.name}
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f8f3ed'/%3E%3Cg fill='%23e6b555'%3E%3Ccircle cx='30' cy='24' r='6'/%3E%3Cellipse cx='30' cy='36' rx='10' ry='6'/%3E%3C/g%3E%3Ctext x='30' y='50' text-anchor='middle' fill='%23503c2b' font-size='8'%3ECoffee%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div className="sample-info">
                        <h5>{sample.name}</h5>
                        <p>{sample.origin}</p>
                        {sample.region && <span className="region-tag">{sample.region}</span>}
                      </div>
                    </div>
                  )) || <p>No samples in this order</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleOrderManagement;