import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useTranslation } from '../useTranslation';
import { useAuth } from '../AuthContext';
import { sampleOrderService } from '../services/sampleOrderService';
import './SampleCart.css';

const SampleCart = ({ isOpen, onClose, onNavigate }) => {
  const { t } = useTranslation();
  const { currentUser, getUserData } = useAuth();
  const [sampleItems, setSampleItems] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    fullName: '',
    companyName: '',
    phoneNumber: '',
    email: '',
    shippingAddress: '',
    optionalMessage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadSampleCart();
    // Listen for cart updates
    const handleCartUpdate = () => loadSampleCart();
    window.addEventListener('sampleCartUpdated', handleCartUpdate);
    return () => window.removeEventListener('sampleCartUpdated', handleCartUpdate);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Load user profile data when user changes or form opens
  useEffect(() => {
    if (currentUser && showOrderForm) {
      loadUserProfile();
    }
  }, [currentUser, showOrderForm]);

  const loadUserProfile = async () => {
    try {
      const userData = await getUserData(currentUser.uid);
      setUserProfile(userData);

      // Pre-populate form with existing user data
      setOrderData(prev => ({
        ...prev,
        fullName: userData?.displayName || `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || '',
        companyName: userData?.companyName || '',
        phoneNumber: userData?.phoneNumber || '',
        email: userData?.email || currentUser.email || '',
        shippingAddress: userData?.shippingAddress || userData?.lastShippingAddress || ''
      }));
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadSampleCart = () => {
    const cart = JSON.parse(localStorage.getItem('sampleCart') || '[]');
    setSampleItems(cart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = sampleItems.filter(item => item.id !== productId);
    setSampleItems(updatedCart);
    localStorage.setItem('sampleCart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('sampleCartUpdated'));
  };

  const clearCart = () => {
    setSampleItems([]);
    localStorage.removeItem('sampleCart');
    window.dispatchEvent(new Event('sampleCartUpdated'));
  };

  const handleProceed = () => {
    if (!currentUser) {
      // Redirect to registration page
      onNavigate('register');
      onClose();
      return;
    }
    setShowOrderForm(true);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);

    try {
      // Create sample order
      const sampleOrder = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        samples: sampleItems,
        orderDetails: {
          companyName: orderData.companyName,
          shippingAddress: orderData.shippingAddress,
          optionalMessage: orderData.optionalMessage
        },
        status: 'pending',
        orderId: `SAMPLE-${Date.now()}`
      };

      // Save to Firebase
      console.log('SampleCart - Creating sample order:', sampleOrder);
      const createdOrder = await sampleOrderService.createSampleOrder(sampleOrder);
      console.log('SampleCart - Sample order created:', createdOrder);

      // Add order ID to user's sampleOrders array
      const currentUserData = await getUserData(currentUser.uid);
      const existingSampleOrders = currentUserData?.sampleOrders || [];
      const updatedSampleOrders = [...existingSampleOrders, createdOrder.id];

      // Update user profile with all new info
      const profileUpdates = {};
      if (orderData.companyName && orderData.companyName !== userProfile?.companyName) {
        profileUpdates.companyName = orderData.companyName;
      }
      if (orderData.phoneNumber && orderData.phoneNumber !== userProfile?.phoneNumber) {
        profileUpdates.phoneNumber = orderData.phoneNumber;
      }
      if (orderData.shippingAddress) {
        profileUpdates.shippingAddress = orderData.shippingAddress;
        // Also keep it as lastShippingAddress for backwards compatibility
        profileUpdates.lastShippingAddress = orderData.shippingAddress;
      }
      if (orderData.fullName && orderData.fullName !== userProfile?.displayName) {
        profileUpdates.displayName = orderData.fullName;
        // Split full name for firstName/lastName if needed
        const [firstName, ...lastNameParts] = orderData.fullName.split(' ');
        if (firstName && firstName !== userProfile?.firstName) {
          profileUpdates.firstName = firstName;
        }
        if (lastNameParts.length > 0 && lastNameParts.join(' ') !== userProfile?.lastName) {
          profileUpdates.lastName = lastNameParts.join(' ');
        }
      }

      // Always update sampleOrders array
      profileUpdates.sampleOrders = updatedSampleOrders;

      // Update user profile with all new info including sampleOrders
      await sampleOrderService.updateUserProfile(currentUser.uid, profileUpdates);

      // Clear cart
      clearCart();

      // Show success and close
      alert(t('sampleOrderSubmitted') || 'Sample order submitted successfully!');
      setShowOrderForm(false);
      onClose();
    } catch (error) {
      console.error('Error submitting sample order:', error);
      alert('Error submitting order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sample-cart-overlay" onClick={onClose}>
      <div className="sample-cart-content" onClick={(e) => e.stopPropagation()}>
        <div className="sample-cart-header">
          <h2>
            <ShoppingCart size={24} />
            {t('sampleCart') || 'Sample Cart'}
          </h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {!showOrderForm ? (
          <div className="sample-cart-body">
            {sampleItems.length === 0 ? (
              <div className="empty-cart">
                <ShoppingCart size={48} />
                <p>{t('noSamplesInCart') || 'No samples in cart'}</p>
              </div>
            ) : (
              <>
                <div className="sample-items">
                  {sampleItems.map((item, index) => (
                    <div key={item.id} className="sample-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f8f3ed'/%3E%3Cg fill='%23e6b555'%3E%3Ccircle cx='30' cy='24' r='6'/%3E%3Cellipse cx='30' cy='36' rx='10' ry='6'/%3E%3C/g%3E%3Ctext x='30' y='50' text-anchor='middle' fill='%23503c2b' font-size='8'%3ECoffee%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>{item.origin}</p>
                        {item.region && <span className="region">{item.region}</span>}
                      </div>
                      <button
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove from cart"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="sample-cart-footer">
                  <button className="clear-cart-button" onClick={clearCart}>
                    {t('clearCart') || 'Clear Cart'}
                  </button>
                  <button className="proceed-button" onClick={handleProceed}>
                    {currentUser
                      ? (t('proceedToOrder') || 'Proceed to Order')
                      : (t('registerToOrder') || 'Register to Order')
                    }
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="sample-order-form">
            <h3>{t('sampleOrderDetails') || 'Sample Order Details'}</h3>
            <p className="form-description">
              {t('sampleOrderDescription') || 'Please provide your information for sample delivery. This information will be saved to your profile for future orders.'}
            </p>
            <form onSubmit={handleOrderSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">
                  {t('fullName') || 'Full Name'} *
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={orderData.fullName}
                  onChange={(e) => setOrderData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  {t('email') || 'Email'} *
                </label>
                <input
                  type="email"
                  id="email"
                  value={orderData.email}
                  onChange={(e) => setOrderData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">
                  {t('phoneNumber') || 'Phone Number'} *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={orderData.phoneNumber}
                  onChange={(e) => setOrderData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="companyName">
                  {t('companyName') || 'Company Name'}
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={orderData.companyName}
                  onChange={(e) => setOrderData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder={t('companyNameOptional') || 'Optional'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="shippingAddress">
                  {t('shippingAddress') || 'Shipping Address'} *
                </label>
                <textarea
                  id="shippingAddress"
                  value={orderData.shippingAddress}
                  onChange={(e) => setOrderData(prev => ({ ...prev, shippingAddress: e.target.value }))}
                  rows="3"
                  required
                  placeholder={t('shippingAddressPlaceholder') || 'Full address including city, postal code, and country'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="optionalMessage">
                  {t('optionalMessage') || 'Optional Message'}
                </label>
                <textarea
                  id="optionalMessage"
                  value={orderData.optionalMessage}
                  onChange={(e) => setOrderData(prev => ({ ...prev, optionalMessage: e.target.value }))}
                  rows="2"
                  placeholder={t('optionalMessagePlaceholder') || 'Any special requests or notes...'}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="back-button"
                  onClick={() => setShowOrderForm(false)}
                >
                  {t('back') || 'Back'}
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? (t('submitting') || 'Submitting...')
                    : (t('submitSampleOrder') || 'Submit Sample Order')
                  }
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SampleCart;