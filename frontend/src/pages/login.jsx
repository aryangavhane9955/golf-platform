import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', background: '#12121a',
        borderRadius: '20px', padding: '2.5rem', border: '1px solid #2a2a3a'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem' }}>⛳</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f0f0f8', marginTop: '0.5rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: '#7a7a9a', marginTop: '0.5rem' }}>Sign in to your account</p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', color: '#7a7a9a', fontSize: '14px', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type='email'
              placeholder='you@example.com'
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{
                width: '100%', background: '#1a1a26', border: '1px solid #2a2a3a',
                color: '#f0f0f8', padding: '12px 16px', borderRadius: '10px',
                fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#7a7a9a', fontSize: '14px', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type='password'
              placeholder='••••••••'
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{
                width: '100%', background: '#1a1a26', border: '1px solid #2a2a3a',
                color: '#f0f0f8', padding: '12px 16px', borderRadius: '10px',
                fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', background: loading ? '#007a55' : '#00e5a0',
              border: 'none', color: '#000', padding: '14px',
              borderRadius: '10px', fontSize: '1rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#7a7a9a', marginTop: '1.5rem', fontSize: '14px' }}>
          No account?{' '}
          <Link to='/register' style={{ color: '#00e5a0', textDecoration: 'none', fontWeight: 600 }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}