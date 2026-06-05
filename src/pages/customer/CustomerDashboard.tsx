import { useState, useEffect, FormEvent } from 'react';
import { useRudrax } from '../../app/StateContext';
import { Order, OrderStatus } from '../../models/types';
import { Clock, Package, RefreshCw, Sparkles, User, Eye, EyeOff, Mail, Phone, Lock, ShieldCheck, ArrowRight, ShieldAlert, Key, Check } from 'lucide-react';
import { Badge, Button } from '../../components/ui/atoms';

export function CustomerDashboard() {
  const {
    orders,
    returns,
    products,
    requestReturn,
    currentUser,
    addresses,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPasswordLink,
    signOutUser,
    updateUserProfile
  } = useRudrax();

  const [activeTab, setActiveTab] = useState<string>('orders'); // 'orders', 'returns', 'addresses', 'profile_edit'
  
  // Profile Input States
  const [profileName, setProfileName] = useState<string>('');
  const [profilePhone, setProfilePhone] = useState<string>('');
  const [saveIndicator, setSaveIndicator] = useState<string>('');

  // Authentication Interface States
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  
  // Password visual feedback settings
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Input elements
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authName, setAuthName] = useState<string>('');
  const [authPhone, setAuthPhone] = useState<string>('');
  
  // Reset password states
  const [forgotPasswordMode, setForgotPasswordMode] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotSuccess, setForgotSuccess] = useState<string>('');
  
  // Mobile OTP simulation registers
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [simulatedOtp, setSimulatedOtp] = useState<string>('');
  const [otpEntered, setOtpEntered] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(60);
  
  // Operation status flags
  const [authError, setAuthError] = useState<string>('');
  const [authInfoMsg, setAuthInfoMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Synchronize dynamic user profile on login/load
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // Manage simulated SMS expiration timers
  useEffect(() => {
    let timer: any;
    if (otpSent && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpSent, otpTimer]);

  // Email authentication router submission
  const handleEmailAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthInfoMsg('');
    setIsSubmitting(true);
    
    try {
      if (isAdminMode) {
        // Staff/Operator credential check
        await signInWithEmail(authEmail, authPassword);
      } else {
        if (isRegisterMode) {
          if (!authName) {
            setAuthError('Please fill in your full name to proceed.');
            setIsSubmitting(false);
            return;
          }
          await signUpWithEmail(authEmail, authPassword, authName, authPhone);
        } else {
          await signInWithEmail(authEmail, authPassword);
        }
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || 'Verification failed. Please review credentials.';
      if (err.code === 'auth/wrong-password') errMsg = 'Wrong password key. Please verify characters and try again.';
      if (err.code === 'auth/user-not-found') errMsg = 'Account with this email does not exist. Register for a new account!';
      if (err.code === 'auth/email-already-in-use') errMsg = 'This email layout is already linked to an existing profile. Please sign in instead!';
      if (err.code === 'auth/weak-password') errMsg = 'Password is too weak. Please include at least 6 characters.';
      if (err.code === 'auth/invalid-email') errMsg = 'The format of the email address is invalid.';
      setAuthError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password reset gate dispatch
  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setAuthError('Please fill in your registered email to continue.');
      return;
    }
    setIsSubmitting(true);
    setAuthError('');
    setForgotSuccess('');
    try {
      await resetPasswordLink(forgotEmail);
      setForgotSuccess(`We have dispatched a password reset secure link to ${forgotEmail}. Please review your inbox/spam folder.`);
    } catch (err: any) {
      setAuthError(err.message || 'Reset link dispatch failed. Please confirm the email address format.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulated OTP sender
  const handleSendOtp = () => {
    if (!phoneInput || phoneInput.replace(/[^0-9]/g, '').length < 10) {
      setAuthError('Please input a valid 10-digit mobile number.');
      return;
    }
    if (isRegisterMode && !authName) {
      setAuthError('Please enter your full name first.');
      return;
    }
    setOtpSent(false);
    setAuthError('');
    
    // Generate secure 6 digit OTP block code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(generatedCode);
    setOtpSent(true);
    setOtpTimer(60);
    setOtpEntered('');
    setAuthInfoMsg('SMS OTP dispatch simulation active!');
  };

  // Simulated OTP verification
  const handleVerifyOtp = async () => {
    if (otpEntered !== simulatedOtp) {
      setAuthError('Invalid Verification Code. Please check the code in the system alert block above.');
      return;
    }
    
    setAuthError('');
    setAuthInfoMsg('');
    setIsSubmitting(true);
    
    const formattedPhone = phoneInput.replace(/[^0-9]/g, '');
    const derivedEmail = `phone_${formattedPhone}@rudrax.store`;
    const derivedPassword = `phone_${formattedPhone}_secret_pin`;
    
    try {
      // Try logging in
      await signInWithEmail(derivedEmail, derivedPassword);
    } catch (err: any) {
      // Otherwise auto-generate profile
      try {
        await signUpWithEmail(derivedEmail, derivedPassword, authName || 'Valued Customer', phoneInput);
      } catch (regErr: any) {
        console.error("Auto registration errored: ", regErr);
        setAuthError(regErr.message || 'Phone verification processing failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset login state switches
  const resetFormModes = () => {
    setAuthError('');
    setAuthInfoMsg('');
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setAuthPhone('');
    setPhoneInput('');
    setOtpSent(false);
    setForgotPasswordMode(false);
    setForgotSuccess('');
  };

  // Return request form modal states
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnProdId, setReturnProdId] = useState<string>('');
  const [returnVarId, setReturnVarId] = useState<string>('');
  const [returnQty, setReturnQty] = useState<number>(1);
  const [returnReason, setReturnReason] = useState<string>('Quality compromised / damaged packaging');

  const handleOpenReturnModal = (ord: Order) => {
    setReturnOrderId(ord.id);
    const item = ord.items[0];
    if (item) {
      setReturnProdId(item.productId);
      setReturnVarId(item.variantId);
      setReturnQty(item.quantity);
    }
  };

  const handleTriggerReturnRequest = () => {
    if (returnOrderId && returnProdId && returnVarId) {
      requestReturn(returnOrderId, returnProdId, returnVarId, returnQty, returnReason);
      setReturnOrderId(null);
    }
  };

  const getStatusColor = (st: OrderStatus) => {
    switch (st) {
      case 'Pending': return 'warning';
      case 'Confirmed': return 'info';
      case 'Packed': return 'info';
      case 'Shipped': return 'info';
      case 'Out For Delivery': return 'warning';
      case 'Delivered': return 'success';
      case 'Returned': return 'danger';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  // Get matching product name for return modal rendering
  const currentReturnProduct = products.find(p => p.id === returnProdId);
  const currentReturnVariant = currentReturnProduct?.variants.find(v => v.id === returnVarId);

  if (!currentUser) {
    return (
      <div className="customer-workspace bg-slate-50 min-h-[85vh] flex items-center justify-center py-12 px-4 select-none">
        <div id="auth_portal_card" className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-md relative overflow-hidden transition-all">
          
          {/* Accent decoration ribbon */}
          <div className={`h-1.5 w-full absolute top-0 left-0 ${isAdminMode ? 'bg-amber-500' : 'bg-teal-600'}`}></div>

          {/* Header Switcher (Customer vs Operator) ONLY shown when not reset-password routing */}
          {!forgotPasswordMode && (
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-100">
              <button
                id="btn_pivot_customer"
                onClick={() => { setIsAdminMode(false); resetFormModes(); }}
                className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 transition-all cursor-pointer ${
                  !isAdminMode 
                    ? 'border-teal-600 text-teal-700' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                🛍️ Customer Area
              </button>
              <button
                id="btn_pivot_operator"
                onClick={() => { setIsAdminMode(true); resetFormModes(); }}
                className={`text-xs font-bold uppercase tracking-wider pb-1.5 border-b-2 transition-all cursor-pointer ${
                  isAdminMode 
                    ? 'border-amber-500 text-amber-600' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                🔐 Staff Sign-In
              </button>
            </div>
          )}

          {/* Brand Logo & Title */}
          <div className="text-center mb-6">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xs border ${
              isAdminMode 
                ? 'bg-amber-50 border-amber-200 text-amber-600' 
                : 'bg-teal-50 border-teal-100 text-teal-600'
            }`}>
              {isAdminMode ? <ShieldCheck size={24} /> : <User size={24} />}
            </div>
            
            <h2 className="text-xl font-black text-slate-950 tracking-tight">
              {forgotPasswordMode 
                ? 'Restore Clearances' 
                : isAdminMode 
                  ? 'Operator Gate' 
                  : isRegisterMode 
                    ? 'Generate Rudrax Account' 
                    : 'Access Customer Area'
              }
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              {forgotPasswordMode 
                ? 'Verify credential properties to dispatch instant password recovery link.'
                : isAdminMode 
                  ? 'Authorized store administrator login' 
                  : isRegisterMode 
                    ? 'Join to gain custom order sheets, slots & earn loyalty tokens instantly.' 
                    : 'Log in to track orders, manage addresses, and claim loyalty loyalty tokens.'
              }
            </p>
          </div>

          {/* OTP Alert simulator banner - Customer method phone */}
          {!isAdminMode && authMethod === 'phone' && otpSent && simulatedOtp && (
            <div id="simulated_sms_alert" className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-center animate-pulse">
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-800 block mb-0.5">💬 Simulated Incoming SMS Notification</span>
              <p className="text-xs text-slate-700 font-medium">
                Your secure Verification Code is: <strong className="font-mono text-sm tracking-widest text-slate-950 bg-white px-2 py-0.5 rounded border border-amber-300 shadow-3xs">{simulatedOtp}</strong>
              </p>
            </div>
          )}

          {/* Feedback states */}
          {authError && (
            <div id="err_auth_alert" className="mb-5 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-2.5 items-start">
              <ShieldAlert size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="text-left">
                <span className="text-[10px] font-black uppercase text-rose-700 font-mono tracking-wider block">Error Occurred</span>
                <p className="text-xs text-rose-800 font-semibold leading-relaxed mt-0.5">{authError}</p>
              </div>
            </div>
          )}

          {authInfoMsg && !authError && (
            <div id="info_auth_alert" className="mb-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-2.5 items-start">
              <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-left">
                <span className="text-[10px] font-black uppercase text-emerald-700 font-mono tracking-wider block">System Status</span>
                <p className="text-xs text-emerald-800 font-semibold leading-relaxed mt-0.5">{authInfoMsg}</p>
              </div>
            </div>
          )}

          {/* Password Reset Form Layout */}
          {forgotPasswordMode ? (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              {forgotSuccess ? (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold rounded-2xl p-4 text-center leading-relaxed">
                  {forgotSuccess}
                  <button
                    type="button"
                    onClick={() => { setForgotPasswordMode(false); resetFormModes(); }}
                    className="mt-4 block w-full bg-slate-900 text-white font-bold py-2 rounded-xl text-xs hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-left">
                    <label id="lbl_forgot_email" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">Registered Email</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400"><Mail size={15} /></span>
                      <input
                        id="txt_forgot_email"
                        type="email"
                        required
                        placeholder="e.g. resident@domain.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 font-medium focus:bg-white text-slate-900 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    id="btn_forgot_submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 font-bold rounded-xl text-xs bg-slate-950 hover:bg-slate-800 text-white transition-all shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? 'Processing Gateway Link...' : 'Send Secure Password Reset Link'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordMode(false)}
                      className="text-xs text-slate-500 hover:text-slate-950 font-bold transition-all cursor-pointer"
                    >
                      ← Back to Authentication Entry
                    </button>
                  </div>
                </>
              )}
            </form>
          ) : (
            <>
              {/* Customer togglable Switcher (Email vs Mobile) */}
              {!isAdminMode && (
                <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-5 border border-slate-200">
                  <button
                    id="btn_method_email"
                    type="button"
                    onClick={() => { setAuthMethod('email'); setAuthError(''); setAuthInfoMsg(''); }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      authMethod === 'email' 
                        ? 'bg-white text-teal-700 shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Mail size={13} /> Email Port
                  </button>
                  <button
                    id="btn_method_phone"
                    type="button"
                    onClick={() => { setAuthMethod('phone'); setAuthError(''); setAuthInfoMsg(''); }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      authMethod === 'phone' 
                        ? 'bg-white text-teal-700 shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Phone size={13} /> Mobile SMS
                  </button>
                </div>
              )}

              {/* Form Input Interfaces */}
              {authMethod === 'email' || isAdminMode ? (
                /* EMAIL SIGN IN OR REGISTRATION FORM */
                <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
                  
                  {/* Name field (Only shown for customer register) */}
                  {!isAdminMode && isRegisterMode && (
                    <div className="text-left">
                      <label id="lbl_reg_name" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">Full Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400"><User size={15} /></span>
                        <input
                          id="txt_reg_name"
                          type="text"
                          required
                          placeholder="Your complete name"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 font-medium focus:bg-white text-slate-900 transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email field */}
                  <div className="text-left">
                    <label id="lbl_auth_email" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400"><Mail size={15} /></span>
                      <input
                        id="txt_auth_email"
                        type="email"
                        required
                        placeholder="e.g. user@rudrax.store"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 font-medium focus:bg-white text-slate-900 transition-all ${
                          isAdminMode ? 'focus:border-amber-500 focus:ring-1 focus:ring-amber-500' : 'focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="text-left">
                    <div className="flex justify-between items-center mb-1.5">
                      <label id="lbl_auth_pwd" className="block text-xs font-bold text-slate-700 uppercase font-mono">Password</label>
                      <button
                        type="button"
                        onClick={() => setForgotPasswordMode(true)}
                        className="text-[10px] text-teal-600 hover:text-teal-800 font-bold tracking-tight transition-all cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400"><Lock size={15} /></span>
                      <input
                        id="txt_auth_pwd"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 font-medium focus:bg-white text-slate-900 transition-all ${
                          isAdminMode ? 'focus:border-amber-500 focus:ring-1 focus:ring-amber-500' : 'focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                        }`}
                      />
                      <button
                        id="btn_pwd_toggle_eye"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Phone field (Only shown for customer register optional) */}
                  {!isAdminMode && isRegisterMode && (
                    <div className="text-left">
                      <label id="lbl_reg_phone" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">Mobile (Optional)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400"><Phone size={15} /></span>
                        <input
                          id="txt_reg_phone"
                          type="text"
                          placeholder="e.g. +91 94820 XXXXX"
                          value={authPhone}
                          onChange={(e) => setAuthPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 font-medium focus:bg-white text-slate-900 transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Primary submit action button */}
                  <button
                    id="btn_auth_email_submit"
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-5 rounded-2xl font-black text-xs uppercase tracking-wider text-white border transition-all cursor-pointer font-sans active:scale-97 flex items-center justify-center gap-1.5 shadow-sm ${
                      isAdminMode 
                        ? 'bg-amber-600 border-amber-500 hover:bg-amber-500 shadow-amber-600/10' 
                        : 'bg-teal-700 border-teal-600 hover:bg-teal-600 shadow-teal-700/10'
                    }`}
                  >
                    {isSubmitting ? (
                      'Processing Transaction...'
                    ) : isAdminMode ? (
                      <>🔑 Unlock Management Terminal</>
                    ) : isRegisterMode ? (
                      <>✨ Generate Account & Gain Credits</>
                    ) : (
                      <>🔒 Sign In Securely</>
                    )}
                  </button>

                  {/* Customer register toggle link */}
                  {!isAdminMode && (
                    <div className="text-center pt-2">
                      <p className="text-xs text-slate-500 font-semibold">
                        {isRegisterMode ? 'Already have an account?' : 'New to Rudrax store?'}
                        <button
                          id="btn_toggle_register"
                          type="button"
                          onClick={() => { setIsRegisterMode(!isRegisterMode); setAuthError(''); setAuthInfoMsg(''); }}
                          className="ml-1 text-teal-600 hover:text-teal-800 font-black tracking-wide transition-all cursor-pointer border-b border-transparent hover:border-teal-700"
                        >
                          {isRegisterMode ? 'Sign In' : 'Create an Account'}
                        </button>
                      </p>
                    </div>
                  )}

                </form>
              ) : (
                /* CUSTOMER MOBILE/SMS OR REGISTRATION OTP FORM */
                <div className="space-y-4">
                  {/* Name field (Only shown for customer register via phone) */}
                  {isRegisterMode && !otpSent && (
                    <div className="text-left">
                      <label id="lbl_phone_reg_name" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">Full Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400"><User size={15} /></span>
                        <input
                          id="txt_phone_reg_name"
                          type="text"
                          required
                          placeholder="Your complete name"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 font-medium focus:bg-white text-slate-900 transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Mobile number phone input */}
                  <div className="text-left">
                    <label id="lbl_phone_input" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400"><Phone size={15} /></span>
                      <input
                        id="txt_phone_input"
                        type="tel"
                        disabled={otpSent}
                        placeholder="e.g. 9876543210"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 font-medium focus:bg-white text-slate-900 transition-all disabled:opacity-60 disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  {/* OTP Digit Field if Sent */}
                  {otpSent && (
                    <div className="text-left space-y-2 animate-fade-in">
                      <div className="flex justify-between items-center">
                        <label id="lbl_otp_input" className="block text-xs font-bold text-slate-700 uppercase font-mono">SMS Verification PIN</label>
                        <span className="text-[10px] text-slate-500 font-semibold font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          Expires in {otpTimer}s
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400"><Key size={15} /></span>
                        <input
                          id="txt_otp_input"
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit code"
                          value={otpEntered}
                          onChange={(e) => setOtpEntered(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 font-bold focus:bg-white text-slate-900 transition-all tracking-widest text-center"
                        />
                      </div>
                    </div>
                  )}

                  {/* Multi-step dispatch buttons */}
                  {!otpSent ? (
                    <button
                      id="btn_phone_send_otp"
                      onClick={handleSendOtp}
                      className="w-full py-3 px-5 rounded-2xl font-black text-xs uppercase tracking-wider text-white border bg-teal-750 border-teal-600 hover:bg-teal-700 transition-all cursor-pointer font-sans active:scale-97 flex items-center justify-center gap-1.5 shadow-sm shadow-teal-700/10"
                    >
                      💬 Dispatch Simulated Verification SMS
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        id="btn_phone_verify"
                        onClick={handleVerifyOtp}
                        disabled={isSubmitting}
                        className="w-full py-3 px-5 rounded-2xl font-black text-xs uppercase tracking-wider text-white border bg-emerald-700 border-emerald-600 hover:bg-emerald-600 transition-all cursor-pointer font-sans active:scale-97 flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-700/10"
                      >
                        {isSubmitting ? 'Authenticating...' : '✓ Complete SMS Verification'}
                      </button>
                      
                      <div className="flex justify-between items-center pt-2">
                        <button
                          type="button"
                          onClick={() => { setOtpSent(false); setAuthError(''); setAuthInfoMsg(''); }}
                          className="text-[10px] text-slate-500 hover:text-slate-900 font-semibold transition-all cursor-pointer"
                        >
                          ← Change Phone Number
                        </button>
                        {otpTimer === 0 && (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="text-[10px] text-teal-600 hover:text-teal-800 font-bold transition-all cursor-pointer"
                          >
                            Resend PIN SMS
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Customer register toggle link */}
                  {!otpSent && (
                    <div className="text-center pt-2">
                      <p className="text-xs text-slate-500 font-semibold">
                        {isRegisterMode ? 'Already have an account?' : 'New to Rudrax store?'}
                        <button
                          id="btn_phone_toggle_register"
                          type="button"
                          onClick={() => { setIsRegisterMode(!isRegisterMode); setAuthError(''); setAuthInfoMsg(''); }}
                          className="ml-1 text-teal-600 hover:text-teal-800 font-black tracking-wide transition-all cursor-pointer border-b border-transparent hover:border-teal-700"
                        >
                          {isRegisterMode ? 'Sign In' : 'Create an Account'}
                        </button>
                      </p>
                    </div>
                  )}

                </div>
              )}

              {/* Dynamic Google Login option block (Only shown in Customer Mode) */}
              {!isAdminMode && (
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-3 select-none">
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Or connect instantly using standard secure keys</span>
                  </div>
                  
                  <button
                    id="btn_auth_google"
                    onClick={signInWithGoogle}
                    className="w-full justify-center bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl py-3 px-4 transition-all text-xs flex items-center justify-center gap-2 border border-slate-200 font-sans cursor-pointer active:scale-95 shadow-2xs hover:shadow-xs"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google OAuth
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="customer-workspace bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Profile Card Summary Row */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-950 text-white rounded-3xl p-6 shadow-md mb-8 flex justify-between items-center flex-wrap gap-4 relative overflow-hidden select-none">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-3 translate-x-3 scale-150">
            <Package size={200} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt={currentUser.name} className="h-14 w-14 rounded-2xl border border-teal-500 object-cover shadow-sm" referrerPolicy="no-referrer" />
            ) : (
              <div className="h-14 w-14 bg-teal-600 border border-teal-500 rounded-2xl flex items-center justify-center font-bold text-xl uppercase shadow-sm">
                {currentUser.name[0]}
              </div>
            )}
            <div>
              <h1 className="text-xl font-black tracking-tight">{currentUser.name}</h1>
              <p className="text-xs text-teal-300 font-medium mb-1.5">{currentUser.email} | {currentUser.phone}</p>
              {!currentUser.photoURL ? (
                <button
                  onClick={signInWithGoogle}
                  className="rounded-lg bg-teal-700 hover:bg-teal-600 active:scale-95 text-[10px] font-bold text-teal-100 hover:text-white px-3 py-1 cursor-pointer border border-teal-500/30 flex items-center gap-1.5 shadow-sm transition-all"
                >
                  🔐 Connect Google Account
                </button>
              ) : (
                <button
                  onClick={signOutUser}
                  className="rounded-lg bg-red-800 hover:bg-red-700 active:scale-95 text-[10px] font-bold text-red-100 hover:text-white px-3 py-1 cursor-pointer border border-red-500/30 shadow-sm transition-all"
                >
                  🚪 Toggle Account / Logout
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3 relative z-10">
            <div className="h-10 w-10 bg-amber-400 rounded-xl flex items-center justify-center text-slate-900 shadow-md">
              <Sparkles size={18} className="fill-slate-900" />
            </div>
            <div>
              <span className="text-[10px] text-teal-200 font-bold block uppercase tracking-wider">Rudrax loyalty tier</span>
              <span className="text-sm font-black text-amber-300 font-mono tracking-tight">{currentUser.loyaltyPoints} points earned</span>
            </div>
          </div>
        </div>

        {/* Navigation Workspace Sub-tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-4 mb-6 select-none">
          {[
            { id: 'orders', label: "My Orders & Tracking" },
            { id: 'returns', label: "Returns History" },
            { id: 'addresses', label: "Saved Addresses" },
            { id: 'profile_edit', label: "Personal Profile Settings" }
          ].map(tb => (
            <button
               key={tb.id}
               onClick={() => setActiveTab(tb.id)}
               className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                 activeTab === tb.id
                   ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10'
                   : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100'
               }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* RETURN DIALOG / MODAL FORM */}
        {returnOrderId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
              <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-1.5 leading-tight animate-bounce">
                <RefreshCw size={19} className="text-teal-600" /> File Return Request
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">Ensure the supermarket seal is intact. Refund will be credited dynamically upon verification.</p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-xs">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Order Reference</span>
                  <span className="font-mono text-slate-900">{returnOrderId}</span>
                </div>
                <div className="flex justify-between mt-1 text-slate-500 font-medium">
                  <span>Item to Return</span>
                  <span>{currentReturnProduct?.name} ({currentReturnVariant?.name})</span>
                </div>
              </div>

              <div className="flex flex-col gap-3.5 mb-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1.5">Returns Reason</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 bg-white text-slate-800 rounded-xl"
                  >
                    <option value="Quality compromised / damaged packaging">Quality compromised / damaged packaging</option>
                    <option value="Incorrect grocery weight variant delivered">Incorrect grocery weight variant delivered</option>
                    <option value="Near expiry date/Spoiled">Near expiry date/Spoiled</option>
                    <option value="Ordered in error">Ordered in error</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1.5">Quantity to return</label>
                  <input
                    type="number"
                    min="1"
                    value={returnQty}
                    onChange={(e) => setReturnQty(Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 bg-white text-slate-800 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 justify-end">
                <Button variant="outline" size="sm" onClick={() => setReturnOrderId(null)}>Cancel</Button>
                <Button variant="danger" size="sm" onClick={handleTriggerReturnRequest}>Submit Return Claim</Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: ORDERS TRACKING SYSTEM */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-5 animate-fadeIn">
            {orders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center flex flex-col items-center">
                <Package size={40} className="text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-800 mb-1">No orders located</h3>
                <p className="text-xs text-slate-500 max-w-[280px]">Your dynamic e-commerce payload history is clear. Place a mock checkout order first!</p>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  {/* Order card header details */}
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4 flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1.5 font-mono">
                        📦 ID: {ord.id}
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold font-mono mt-0.5">Placed: {new Date(ord.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(ord.status)}>
                        {ord.status}
                      </Badge>
                      {ord.status === 'Delivered' && !ord.returnRequested && (
                        <button
                          onClick={() => handleOpenReturnModal(ord)}
                          className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 h-6 px-2.5 rounded-lg font-bold transition-all cursor-pointer"
                        >
                          Return Item
                        </button>
                      )}
                    </div>
                  </div>

                  {/* List of items with specific variant pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Purchased Products</h4>
                      {ord.items.map((item, idx) => {
                        const pr = products.find(p => p.id === item.productId);
                        const vr = pr?.variants.find(v => v.id === item.variantId);
                        return (
                          <div key={idx} className="flex gap-2.5 items-center text-xs">
                            <img src={pr?.image} className="h-8 w-8 object-cover rounded border border-slate-100" alt={pr?.name} referrerPolicy="no-referrer" />
                            <div className="flex-1">
                              <span className="font-semibold text-slate-800 line-clamp-1">{pr?.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold block">{vr?.name} x {item.quantity}</span>
                            </div>
                            <span className="font-bold text-slate-900 font-mono">₹{item.purchasePrice * item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col justify-end text-xs font-medium text-slate-600 gap-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100/50 md:max-w-xs md:ml-auto w-full">
                      <div className="flex justify-between items-center">
                        <span>Items Subtotal</span>
                        <span className="font-bold text-slate-800 font-mono">₹{ord.subtotal}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span>Taxes & Packet</span>
                        <span className="font-bold text-slate-800 font-mono">₹{ord.tax}</span>
                      </div>
                      {ord.discount > 0 && (
                        <div className="flex justify-between items-center text-rose-600 font-bold text-[11px]">
                          <span>Discount coupon save</span>
                          <span className="font-mono">-₹{ord.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                        <span>Grand Bill Paid</span>
                        <span className="text-teal-800 font-mono">₹{ord.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* HIGH-FIDELITY TRACKING TIMELINE BLOCK */}
                  <div className="pt-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5 flex items-center gap-1">
                      🚦 Real-Time Logistics Timeline Tracking
                    </h4>
                    
                    {/* Linear timeline nodes dots */}
                    <div className="flex items-start md:flex-row flex-col gap-4 justify-between w-full relative">
                      {[
                        { stepStatus: 'Pending', label: 'Ordered', desc: 'Invoice generated' },
                        { stepStatus: 'Confirmed', label: 'Confirmed', desc: 'Acceptance by hub' },
                        { stepStatus: 'Packed', label: 'Packed', desc: 'Sanitized packing' },
                        { stepStatus: 'Shipped', label: 'Shipped', desc: 'Departed central hub' },
                        { stepStatus: 'Out For Delivery', label: 'Out for Delivery', desc: 'Rider departing' },
                        { stepStatus: 'Delivered', label: 'Delivered', desc: 'Handed safely' }
                      ].map((tlNode, index) => {
                        const statusWeights: Record<OrderStatus, number> = {
                          'Cancelled': 0, 'Pending': 1, 'Confirmed': 2, 'Packed': 3, 'Shipped': 4,
                          'Out For Delivery': 5, 'Delivered': 6, 'Returned': 7, 'Completed': 8
                        };

                        const currentWeight = statusWeights[ord.status];
                        const checkedWeight = statusWeights[tlNode.stepStatus as OrderStatus];
                        
                        const isAchieved = currentWeight >= checkedWeight;
                        const isCurrentActive = ord.status === tlNode.stepStatus;

                        return (
                          <div key={index} className="flex md:flex-col items-center gap-2.5 text-left md:text-center flex-1 relative z-10 w-full md:w-auto">
                            <div className="flex items-center">
                              {/* Glowing state dot */}
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center border font-mono font-black text-[10px] transition-all ${
                                isAchieved
                                  ? isCurrentActive
                                    ? 'bg-amber-400 text-slate-950 border-amber-400 ring-4 ring-amber-500/20'
                                    : 'bg-teal-600 text-white border-teal-600'
                                  : 'bg-slate-50 text-slate-300 border-slate-200'
                              }`}>
                                {isAchieved && !isCurrentActive ? '✓' : index + 1}
                              </div>
                            </div>

                            <div className="flex flex-col text-xs leading-tight">
                              <span className={`font-bold ${isAchieved ? 'text-slate-900' : 'text-slate-400'}`}>
                                {tlNode.label}
                              </span>
                              <span className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">
                                {tlNode.desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Latest milestone note */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80 mt-4 text-[11px] font-semibold text-slate-700 flex items-start gap-1.5 leading-relaxed">
                      <Clock size={14} className="text-teal-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500">Latest Event Note:</span> {ord.timeline[ord.timeline.length - 1]?.note}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: RETURNS CLAIMS MONITOR */}
        {activeTab === 'returns' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {returns.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center flex flex-col items-center">
                <RefreshCw size={40} className="text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-800 mb-1">No claims in progress</h3>
                <p className="text-xs text-slate-500 max-w-[280px]">If you encounter damaged or incorrect essentials, you can file return requests here.</p>
              </div>
            ) : (
              returns.map((ret) => {
                const targetPr = products.find(p => p.id === ret.productId);
                const targetVr = targetPr?.variants.find(v => v.id === ret.variantId);
                return (
                  <div key={ret.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 hover:shadow-sm">
                    <div className="h-14 w-14 rounded-lg bg-slate-50 flex items-center justify-center p-1 border border-slate-100 flex-shrink-0">
                      <img src={targetPr?.image} className="object-cover h-full w-full rounded" alt={targetPr?.name} referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                       <div className="flex justify-between items-start flex-wrap gap-2 text-xs font-semibold">
                        <div>
                          <span className="font-bold text-slate-900 font-mono">Claim: {ret.id}</span>
                          <span className="text-slate-400 font-bold font-mono text-[10px] block mt-0.5">Linked Order: {ret.orderId}</span>
                        </div>
                        <Badge variant={ret.status === 'Closed' ? 'success' : 'warning'}>
                          {ret.status}
                        </Badge>
                      </div>

                      <div className="text-xs">
                        <span className="font-semibold text-slate-700 block mt-1">Returned item: {targetPr?.name} ({targetVr?.name})</span>
                        <p className="text-slate-500 font-medium leading-relaxed mt-0.5">Reason: "{ret.reason}"</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500 font-bold">
                        <span>Refund Amount: <strong className="text-rose-600 text-xs font-black font-mono">₹{ret.refundAmount}</strong></span>
                        {ret.inventoryAction !== 'None' && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">Inv Action: {ret.inventoryAction}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
            {addresses.map((addr, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-xs leading-normal font-medium text-slate-600">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-1 bg-teal-50/50 p-2 rounded-lg border border-slate-100">
                  🏠 {index === 0 ? 'Primary Default' : 'Alternate'} Address
                </span>
                <p className="font-bold text-slate-800 text-sm mb-1">{addr.fullName}</p>
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} - {addr.zipCode}</p>
                <p className="text-slate-500 font-semibold mt-1">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: EDIT PROFILE INFO */}
        {activeTab === 'profile_edit' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-fadeIn max-w-md">
            <h3 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
              <User size={18} className="text-teal-600" /> Personal Profile Configuration
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Configure your delivery name and active mobile number. Your account email address is linked directly to your secure Google authentication profile and cannot be changed.
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1.5">Email Identity (Locked)</label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.email || ''}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-205/60 bg-slate-50 text-slate-400 rounded-xl cursor-not-allowed select-none outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="E.g. Shubham Yashraj"
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-200 bg-white text-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="E.g. +91 98765 43210"
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-200 bg-white text-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all"
                />
              </div>

              {saveIndicator && (
                <div className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${
                  saveIndicator.includes("failed") || saveIndicator.includes("required")
                    ? 'text-rose-600 bg-rose-50 border-rose-100'
                    : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                }`}>
                  {saveIndicator.includes("failed") || saveIndicator.includes("required") ? '⚠️' : '✓'} {saveIndicator}
                </div>
              )}

              <div className="pt-2">
                <Button
                  size="sm"
                  onClick={async () => {
                    if (!profileName.trim()) {
                      setSaveIndicator("Name field is required!");
                      return;
                    }
                    try {
                      await updateUserProfile({
                        name: profileName,
                        phone: profilePhone
                      });
                      setSaveIndicator("Profile updated successfully on secure Firestore!");
                      setTimeout(() => setSaveIndicator(''), 3500);
                    } catch (err) {
                      setSaveIndicator("Profile updates failed. Try again.");
                      setTimeout(() => setSaveIndicator(''), 3500);
                    }
                  }}
                >
                  Save Profile Settings
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
export { CustomerDashboard as default };
export { CustomerDashboard as CustomerWorkspace };
