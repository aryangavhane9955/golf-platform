import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Draws() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [draws, setDraws] = useState([]);
  const [myEntries, setMyEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('results');

  useEffect(() => {
    fetchDraws();
    fetchMyEntries();
  }, []);

  const fetchDraws = async () => {
    try {
      const res = await api.get('/draws/');
      setDraws(res.data);
    } catch {
      toast.error('Could not load draws');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEntries = async () => {
    try {
      const res = await api.get('/draws/my-entries/');
      setMyEntries(res.data);
    } catch {
      console.log('No entries yet');
    }
  };

  const tabStyle = (tab) => ({
    padding: '10px 24px', borderRadius: '8px',
    cursor: 'pointer', border: 'none',
    fontWeight: 600, fontSize: '14px',
    background: activeTab === tab ? '#00e5a0' : 'transparent',
    color: activeTab === tab ? '#000' : '#7a7a9a',
  });

  const cardStyle = {
    background: '#12121a',
    border: '1px solid #2a2a3a',
    borderRadius: '16px',
    padding: '2rem',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f0f0f8' }}>

      {/* Navbar */}
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
        <button onClick={() => navigate('/dashboard')} style={{
          background: '#00e5a0', border: 'none', color: '#000',
          padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700
        }}>
          Dashboard
        </button>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-block', background: '#00e5a015',
            border: '1px solid #00e5a040', borderRadius: '100px',
            padding: '6px 16px', fontSize: '13px', color: '#00e5a0', marginBottom: '1rem'
          }}>
            MONTHLY DRAWS
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>
            Draw Results
          </h1>
          <p style={{ color: '#7a7a9a', fontSize: '1.1rem' }}>
            Match 3, 4, or 5 of your scores to the winning numbers to win!
          </p>
        </div>

        {/* How matching works */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem', marginBottom: '3rem'
        }}>
          {[
            { match: '5 Numbers', prize: '40% of pool', color: '#f5c842', icon: '🏆' },
            { match: '4 Numbers', prize: '35% of pool', color: '#00e5a0', icon: '🥈' },
            { match: '3 Numbers', prize: '25% of pool', color: '#7a7a9a', icon: '🥉' },
          ].map(tier => (
            <div key={tier.match} style={{
              ...cardStyle,
              textAlign: 'center',
              borderColor: tier.color + '40'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{tier.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: tier.color }}>
                {tier.match}
              </div>
              <div style={{ color: '#7a7a9a', fontSize: '13px', marginTop: '4px' }}>
                {tier.prize}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <button style={tabStyle('results')} onClick={() => setActiveTab('results')}>
            Draw Results
          </button>
          <button style={tabStyle('my-entries')} onClick={() => setActiveTab('my-entries')}>
            My Entries
          </button>
        </div>

        {/* Draw Results Tab */}
        {activeTab === 'results' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', color: '#7a7a9a', padding: '4rem' }}>
                Loading draws...
              </div>
            ) : draws.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: '4rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎰</div>
                <h3 style={{ marginBottom: '0.5rem' }}>No draws published yet</h3>
                <p style={{ color: '#7a7a9a', fontSize: '14px' }}>
                  Check back after the monthly draw is run by admin.
                </p>
              </div>
            ) : (
              draws.map(draw => (
                <div key={draw.id} style={{ ...cardStyle, marginBottom: '1.5rem' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '1.5rem'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                        {new Date(draw.month).toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </h3>
                      <div style={{ color: '#7a7a9a', fontSize: '13px', marginTop: '4px' }}>
                        {draw.entries_count} players entered · {draw.winners_count} winners
                      </div>
                    </div>
                    <div style={{
                      background: '#00e5a020', color: '#00e5a0',
                      padding: '6px 16px', borderRadius: '100px',
                      fontSize: '12px', fontWeight: 700
                    }}>
                      PUBLISHED
                    </div>
                  </div>

                  {/* Winning numbers */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ color: '#7a7a9a', fontSize: '13px', marginBottom: '0.5rem' }}>
                      WINNING NUMBERS
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {draw.winning_numbers.map((num, i) => (
                        <div key={i} style={{
                          width: '48px', height: '48px', borderRadius: '50%',
                          background: '#f5c84220', border: '2px solid #f5c84260',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '1.1rem', color: '#f5c842'
                        }}>
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* My Entries Tab */}
        {activeTab === 'my-entries' && (
          <div>
            {myEntries.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: '4rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                <h3 style={{ marginBottom: '0.5rem' }}>No entries yet</h3>
                <p style={{ color: '#7a7a9a', fontSize: '14px', marginBottom: '1.5rem' }}>
                  Make sure you have 5 scores logged and an active subscription to enter draws.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    background: '#00e5a0', border: 'none', color: '#000',
                    padding: '12px 24px', borderRadius: '10px',
                    fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Add Scores
                </button>
              </div>
            ) : (
              myEntries.map((entry, i) => (
                <div key={i} style={{
                  ...cardStyle,
                  marginBottom: '1rem',
                  borderColor: entry.is_winner ? '#00e5a040' : '#2a2a3a'
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '1rem'
                  }}>
                    <h3 style={{ fontWeight: 700 }}>
                      {new Date(entry.draw_month).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    {entry.is_winner ? (
                      <div style={{
                        background: '#00e5a020', color: '#00e5a0',
                        padding: '6px 16px', borderRadius: '100px',
                        fontSize: '12px', fontWeight: 700
                      }}>
                        WINNER! 🏆
                      </div>
                    ) : (
                      <div style={{
                        background: '#2a2a3a', color: '#7a7a9a',
                        padding: '6px 16px', borderRadius: '100px',
                        fontSize: '12px', fontWeight: 700
                      }}>
                        {entry.matched_count} matched
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ color: '#7a7a9a', fontSize: '12px', marginBottom: '6px' }}>
                        YOUR SCORES
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {entry.my_scores.map((score, j) => (
                          <div key={j} style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: entry.winning_numbers.includes(score) ? '#00e5a020' : '#1a1a26',
                            border: entry.winning_numbers.includes(score) ? '2px solid #00e5a0' : '2px solid #2a2a3a',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '14px',
                            color: entry.winning_numbers.includes(score) ? '#00e5a0' : '#f0f0f8'
                          }}>
                            {score}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: '#7a7a9a', fontSize: '12px', marginBottom: '6px' }}>
                        WINNING NUMBERS
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {entry.winning_numbers.map((num, j) => (
                          <div key={j} style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: '#f5c84220',
                            border: '2px solid #f5c84260',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '14px', color: '#f5c842'
                          }}>
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}