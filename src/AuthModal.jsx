import { useState } from 'react';
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  googleProvider,
  signInWithPopup,
  updateProfile
} from './firebase';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, user, onUserChange }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setError('');
    setSuccess('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getErrorMessage = (errorCode) => {
    console.log('Error code:', errorCode); // Debug log
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.';
      case 'auth/invalid-email':
        return 'Email không hợp lệ.';
      case 'auth/operation-not-allowed':
        return 'Phương thức đăng nhập này chưa được kích hoạt trong Firebase Console.';
      case 'auth/weak-password':
        return 'Mật khẩu quá yếu. Vui lòng dùng ít nhất 6 ký tự.';
      case 'auth/user-disabled':
        return 'Tài khoản này đã bị vô hiệu hóa.';
      case 'auth/user-not-found':
        return 'Không tìm thấy tài khoản với email này.';
      case 'auth/wrong-password':
        return 'Mật khẩu không chính xác.';
      case 'auth/invalid-credential':
        return 'Email hoặc mật khẩu không chính xác.';
      case 'auth/too-many-requests':
        return 'Quá nhiều lần thử. Vui lòng thử lại sau.';
      case 'auth/popup-closed-by-user':
        return 'Cửa sổ đăng nhập đã bị đóng.';
      case 'auth/popup-blocked':
        return 'Popup bị chặn. Vui lòng cho phép popup trong trình duyệt.';
      case 'auth/cancelled-popup-request':
        return 'Yêu cầu đăng nhập đã bị hủy.';
      case 'auth/network-request-failed':
        return 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.';
      case 'auth/internal-error':
        return 'Lỗi hệ thống. Vui lòng thử lại sau.';
      case 'auth/unauthorized-domain':
        return 'Domain này chưa được cấp phép trong Firebase. Vui lòng thêm domain vào Firebase Console.';
      case 'auth/configuration-not-found':
        return 'Cấu hình Firebase chưa đúng. Vui lòng kiểm tra lại.';
      default:
        return `Lỗi: ${errorCode || 'Không xác định'}. Vui lòng thử lại.`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp.');
        return;
      }
      if (password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Đăng nhập
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onUserChange(userCredential.user);
        setSuccess('Đăng nhập thành công!');
        setTimeout(() => handleClose(), 1500);
      } else {
        // Đăng ký
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Cập nhật tên hiển thị nếu có
        if (displayName) {
          await updateProfile(userCredential.user, {
            displayName: displayName
          });
        }
        
        onUserChange(userCredential.user);
        setSuccess('Đăng ký thành công!');
        setTimeout(() => handleClose(), 1500);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      onUserChange(result.user);
      setSuccess('Đăng nhập với Google thành công!');
      setTimeout(() => handleClose(), 1500);
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      onUserChange(null);
      setSuccess('Đã đăng xuất!');
      setTimeout(() => handleClose(), 1000);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Lỗi khi đăng xuất. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Nếu đã đăng nhập, hiển thị thông tin user
  if (user) {
    return (
      <div className="auth-overlay" onClick={handleClose}>
        <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
          <button className="auth-close-btn" onClick={handleClose}>✕</button>
          
          <div className="user-profile">
            <div className="user-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" />
              ) : (
                <span>{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <h3>Xin chào!</h3>
            <p className="user-name">{user.displayName || 'Người dùng'}</p>
            <p className="user-email">{user.email}</p>
            
            {success && <div className="auth-success">{success}</div>}
            {error && <div className="auth-error">{error}</div>}
            
            <button 
              className="logout-btn" 
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đăng xuất'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={handleClose}>✕</button>
        
        <div className="auth-header">
          <h2>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
          <p>{isLogin ? 'Chào mừng bạn trở lại!' : 'Tạo tài khoản mới'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="displayName">Tên hiển thị</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nhập tên của bạn"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                required
                disabled={loading}
              />
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
          </button>
        </form>

        <div className="auth-divider">
          <span>hoặc</span>
        </div>

        <button 
          type="button" 
          className="google-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Đăng nhập với Google
        </button>

        <div className="auth-switch">
          {isLogin ? (
            <p>Chưa có tài khoản? <button type="button" onClick={switchMode}>Đăng ký</button></p>
          ) : (
            <p>Đã có tài khoản? <button type="button" onClick={switchMode}>Đăng nhập</button></p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
