import { useEffect, useState } from 'react';
import api from '../api';
import Layout from '../components/Layout';

export default function Leaderboard() {
  const [data, setData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    api.get('/leaderboard').then((res) => setData(res.data));
    api.get('/recommendations').then((res) => setRecommendation(res.data));
  }, []);

  if (!data) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <h1 style={{ fontSize: 34 }}>🏆 Community Eco-Leaderboard</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 16, marginBottom: 28 }}>
        Compete against classmates and community members using gamification metrics.
      </p>

      {recommendation && (
        <div className="notice-banner">
          💡 <strong>Recommendation Engine Notice:</strong> Your footprint level is currently{' '}
          <em>{recommendation.footprint_level}</em>. {recommendation.recommendations[0]}
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr><th>Rank</th><th>User Name</th><th>EcoScore</th></tr>
        </thead>
        <tbody>
          {data.leaderboard.map((u, i) => (
            <tr key={u.id}>
              <td>{i + 1}</td>
              <td>{u.name}</td>
              <td>{u.eco_score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: 20, color: 'var(--text-muted)' }}>
        Your rank: #{data.your_rank} — Score: {data.your_score}
      </p>
    </Layout>
  );
}