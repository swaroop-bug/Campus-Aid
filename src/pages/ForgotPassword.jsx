// import { useState } from 'react';
// import api from '../services/api';

// export default function ForgotPassword({ onSwitchPage }) {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resetToken, setResetToken] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');
//     setLoading(true);

//     try {
//       const response = await api.password.forgot(email);
//       if (response.resetToken) {
//         setResetToken(response.resetToken);
//         setMessage('Reset token generated! Use it to reset your password.');
//       } else {
//         setError(response.message || 'Failed to send reset link');
//       }
//     } catch (err) {
//       setError('Failed to process request');
//     }
//     setLoading(false);
//   };

//   if (resetToken) {
//     return <ResetPassword token={resetToken} onSwitchPage={onSwitchPage} />;
//   }

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2>🔑 Forgot Password</h2>
//         <p className="auth-subtitle">Enter your email to reset password</p>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Email Address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <button type="submit" disabled={loading} className="auth-btn">
//             {loading ? 'Sending...' : 'Send Reset Link'}
//           </button>
//         </form>
//         {message && <p style={{color: 'green', marginTop: '1rem', textAlign: 'center'}}>{message}</p>}
//         {error && <p className="error">{error}</p>}
//         <p className="auth-link">
//           <a onClick={() => onSwitchPage('login')}>← Back to Login</a>
//         </p>
//       </div>
//     </div>
//   );
// }

// function ResetPassword({ token, onSwitchPage }) {
//   const [formData, setFormData] = useState({
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');

//     if (formData.newPassword !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await api.password.reset({
//         token,
//         newPassword: formData.newPassword
//       });

//       if (response.message) {
//         setMessage('Password reset successfully! Redirecting to login...');
//         setTimeout(() => onSwitchPage('login'), 2000);
//       } else {
//         setError(response.message || 'Password reset failed');
//       }
//     } catch (err) {
//       setError('Failed to reset password');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2>🔒 Reset Password</h2>
//         <p className="auth-subtitle">Enter your new password</p>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="password"
//             name="newPassword"
//             placeholder="New Password"
//             value={formData.newPassword}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm New Password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//           />
//           <button type="submit" disabled={loading} className="auth-btn">
//             {loading ? 'Resetting...' : 'Reset Password'}
//           </button>
//         </form>
//         {message && <p style={{color: 'green', marginTop: '1rem', textAlign: 'center'}}>{message}</p>}
//         {error && <p className="error">{error}</p>}
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import api from '../services/api';

export default function ForgotPassword({ onSwitchPage }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.password.forgot(email);
      if (response.message) {
        setMessage(response.message);
        setEmail('');
      } else {
        setError('Failed to send reset link');
      }
    } catch (err) {
      setError('Failed to process request');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔑 Forgot Password</h2>
        <p className="auth-subtitle">Enter your email to receive a password reset link</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        {message && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '1rem',
            borderRadius: '5px',
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
        {error && <p className="error">{error}</p>}
        <p className="auth-link">
          <a onClick={() => onSwitchPage('login')}>← Back to Login</a>
        </p>
      </div>
    </div>
  );
}