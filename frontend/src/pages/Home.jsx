import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f0f0f8' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2rem', borderBottom: '1px solid #1a1a2e',
        background: '#0a0a0fee', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#00e5a0' }}>
          ⛳ FairwayFund
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span
            onClick={() => navigate('/charities')}
            style={{ color: '#7a7a9a', fontSize: '14px', cursor: 'pointer' }}
          >Charities</span>
          <span
            onClick={() => navigate('/subscribe')}
            style={{ color: '#7a7a9a', fontSize: '14px', cursor: 'pointer' }}
          >Pricing</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'transparent', border: '1px solid #2a2a3a',
            color: '#f0f0f8', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer'
          }}>Log In</button>
          <button onClick={() => navigate('/register')} style={{
            background: '#00e5a0', border: 'none', color: '#000',
            padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700
          }}>Subscribe</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '90vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '4rem 2rem'
      }}>
        <div style={{
          background: '#00e5a015', border: '1px solid #00e5a040',
          borderRadius: '100px', padding: '6px 16px',
          fontSize: '13px', color: '#00e5a0', marginBottom: '2rem', letterSpacing: 1
        }}>
          ✦ GOLF MEETS GIVING BACK
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 96px)', fontWeight: 900,
          lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-1px'
        }}>
          PLAY YOUR <span style={{ color: '#00e5a0' }}>SCORES.</span><br />
          WIN BIG. <span style={{ color: '#f5c842' }}>GIVE BACK.</span>
        </h1>

        <p style={{
          fontSize: '1.1rem', color: '#7a7a9a', maxWidth: '520px',
          lineHeight: 1.7, marginBottom: '2.5rem'
        }}>
          Every month, your Stableford scores become your lottery numbers.
          Match 3, 4, or 5 to win cash prizes while supporting the charity you believe in.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navigate('/register')} style={{
            background: '#00e5a0', border: 'none', color: '#000',
            padding: '16px 40px', borderRadius: '12px', fontSize: '1rem',
            fontWeight: 700, cursor: 'pointer'
          }}>
            Start for £9.99 / month →
          </button>
          <button onClick={() => navigate('/login')} style={{
            background: 'transparent', border: '1px solid #2a2a3a',
            color: '#f0f0f8', padding: '16px 40px', borderRadius: '12px',
            fontSize: '1rem', cursor: 'pointer'
          }}>
            Log In
          </button>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '13px', color: '#7a7a9a' }}>
          Cancel anytime · No hidden fees · 10% goes to charity
        </p>
      </section>

      {/* Stats */}
      <section style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem', padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto',
        borderTop: '1px solid #1a1a2e'
      }}>
        {[
          { value: '2,841', label: 'Active Players' },
          { value: '£48,200', label: 'Donated to Charities' },
          { value: '£12,600', label: 'Prize Pool This Month' },
          { value: '34', label: 'Charities Supported' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00e5a0' }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: '#7a7a9a', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem' }}>
          How It Works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: '🎯', num: '01', title: 'Subscribe', desc: 'Choose monthly or yearly. Part of every subscription funds real charities.' },
            { icon: '⛳', num: '02', title: 'Enter Scores', desc: 'Log your last 5 Stableford scores. These become your draw numbers.' },
            { icon: '🎰', num: '03', title: 'Enter the Draw', desc: 'Monthly draws match your scores against winning numbers.' },
            { icon: '❤️', num: '04', title: 'Win & Give Back', desc: 'Winners share prize pools. Charities receive contributions every month.' },
          ].map(step => (
            <div key={step.num} style={{
              background: '#12121a', border: '1px solid #2a2a3a',
              borderRadius: '16px', padding: '2rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{step.icon}</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#2a2a3a', lineHeight: 1 }}>{step.num}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.5rem 0' }}>{step.title}</h3>
              <p style={{ color: '#7a7a9a', fontSize: '14px', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prize Pool */}
      <section style={{
        padding: '5rem 2rem', maxWidth: '900px', margin: '0 auto',
        borderTop: '1px solid #1a1a2e'
      }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem' }}>
          Prize Pool
        </h2>
        {[
          { label: '5-Number Match 🏆', pool: '£5,040', share: '40%', color: '#f5c842', desc: 'Jackpot — rolls over if unclaimed' },
          { label: '4-Number Match', pool: '£4,410', share: '35%', color: '#00e5a0', desc: 'Split among all winners' },
          { label: '3-Number Match', pool: '£3,150', share: '25%', color: '#7a7a9a', desc: 'Split among all winners' },
        ].map(t => (
          <div key={t.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem',
            background: '#12121a', border: '1px solid #2a2a3a'
          }}>
            <div>
              <div style={{ fontWeight: 700 }}>{t.label}</div>
              <div style={{ fontSize: '13px', color: '#7a7a9a', marginTop: '4px' }}>{t.desc}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: t.color }}>{t.pool}</div>
              <div style={{ fontSize: '12px', color: '#7a7a9a' }}>{t.share} of pool</div>
            </div>
          </div>
        ))}
      </section>

      {/* Charities */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1000px', margin: '0 auto', borderTop: '1px solid #1a1a2e' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
          Charities We Support
        </h2>
        <p style={{ textAlign: 'center', color: '#7a7a9a', marginBottom: '3rem' }}>
          You choose where your contribution goes every month.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            { name: 'Cancer Research UK', raised: '£8,400', tag: 'Health' },
            { name: "Alzheimer's Society", raised: '£6,200', tag: 'Health' },
            { name: 'Children in Need', raised: '£5,800', tag: 'Children' },
          ].map(c => (
            <div key={c.name} style={{
              background: '#12121a', border: '1px solid #2a2a3a',
              borderRadius: '16px', padding: '2rem'
            }}>
              <div style={{
                display: 'inline-block', background: '#00e5a015',
                color: '#00e5a0', fontSize: '11px', padding: '4px 12px',
                borderRadius: '100px', marginBottom: '1rem'
              }}>{c.tag}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{c.name}</h3>
              <div style={{ color: '#7a7a9a', fontSize: '13px' }}>Total raised by players</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f5c842', marginTop: '8px' }}>{c.raised}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={() => navigate('/charities')} style={{
            background: 'transparent', border: '1px solid #00e5a0',
            color: '#00e5a0', padding: '12px 32px', borderRadius: '10px',
            cursor: 'pointer', fontWeight: 600
          }}>
            View All Charities →
          </button>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '6rem 2rem', textAlign: 'center',
        borderTop: '1px solid #1a1a2e'
      }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>
          Ready to <span style={{ color: '#00e5a0' }}>Play</span> and <span style={{ color: '#f5c842' }}>Give Back?</span>
        </h2>
        <p style={{ color: '#7a7a9a', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
          Join thousands of golfers making every round count — for themselves and for charity.
        </p>
        <button onClick={() => navigate('/register')} style={{
          background: '#00e5a0', border: 'none', color: '#000',
          padding: '20px 56px', borderRadius: '14px', fontSize: '1.1rem',
          fontWeight: 700, cursor: 'pointer'
        }}>
          Subscribe Now — From £9.99/mo
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '2rem',
        borderTop: '1px solid #1a1a2e', color: '#7a7a9a', fontSize: '13px'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <span onClick={() => navigate('/charities')} style={{ color: '#7a7a9a', cursor: 'pointer', marginRight: '1.5rem' }}>Charities</span>
          <span onClick={() => navigate('/subscribe')} style={{ color: '#7a7a9a', cursor: 'pointer', marginRight: '1.5rem' }}>Pricing</span>
          <span onClick={() => navigate('/login')} style={{ color: '#7a7a9a', cursor: 'pointer', marginRight: '1.5rem' }}>Login</span>
          <span onClick={() => navigate('/register')} style={{ color: '#7a7a9a', cursor: 'pointer' }}>Register</span>
        </div>
        © 2026 FairwayFund · Built with purpose
      </footer>
    </div>
  );
}