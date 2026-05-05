import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Winnings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [winnings, setWinnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    fetchWinnings();
  }, []);

  const fetchWinnings = async () => {
    try {
      const res = await api.get('/prizes/my-winnings/');
      setWinnings(res.data);
    } catch {
      toast.error('Could not load winnings');
    } finally {
      setLoading(false);
    }
  };

  const handleProofUpload = async (winnerId, file) => {
    if (!file) return;
    setUploading(winnerId);
    const formData = new FormData();
    formData.append('winner_id', winnerId);
    formData.append('proof_screenshot', file);
    try {
      await api.post('/prizes/submit-proof/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Proof submitted successfully!');
      fetchWinnings();
    } catch {
      toast.error('Failed to submit proof');
    } finally {
      setUploading(null);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'approved': return '#00e5a0';
      case 'paid': return '#f5c842';
      case 'rejected': return '#ff4444';
      default: return '#7a7a9a';
    }
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅';
      case 'paid': return '💰';
      case 'rejected': return '❌';
      default: return '⏳';
    }
  };

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

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-block', background: '#f5c84215',
            border: '1px solid #f5c84240', borderRadius: '100px',
            padding: '6px 16px', fontSize: '13px', color: '#f5c842', marginBottom: '1rem'
          }}>
            MY WINNINGS
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>
            Prize History
          </h1>
          <p style={{ color: '#7a7a9a', fontSize: '1.1rem' }}>
            Track your winnings and submit proof to claim your prizes.
          </p>
        </div>

        {/* How to claim */}
        <div style={{ ...cardStyle, marginBottom: '2rem', background: '#0f1f17', borderColor: '#00e5a030' }}>
          <h3 style={{ color: '#00e5a0', marginBottom: '1rem', fontWeight: 700 }}>
            How to Claim Your Prize
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { step: '1', text: 'Win a draw by matching 3, 4, or 5 numbers' },
              { step: '2', text: 'Upload a screenshot of your golf scores as proof' },
              { step: '3', text: 'Admin reviews and approves your submission' },
              { step: '4', text: 'Prize is paid out to your account' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#00e5a020', border: '1px solid #00e5a040',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, color: '#00e5a0', flexShrink: 0
                }}>
                  {item.step}
                </div>
                <p style={{ color: '#7a7a9a', fontSize: '13px', lineHeight: 1.5 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Winnings list */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#7a7a9a', padding: '4rem' }}>
            Loading winnings...
          </div>
        ) : winnings.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No winnings yet</h3>
            <p style={{ color: '#7a7a9a', fontSize: '14px', marginBottom: '1.5rem' }}>
              Keep playing and entering draws — your win is coming!
            </p>
            <button
              onClick={() => navigate('/draws')}
              style={{
                background: '#00e5a0', border: 'none', color: '#000',
                padding: '12px 24px', borderRadius: '10px',
                fontWeight: 700, cursor: 'pointer'
              }}
            >
              View Draws
            </button>
          </div>
        ) : (
          winnings.map(winning => (
            <div key={winning.id} style={{
              ...cardStyle,
              marginBottom: '1.5rem',
              borderColor: statusColor(winning.payment_status) + '40'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '1.5rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    {new Date(winning.draw_month).toLocaleString('default', {
                      month: 'long', year: 'numeric'
                    })} Draw
                  </h3>
                  <p style={{ color: '#7a7a9a', fontSize: '13px', marginTop: '4px' }}>
                    {winning.matched_count} numbers matched
                  </p>
                </div>
                <div style={{
                  background: statusColor(winning.payment_status) + '20',
                  color: statusColor(winning.payment_status),
                  padding: '6px 16px', borderRadius: '100px',
                  fontSize: '12px', fontWeight: 700
                }}>
                  {statusIcon(winning.payment_status)} {winning.payment_status.toUpperCase()}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem', marginBottom: '1.5rem'
              }}>
                <div style={{ background: '#1a1a26', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '12px', color: '#7a7a9a', marginBottom: '4px' }}>PRIZE AMOUNT</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f5c842' }}>
                    £{winning.prize_amount}
                  </div>
                </div>
                <div style={{ background: '#1a1a26', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '12px', color: '#7a7a9a', marginBottom: '4px' }}>SUBMITTED</div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>
                    {new Date(winning.submitted_at).toLocaleDateString()}
                  </div>
                </div>
                {winning.verified_at && (
                  <div style={{ background: '#1a1a26', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ fontSize: '12px', color: '#7a7a9a', marginBottom: '4px' }}>VERIFIED</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>
                      {new Date(winning.verified_at).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              {winning.notes && (
                <div style={{
                  background: '#1a1a26', borderRadius: '10px', padding: '1rem',
                  marginBottom: '1rem', fontSize: '13px', color: '#7a7a9a'
                }}>
                  <strong style={{ color: '#f0f0f8' }}>Admin note: </strong>{winning.notes}
                </div>
              )}

              {/* Upload proof */}
              {winning.payment_status === 'pending' && !winning.proof_screenshot && (
                <div>
                  <p style={{ color: '#7a7a9a', fontSize: '13px', marginBottom: '8px' }}>
                    Upload a screenshot of your scores to claim your prize:
                  </p>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={e => handleProofUpload(winning.id, e.target.files[0])}
                    disabled={uploading === winning.id}
                    style={{
                      background: '#1a1a26', border: '1px solid #2a2a3a',
                      borderRadius: '8px', padding: '8px', color: '#f0f0f8',
                      fontSize: '13px', cursor: 'pointer', width: '100%'
                    }}
                  />
                  {uploading === winning.id && (
                    <p style={{ color: '#00e5a0', fontSize: '13px', marginTop: '8px' }}>
                      Uploading...
                    </p>
                  )}
                </div>
              )}

              {winning.proof_screenshot && (
                <div style={{
                  background: '#00e5a010', border: '1px solid #00e5a030',
                  borderRadius: '10px', padding: '12px',
                  fontSize: '13px', color: '#00e5a0'
                }}>
                  ✅ Proof submitted — awaiting admin review
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}