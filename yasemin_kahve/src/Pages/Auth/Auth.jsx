import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useTranslation } from '../../useTranslation';
import PhoneNumberModal from '../../Components/PhoneNumberModal';
import './Auth.css';

const Auth = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const { login, signup, signInWithGoogle, error, setError } = useAuth();
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = t('emailRequired') || 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('emailInvalid') || 'Email format is invalid';
    }
    
    if (!formData.password) {
      errors.password = t('passwordRequired') || 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = t('passwordTooShort') || 'Password must be at least 6 characters';
    }
    
    if (!isLogin) {
      if (!formData.firstName) {
        errors.firstName = t('firstNameRequired') || 'First name is required';
      }
      if (!formData.lastName) {
        errors.lastName = t('lastNameRequired') || 'Last name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = t('passwordsDoNotMatch') || 'Passwords do not match';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: `${formData.firstName} ${formData.lastName}`
        });
      }
      onNavigate('home');
    } catch (err) {
      console.error('Authentication error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithGoogle();
      if (result.shouldRequestPhone) {
        setShowPhoneModal(true);
      } else {
        onNavigate('home');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneModalSuccess = () => {
    setShowPhoneModal(false);
    onNavigate('home');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setValidationErrors({});
    setError(null);
  };

  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      
      <div className="auth-content">
        <button 
          className="back-button"
          onClick={() => onNavigate('home')}
          aria-label={t('backToHome') || 'Back to Home'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('backToHome') || 'Back to Home'}
        </button>

        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-logo">
              <img src="/src/assets/yasemin.png" alt="Yasemin Kahve" className="logo-image" />
            </div>
            <h2>{isLogin ? (t('signIn') || 'Sign In') : (t('signUp') || 'Sign Up')}</h2>
            <p>{isLogin ? (t('signInWelcome') || 'Welcome back! Sign in to your account') : (t('signUpWelcome') || 'Create your account to get started')}</p>
          </div>

          {error && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 6v4m0 4h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">{t('firstName') || 'First Name'}</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={validationErrors.firstName ? 'error' : ''}
                    placeholder={t('enterFirstName') || 'Enter your first name'}
                  />
                  {validationErrors.firstName && (
                    <span className="field-error">{validationErrors.firstName}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">{t('lastName') || 'Last Name'}</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={validationErrors.lastName ? 'error' : ''}
                    placeholder={t('enterLastName') || 'Enter your last name'}
                  />
                  {validationErrors.lastName && (
                    <span className="field-error">{validationErrors.lastName}</span>
                  )}
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">{t('email') || 'Email'}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={validationErrors.email ? 'error' : ''}
                placeholder={t('enterEmail') || 'Enter your email'}
              />
              {validationErrors.email && (
                <span className="field-error">{validationErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('password') || 'Password'}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={validationErrors.password ? 'error' : ''}
                placeholder={t('enterPassword') || 'Enter your password'}
              />
              {validationErrors.password && (
                <span className="field-error">{validationErrors.password}</span>
              )}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">{t('confirmPassword') || 'Confirm Password'}</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={validationErrors.confirmPassword ? 'error' : ''}
                  placeholder={t('confirmPasswordPlaceholder') || 'Confirm your password'}
                />
                {validationErrors.confirmPassword && (
                  <span className="field-error">{validationErrors.confirmPassword}</span>
                )}
              </div>
            )}

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  {isLogin ? (t('signingIn') || 'Signing In...') : (t('creatingAccount') || 'Creating Account...')}
                </div>
              ) : (
                isLogin ? (t('signIn') || 'Sign In') : (t('signUp') || 'Sign Up')
              )}
            </button>
          </form>

          <div className="divider">
            <span>{t('orContinueWith') || 'Or continue with'}</span>
          </div>

          <button 
            type="button" 
            className="google-button"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? (t('signingIn') || 'Signing In...') : (t('signInWithGoogle') || 'Sign in with Google')}
          </button>

          <div className="auth-switch">
            <p>
              {isLogin ? (t('noAccount') || "Don't have an account?") : (t('hasAccount') || 'Already have an account?')}
              <button 
                type="button" 
                className="switch-button"
                onClick={switchMode}
              >
                {isLogin ? (t('signUp') || 'Sign Up') : (t('signIn') || 'Sign In')}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      <PhoneNumberModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSuccess={handlePhoneModalSuccess}
      />
    </div>
  );
};

export default Auth;