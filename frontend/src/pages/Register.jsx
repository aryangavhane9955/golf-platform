import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', username: '', first_name: '', last_name: '', password: '', confirm_password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register/', {
        email: form.email,
        username: form.username,
        first_name: form.first_name,
        last_name: form.last_name,
        password: form.password,
      });
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data;
      if (msg?.email) toast.error('Email already exists');
      else if (msg?.username) toast.error('Username already taken');
      else toast.error('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#1a1a26', border: '1px solid #2a2a3a',
    color: '#f0f0f8', padding: '12px 16px', borderRadius: '10px',
    fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block', color: '#7a7a9a', fontSize: '14px', marginBottom: '6px'
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div style={{
        width: '100%', maxWidth: '460px', background: '#12121a',
        borderRadius: '20px', padding: '2.5rem', border: '1px solid #2a2a3a'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem' }}>⛳</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f0f0f8', marginTop: '0.5rem' }}>
            Create Account
          </h1>
          <p style={{ color: '#7a7a9a', marginTop: '0.5rem' }}>
            Join thousands of golfers giving back
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* First & Last name row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input
                type='text' placeholder='John' value={form.first_name}
                onChange={e => setForm({ ...form, first_name: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                type='text' placeholder='Smith' value={form.last_name}
                onChange={e => setForm({ ...form, last_name: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type='email' placeholder='you@example.com' value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Username</label>
            <input
              type='text' placeholder='johngolfer' value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type='password' placeholder='Min. 8 characters' value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type='password' placeholder='Repeat password' value={form.confirm_password}
              onChange={e => setForm({ ...form, confirm_password: e.target.value })}
              style={inputStyle}
            />
          </div>

          {/* Charity note */}
          <div style={{
            background: '#00e5a010', border: '1px solid #00e5a030',
            borderRadius: '10px', padding: '12px 16px',
            color: '#00e5a0', fontSize: '13px', lineHeight: 1.5
          }}>
            ❤️ 10% of your subscription automatically goes to a charity of your choice.
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
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#7a7a9a', marginTop: '1.5rem', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to='/login' style={{ color: '#00e5a0', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}