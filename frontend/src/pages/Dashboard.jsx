import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState({ value: '', date_played: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const res = await api.get('/scores/');
      setScores(res.data);
    } catch {
      toast.error('Could not load scores');
    }
  };

  const handleAddScore = async () => {
    if (!newScore.value || !newScore.date_played) {
      toast.error('Please fill in both score and date');
      return;
    }
    setLoading(true);
    try {
      await api.post('/scores/', {
        value: parseInt(newScore.value),
        date_played: newScore.date_played,
      });
      toast.success('Score added!');
      setNewScore({ value: '', date_played: '' });
      fetchScores();
    } catch (err) {
      const msg = err.response?.data;
      if (msg?.non_field_errors) toast.error('You already have a score for this date');
      else toast.error('Failed to add score');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScore = async (id) => {
    try {
      await api.delete(`/scores/${id}/`);
      toast.success('Score deleted');
      fetchScores();
    } catch {
      toast.error('Failed to delete score');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabStyle = (tab) => ({
    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
    border: 'none', fontWeight: 600, fontSize: '14px',
    background: activeTab === tab ? '#00e5a0' : 'transparent',
    color: activeTab === tab ? '#000' : '#7a7a9a',
  });

  const cardStyle = {
    background: '#12121a', border: '1px solid #2a2a3a',
    borderRadius: '16px', padding: '1.5rem',
  };

  const navLinkStyle = {
    color: '#7a7a9a', fontSize: '14px',
    cursor: 'pointer', textDecoration: 'none'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f0f0f8' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2rem', borderBottom: '1px solid #1a1a2e',
        background: '#0a0a0fee', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#00e5a0', cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          ⛳ FairwayFund
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span onClick={() => navigate('/charities')} style={navLinkStyle}>Charities</span>
          <span onClick={() => navigate('/draws')} style={navLinkStyle}>Draws</span>
          <span onClick={() => navigate('/winnings')} style={navLinkStyle}>Winnings</span>
          <span onClick={() => navigate('/subscribe')} style={navLinkStyle}>Subscribe</span>
          <span style={{ color: '#7a7a9a', fontSize: '14px' }}>
            👋 {user?.first_name || user?.username}
          </span>
          <button onClick={handleLogout} style={{
            background: 'transparent', border: '1px solid #2a2a3a',
            color: '#f0f0f8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer'
          }}>
            Log Out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>

        {/* Welcome */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            Welcome back, {user?.first_name || user?.username}! 👋
          </h1>
          <p style={{ color: '#7a7a9a', marginTop: '0.5rem' }}>
            Here is your golf platform dashboard
          </p>
        </div>

        {/* Status Cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem', marginBottom: '2rem'
        }}>
          <div style={{
            ...cardStyle,
            borderColor: user?.is_subscribed ? '#00e5a040' : '#ff444440',
            cursor: 'pointer'
          }} onClick={() => navigate('/subscribe')}>
            <div style={{ fontSize: '12px', color: '#7a7a9a', marginBottom: '8px' }}>SUBSCRIPTION</div>
            <div style={{
              fontSize: '1.1rem', fontWeight: 700,
              color: user?.is_subscribed ? '#00e5a0' : '#ff4444'
            }}>
              {user?.is_subscribed ? '✅ Active' : '❌ Inactive'}
            </div>
            <div style={{ fontSize: '12px', color: '#7a7a9a', marginTop: '4px' }}>
              {user?.subscription_plan || 'Click to subscribe'}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: '12px', color: '#7a7a9a', marginBottom: '8px' }}>SCORES LOGGED</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00e5a0' }}>
              {scores.length}<span style={{ fontSize: '1rem', color: '#7a7a9a' }}>/5</span>
            </div>
            <div style={{ fontSize: '12px', color: '#7a7a9a', marginTop: '4px' }}>
              Rolling last 5 scores
            </div>
          </div>

          <div style={{ ...cardStyle, cursor: 'pointer' }} onClick={() => navigate('/charities')}>
            <div style={{ fontSize: '12px', color: '#7a7a9a', marginBottom: '8px' }}>CHARITY</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f5c842' }}>
              {user?.charity_percentage || 10}%
            </div>
            <div style={{ fontSize: '12px', color: '#7a7a9a', marginTop: '4px' }}>
              {user?.selected_charity?.name || 'Click to select'}
            </div>
          </div>

          <div style={{ ...cardStyle, cursor: 'pointer' }} onClick={() => navigate('/draws')}>
            <div style={{ fontSize: '12px', color: '#7a7a9a', marginBottom: '8px' }}>NEXT DRAW</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0f0f8' }}>
              June 2026
            </div>
            <div style={{ fontSize: '12px', color: '#7a7a9a', marginTop: '4px' }}>
              Click to view draws
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
          <button style={tabStyle('scores')} onClick={() => setActiveTab('scores')}>My Scores</button>
          <button style={tabStyle('draws')} onClick={() => setActiveTab('draws')}>Draws</button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={cardStyle}>
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>📊 Your Scores</h3>
              {scores.length === 0 ? (
                <p style={{ color: '#7a7a9a', fontSize: '14px' }}>No scores yet. Add your first score!</p>
              ) : (
                scores.map(s => (
                  <div key={s.id} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '8px 0', borderBottom: '1px solid #1a1a2e'
                  }}>
                    <span style={{ color: '#7a7a9a', fontSize: '14px' }}>{s.date_played}</span>
                    <span style={{ fontWeight: 700, color: '#00e5a0' }}>{s.value} pts</span>
                  </div>
                ))
              )}
            </div>

            <div style={cardStyle}>
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>🏆 Prize Pool</h3>
              {[
                { label: '5-Number Match', pool: '£5,040', share: '40%', color: '#f5c842' },
                { label: '4-Number Match', pool: '£4,410', share: '35%', color: '#00e5a0' },
                { label: '3-Number Match', pool: '£3,150', share: '25%', color: '#7a7a9a' },
              ].map(t => (
                <div key={t.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: '1px solid #1a1a2e'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{t.label}</div>
                    <div style={{ fontSize: '12px', color: '#7a7a9a' }}>{t.share} of pool</div>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: t.color }}>{t.pool}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scores Tab */}
        {activeTab === 'scores' && (
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>⛳ Manage Your Scores</h3>
            <div style={{
              background: '#1a1a26', borderRadius: '12px', padding: '1.5rem',
              marginBottom: '1.5rem', border: '1px solid #2a2a3a'
            }}>
              <h4 style={{ marginBottom: '1rem', color: '#00e5a0' }}>Add New Score</h4>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ display: 'block', color: '#7a7a9a', fontSize: '13px', marginBottom: '6px' }}>
                    Score (1-45)
                  </label>
                  <input
                    type='number' min='1' max='45' placeholder='e.g. 32'
                    value={newScore.value}
                    onChange={e => setNewScore({ ...newScore, value: e.target.value })}
                    style={{
                      width: '100%', background: '#0a0a0f', border: '1px solid #2a2a3a',
                      color: '#f0f0f8', padding: '10px 14px', borderRadius: '8px',
                      fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ flex: 2, minWidth: '160px' }}>
                  <label style={{ display: 'block', color: '#7a7a9a', fontSize: '13px', marginBottom: '6px' }}>
                    Date Played
                  </label>
                  <input
                    type='date'
                    value={newScore.date_played}
                    onChange={e => setNewScore({ ...newScore, date_played: e.target.value })}
                    style={{
                      width: '100%', background: '#0a0a0f', border: '1px solid #2a2a3a',
                      color: '#f0f0f8', padding: '10px 14px', borderRadius: '8px',
                      fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    onClick={handleAddScore} disabled={loading}
                    style={{
                      background: '#00e5a0', border: 'none', color: '#000',
                      padding: '10px 24px', borderRadius: '8px', fontWeight: 700,
                      cursor: 'pointer', fontSize: '14px'
                    }}
                  >
                    {loading ? 'Adding...' : '+ Add Score'}
                  </button>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#7a7a9a', marginTop: '8px' }}>
                Only your latest 5 scores are kept. Adding a 6th removes the oldest.
              </p>
            </div>

            {scores.length === 0 ? (
              <p style={{ color: '#7a7a9a', textAlign: 'center', padding: '2rem' }}>
                No scores yet. Add your first score above!
              </p>
            ) : (
              scores.map((s, i) => (
                <div key={s.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1rem', borderRadius: '10px', marginBottom: '0.5rem',
                  background: i === 0 ? '#00e5a010' : '#1a1a26',
                  border: '1px solid ' + (i === 0 ? '#00e5a040' : '#2a2a3a')
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: '#00e5a020', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: 800, color: '#00e5a0'
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{s.value} points</div>
                      <div style={{ fontSize: '13px', color: '#7a7a9a' }}>{s.date_played}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {i === 0 && (
                      <span style={{
                        fontSize: '11px', background: '#00e5a020', color: '#00e5a0',
                        padding: '4px 10px', borderRadius: '100px'
                      }}>Latest</span>
                    )}
                    <button
                      onClick={() => handleDeleteScore(s.id)}
                      style={{
                        background: 'transparent', border: '1px solid #ff444440',
                        color: '#ff4444', padding: '6px 14px', borderRadius: '8px',
                        cursor: 'pointer', fontSize: '13px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Draws Tab */}
        {activeTab === 'draws' && (
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>🎰 Monthly Draws</h3>
            <div style={{
              background: '#1a1a26', borderRadius: '12px', padding: '2rem',
              textAlign: 'center', border: '1px solid #2a2a3a'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎰</div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Next Draw: June 2026
              </h4>
              <p style={{ color: '#7a7a9a', fontSize: '14px', marginBottom: '1.5rem' }}>
                Make sure you have 5 scores logged to be eligible.
              </p>
              <div style={{
                display: 'inline-block',
                background: scores.length === 5 ? '#00e5a020' : '#ff444420',
                border: '1px solid ' + (scores.length === 5 ? '#00e5a040' : '#ff444440'),
                borderRadius: '10px', padding: '12px 24px',
                color: scores.length === 5 ? '#00e5a0' : '#ff4444',
                fontWeight: 700, marginBottom: '1.5rem'
              }}>
                {scores.length === 5
                  ? '✅ You are eligible for the next draw!'
                  : 'You need ' + (5 - scores.length) + ' more score(s) to be eligible'}
              </div>
              <br />
              <button
                onClick={() => navigate('/draws')}
                style={{
                  background: '#00e5a0', border: 'none', color: '#000',
                  padding: '12px 24px', borderRadius: '10px',
                  fontWeight: 700, cursor: 'pointer'
                }}
              >
                View All Draws
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}