import { useState, useEffect } from 'react';
import api from '../api';
import Layout from '../components/Layout';
import NumberStepper from '../components/NumberStepper';

const TABS = [
  { key: 'transport', icon: '🚗', label: 'Transport Log' },
  { key: 'electricity', icon: '⚡', label: 'Electricity Metrics' },
  { key: 'plastic', icon: '🛍️', label: 'Plastic Waste' },
];

export default function ActivityForm() {
  const [activeTab, setActiveTab] = useState('transport');
  const [transportMode, setTransportMode] = useState('Car');
  const [transportFuel, setTransportFuel] = useState('Petrol (Gasoline)');
  const [distanceKm, setDistanceKm] = useState('10.00');
  const [billRiel, setBillRiel] = useState('50000');
  const [plasticItems, setPlasticItems] = useState('5');
  const [activityDate] = useState(new Date().toISOString().slice(0, 10));
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  const loadLogs = () => api.get('/activities').then((res) => setLogs(res.data.slice(0, 6)));
  const deleteOne = async (id) => {
    await api.delete(`/activities/${id}`);
    loadLogs();
  };

  const deleteAll = async () => {
    if (!window.confirm('Delete all logged activities? This cannot be undone.')) return;
    await api.delete('/activities/all');
    loadLogs();
  };
  useEffect(() => { loadLogs(); }, []);

  const submit = async (payload) => {
    setError('');
    try {
      await api.post('/activities', payload);
      loadLogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <Layout>
      <h1 style={{ fontSize: 34 }}>📝 Activity Carbon Tracker &amp; Calculator</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 16 }}>
        Input daily parameters to compute instantaneous carbon offsets/emissions.
      </p>

      <div className="tab-row" style={{ marginTop: 32 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab-item ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'transport' && (
        <div>
          <h2 style={{ fontSize: 24, marginBottom: 20 }}>Log Vehicular Travel</h2>
          <label className="label">Select Vehicle Category</label>
          <select className="input" value={transportMode} onChange={(e) => setTransportMode(e.target.value)}>
            <option>Walking</option>
            <option>Bicycle</option>
            <option>Motorcycle/Scooter</option>
            <option>Tuk Tuk, Grab, PassApp</option>
            <option>Car</option>
            <option>Bus</option>
          </select>
          <label className="label">Fuel Type</label>
          <select className="input" value={transportFuel} onChange={(e) => setTransportFuel(e.target.value)}>
            <option>None</option>
            <option>Petrol (Gasoline)</option>
            <option>Electric</option>
            <option>Hybrid</option>
          </select>
          <label className="label">Traveled Distance (Kilometers)</label>
          <NumberStepper value={distanceKm} onChange={setDistanceKm} />
          <button
            className="btn-block"
            style={{ marginTop: 8 }}
            onClick={() => submit({
              type: 'transport',
              transport_mode: transportMode,
              transport_fuel: transportFuel,
              transport_distance_km: parseFloat(distanceKm),
              activity_date: activityDate,
            })}
          >
            Calculate &amp; Log Transport
          </button>
        </div>
      )}

      {activeTab === 'electricity' && (
        <div>
          <h2 style={{ fontSize: 24, marginBottom: 20 }}>Log Electricity Usage</h2>
          <label className="label">Monthly Bill (Riel)</label>
          <NumberStepper value={billRiel} onChange={setBillRiel} step={1000} />
          <button
            className="btn-block"
            style={{ marginTop: 8 }}
            onClick={() => submit({
              type: 'electricity',
              electricity_bill_riel: parseFloat(billRiel),
              activity_date: activityDate,
            })}
          >
            Calculate &amp; Log Electricity
          </button>
        </div>
      )}

      {activeTab === 'plastic' && (
        <div>
          <h2 style={{ fontSize: 24, marginBottom: 20 }}>Log Plastic Waste</h2>
          <label className="label">Number of Single-use Items</label>
          <NumberStepper value={plasticItems} onChange={setPlasticItems} />
          <button
            className="btn-block"
            style={{ marginTop: 8 }}
            onClick={() => submit({
              type: 'plastic',
              plastic_items: parseInt(plasticItems, 10),
              activity_date: activityDate,
            })}
          >
            Calculate &amp; Log Plastic
          </button>
        </div>
      )}

      {error && <p style={{ color: 'var(--clay)', marginTop: 16 }}>{error}</p>}

      <hr />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 24 }}>Recent Simulated Database Logs</h2>
        {logs.length > 0 && (
            <button className="btn-block" style={{ width: 'auto', padding: '8px 16px', color: 'var(--clay)', borderColor: 'var(--clay)' }} onClick={deleteAll}>
            🗑 Delete All
            </button>
        )}
        </div>

        <table className="data-table">
        <thead>
            <tr><th>Date</th><th>Category</th><th>Subtype</th><th>Distance/Qty</th><th>CO2 (kg)</th><th></th></tr>
        </thead>
        <tbody>
            {logs.map((log) => (
            <tr key={log.id}>
                <td>{log.activity_date}</td>
                <td style={{ textTransform: 'capitalize' }}>{log.type}</td>
                <td>{log.transport_mode || (log.type === 'electricity' ? 'Grid Power' : 'Single-use Items')}</td>
                <td>{log.transport_distance_km ?? log.plastic_items ?? '—'}</td>
                <td>{log.carbon_emitted}</td>
                <td>
                <button
                    onClick={() => deleteOne(log.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--clay)', cursor: 'pointer', fontSize: 16 }}
                    title="Delete this record"
                >
                    🗑
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </Layout>
  );
}