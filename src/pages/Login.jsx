// import React, { useState } from 'react';
// import api from '../services/api';



// function Login({ onLogin, onSwitchPage }) {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       const response = await api.auth.login(formData);
//       if (response.user) {
//         onLogin(response.token, response.user.year, response.user.name);
//       } else {
//         setError(response.message || 'Login failed');
//       }
//     } catch (err) {
//       setError('Login failed. Please try again.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2>Welcome Back 👋</h2>
//         <p className="auth-subtitle">Sign in to your Campus Aid account</p>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//           <button type="submit" disabled={loading} className="auth-btn">
//             {loading ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>
//         {error && <p className="error">{error}</p>}
//         <p className="auth-link">
//           Don't have an account? <a onClick={() => onSwitchPage('register')}>Create one here</a>
//         </p>
//       </div>
//     </div>
//   );
// }
// export default Login;


import React, { useState } from 'react';
import api from '../services/api';

function Login({ onLogin, onSwitchPage }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // enforce domain on client side too
    if (!formData.email.toLowerCase().endsWith('@somaiya.edu')) {
      setError('Email must be a @somaiya.edu address');
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.login(formData);
      if (response.user) {
        onLogin(response.token, response.user.name, response.user.role);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p className="auth-subtitle">Sign in to your Campus Aid account</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="auth-link">
          <a onClick={() => onSwitchPage('forgotpassword')}>Forgot Password?</a>
        </p>
        {/* registration disabled; no link shown */}
      </div>
    </div>
  );
}

export default Login;