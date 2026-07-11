import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Layout from '../components/Layout';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Leaf } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/user').then((res) => setUser(res.data)).catch(() => navigate('/login'));
    api.get('/stats/breakdown').then((res) => setBreakdown(res.data));
    api.get('/predict-today').then((res) => setPrediction(res.data)).catch(() => setPrediction(null));
    api.get('/activities').then((res) => setActivities(res.data));
  }, [navigate]);

  if (!user || !breakdown) return <Layout><p>Loading...</p></Layout>;

  const total = breakdown.electricity_co2 + breakdown.transport_co2 + breakdown.plastic_co2;

  const pieData = [
    { name: 'Transport', value: breakdown.transport_co2 },
    { name: 'Electricity', value: breakdown.electricity_co2 },
    { name: 'Plastic', value: breakdown.plastic_co2 },
  ].filter((d) => d.value > 0);
  const pieColors = ['#A8E6B8', '#5FBFA8', '#2E7D6B'];

  const barData = activities.slice(0, 4).reverse().map((a) => ({
    date: a.activity_date,
    co2: a.carbon_emitted,
    category: a.type,
  }));
  const barColor = (cat) => ({ transport: '#7C3AED', electricity: '#4C1D95', plastic: '#3B82F6' }[cat] || '#7C3AED');

  return (
    <Layout>
      <h1 style={{ fontSize: 42, display: 'flex', alignItems: 'center', gap: 14 }}>
        <BarChart3 size={32} /> Executive Carbon Dashboard
      </h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 16 }}>
        Overview of calculated emissions, trends, and future predictive intelligence.
      </p>

      <div className="metric-grid" style={{ marginTop: 32 }}>
        <div>
          <div className="metric-label">Total Carbon Footprint for today</div>
          <div className="metric-value">{total.toFixed(2)} kg CO₂e</div>
          <span className="tag tag-positive">↑ Target: &lt; 50 kg</span>
        </div>
        <div>
          <div className="metric-label">Current Eco Score</div>
          <div className="metric-value">{user.eco_score}/100</div>
          <span className="tag tag-positive" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            ↑ <Leaf size={14} /> Tier: {user.eco_score > 75 ? 'Green Champion' : user.eco_score > 40 ? 'Eco Aware' : 'Getting Started'}
          </span>
        </div>
        <div>
          <div className="metric-label">Next Month Prediction</div>
          <div className="metric-value">{prediction?.prediction ?? '—'} kg CO₂e/day</div>
          <span className="tag tag-negative">↓ via {prediction?.source ?? 'n/a'}</span>
        </div>
      </div>

      <hr />

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ width: 340, flexShrink: 0, overflow: 'hidden' }}>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Emission Contribution by Category</h2>
            {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={120} paddingAngle={2}>
                {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
            ) : <p style={{ color: 'var(--text-muted)' }}>No data yet — log an activity to see this chart.</p>}
        </div>

        <div style={{ width: 360, flexShrink: 0, overflow: 'hidden' }}>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Daily Carbon Accumulation Log</h2>
            {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fill: 'var(--text-muted)' }} label={{ value: 'CO2 (kg)', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)' }} />
                <Tooltip />
                <Bar dataKey="co2">
                {barData.map((d, i) => <Cell key={i} fill={barColor(d.category)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            ) : <p style={{ color: 'var(--text-muted)' }}>No activity history yet.</p>}
        </div>
    </div>
    </Layout>
  );
}