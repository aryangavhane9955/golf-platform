import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Charities() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(null);
  const [percentage, setPercentage] = useState(10);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const res = await api.get('/charities/');
      setCharities(res.data);
    } catch {
      toast.error('Could not load charities');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (charityId) => {
    if (!user) { navigate('/login'); return; }
    setSelecting(charityId);
    try {
      await api.post('/charities/select/', {
        charity_id: charityId,
        percentage: percentage,
      });
      toast.success('Charity selected!');
    } catch {
      toast.error('Failed to select charity');
    } finally {
      setSelecting(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f0f0f8' }}>

      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2rem', borderBottom: '1px solid #1a1a2e',
        background: '#0a0a0fee', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div
          onClick={() => navigate('/')}
          style={{ fontSize: '1.4rem', fontWeight: 700, color: '#00e5a0', cursor: 'pointer' }}
        >
          FairwayFund
        </div>
        <div>
          {user ? (
            <button onClick={() => navigate('/dashboard')} style={{
              background: '#00e5a0', border: 'none', color: '#000',
              padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700
            }}>Dashboard</button>
          ) : (
            <button onClick={() => navigate('/login')} style={{
              background: '#00e5a0', border: 'none', color: '#000',
              padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700
            }}>Login</button>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-block', background: '#00e5a015',
            border: '1px solid #00e5a040', borderRadius: '100px',
            padding: '6px 16px', fontSize: '13px', color: '#00e5a0',
            marginBottom: '1rem'
          }}>
            GIVING BACK
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>
            Choose Your Charity
          </h1>
          <p style={{ color: '#7a7a9a', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
            A portion of every subscription goes directly to your chosen charity every month.
          </p>
        </div>

        {user && (
          <div style={{
            background: '#12121a', border: '1px solid #2a2a3a',
            borderRadius: '16px', padding: '2rem', marginBottom: '2rem', textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>
              Your Contribution: <span style={{ color: '#f5c842' }}>{percentage}%</span>
            </h3>
            <input
              type='range' min='10' max='50' value={percentage}
              onChange={e => setPercentage(parseInt(e.target.value))}
              style={{ width: '100%', maxWidth: '400px', accentColor: '#00e5a0' }}
            />
            <p style={{ color: '#7a7a9a', fontSize: '13px', marginTop: '8px' }}>
              Minimum 10% — slide to increase your impact
            </p>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', color: '#7a7a9a', padding: '4rem' }}>
            Loading charities...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {charities.map(charity => (
              <div key={charity.id} style={{
                background: '#12121a',
                border: charity.is_featured ? '1px solid #f5c84240' : '1px solid #2a2a3a',
                borderRadius: '16px', padding: '2rem',
              }}>
                {charity.is_featured && (
                  <div style={{
                    display: 'inline-block', background: '#f5c84220',
                    color: '#f5c842', fontSize: '11px', padding: '4px 12px',
                    borderRadius: '100px', marginBottom: '1rem'
                  }}>
                    FEATURED
                  </div>
                )}

                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: '#00e5a020', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.8rem', marginBottom: '1rem'
                }}>
                  ❤️
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {charity.name}
                </h3>

                <p style={{ color: '#7a7a9a', fontSize: '14px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {charity.description}
                </p>

                {user ? (
                  <button
                    onClick={() => handleSelect(charity.id)}
                    disabled={selecting === charity.id}
                    style={{
                      width: '100%',
                      background: selecting === charity.id ? '#007a55' : '#00e5a0',
                      border: 'none', color: '#000', padding: '12px',
                      borderRadius: '10px', fontWeight: 700,
                      cursor: 'pointer', fontSize: '14px'
                    }}
                  >
                    {selecting === charity.id ? 'Selecting...' : 'Support with ' + percentage + '%'}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/register')}
                    style={{
                      width: '100%', background: 'transparent',
                      border: '1px solid #00e5a0', color: '#00e5a0', padding: '12px',
                      borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '14px'
                    }}
                  >
                    Sign up to support
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}