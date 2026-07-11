import { Link } from 'react-router-dom';
import { Leaf, TrendingDown, Brain, Trophy, ClipboardList, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <Leaf size={44} />
        <h1 style={{ fontSize: 40 }}>Smart Carbon Footprint Tracker</h1>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 18, marginTop: 12, maxWidth: 640 }}>
        A full-stack platform that helps you measure, understand, and reduce
        your everyday carbon footprint — one logged activity at a time.
      </p>

      <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
        <Link to="/register" className="btn-block" style={{ width: 'auto', padding: '12px 24px', textDecoration: 'none', background: 'var(--leaf)', color: 'white', borderColor: 'var(--leaf)' }}>
          Get Started
        </Link>
        <Link to="/login" className="btn-block" style={{ width: 'auto', padding: '12px 24px', textDecoration: 'none' }}>
          Log In
        </Link>
      </div>

      <hr style={{ margin: '56px 0' }} />

      <h2 style={{ fontSize: 26, marginBottom: 20 }}>Why This Matters</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 700, marginBottom: 40 }}>
        Individual daily choices — how we commute, how much electricity we use,
        how much single-use plastic we consume — add up to a significant share
        of national emissions. Most people never see these numbers translated
        into something concrete. This app turns everyday activity into a
        real, calculated carbon footprint, using emission factors grounded in
        real data, so the impact of small changes becomes visible and trackable
        over time.
      </p>

      <h2 style={{ fontSize: 26, marginBottom: 24 }}>How to Use This App</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        {[
          { icon: ClipboardList, title: '1. Log Activities', text: 'Record your transport, electricity, and plastic use as you go.' },
          { icon: TrendingDown, title: '2. See Your Footprint', text: 'Automatic calculations convert your activity into real CO2 numbers.' },
          { icon: Brain, title: '3. Get Predictions', text: 'A calibrated machine learning model forecasts your near-term emissions.' },
          { icon: BarChart3, title: '4. Follow Recommendations', text: 'Get targeted tips based on your single biggest emission source.' },
          { icon: Trophy, title: '5. Track Your Progress', text: 'Earn eco points, badges, and climb the community leaderboard.' },
        ].map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="card">
              <Icon size={24} style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{step.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}