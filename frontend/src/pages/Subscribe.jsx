import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Subscribe() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (plan) => {
    if (!user) { navigate('/register'); return; }
    setLoading(plan);
    try {
      const res = await api.post('/payments/create-checkout/', { plan });
      window.location.href = res.data.url;
    } catch {
      toast.error('Could not start checkout. Check Stripe keys in .env');
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '£9.99',
      period: 'per month',
      features: [
        'Enter monthly prize draws',
        '10% goes to your charity',
        'Score tracking dashboard',
        'Cancel anytime',
      ],
      color: '#00e5a0',
      popular: false,
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '£99.99',
      period: 'per year',
      savings: 'Save £19.89',
      features: [
        'Everything in Monthly',
        '2 months free',
        'Priority draw entry',
        'Exclusive yearly badge',
      ],
      color: '#f5c842',
      popular: true,
    },
  ];

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
        {user && (
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'transparent', border: '1px solid #2a2a3a',
            color: '#f0f0f8', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer'
          }}>
            Dashboard
          </button>
        )}
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-block', background: '#00e5a015',
            border: '1px solid #00e5a040', borderRadius: '100px',
            padding: '6px 16px', fontSize: '13px', color: '#00e5a0', marginBottom: '1rem'
          }}>
            SIMPLE PRICING
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>
            Choose Your Plan
          </h1>
          <p style={{ color: '#7a7a9a', fontSize: '1.1rem' }}>
            Play golf, win prizes, and give back to charity — all in one subscription.
          </p>
        </div>

        {/* Plans */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem', marginBottom: '3rem'
        }}>
          {plans.map(plan => (
            <div key={plan.id} style={{
              background: '#12121a',
              border: `2px solid ${plan.popular ? plan.color + '60' : '#2a2a3a'}`,
              borderRadius: '20px', padding: '2.5rem',
              position: 'relative',
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%',
                  transform: 'translateX(-50%)',
                  background: plan.color, color: '#000',
                  padding: '4px 20px', borderRadius: '100px',
                  fontSize: '12px', fontWeight: 700
                }}>
                  MOST POPULAR
                </div>
              )}

              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {plan.name}
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{
                  fontSize: '3rem', fontWeight: 900, color: plan.color
                }}>
                  {plan.price}
                </span>
                <span style={{ color: '#7a7a9a', marginLeft: '8px' }}>
                  {plan.period}
                </span>
                {plan.savings && (
                  <div style={{
                    display: 'inline-block', background: plan.color + '20',
                    color: plan.color, fontSize: '12px', padding: '3px 10px',
                    borderRadius: '100px', marginLeft: '8px', fontWeight: 700
                  }}>
                    {plan.savings}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '2rem' }}>
                {plan.features.map((feature, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    marginBottom: '12px', fontSize: '14px', color: '#c0c0d0'
                  }}>
                    <span style={{ color: plan.color, fontWeight: 700 }}>✓</span>
                    {feature}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                style={{
                  width: '100%',
                  background: loading === plan.id ? '#333' : plan.color,
                  border: 'none',
                  color: plan.popular ? '#000' : '#000',
                  padding: '14px', borderRadius: '12px',
                  fontSize: '1rem', fontWeight: 700,
                  cursor: loading === plan.id ? 'not-allowed' : 'pointer'
                }}
              >
                {loading === plan.id ? 'Redirecting...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '2rem',
          flexWrap: 'wrap', color: '#7a7a9a', fontSize: '13px'
        }}>
          <span>🔒 Secure payments via Stripe</span>
          <span>❌ Cancel anytime</span>
          <span>❤️ 10% to charity</span>
          <span>🏆 Monthly prize draws</span>
        </div>
      </div>
    </div>
  );
}