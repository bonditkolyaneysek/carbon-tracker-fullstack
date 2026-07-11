import { useState } from 'react';
import api from '../api';
import Layout from '../components/Layout';
import NumberStepper from '../components/NumberStepper';
import { Car, Zap, ShoppingBag } from 'lucide-react';
import { Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const TABS = [
  { key: 'transport', icon: <Car />, label: 'Transport Log' },
  { key: 'electricity', icon: <Zap />, label: 'Electricity Metrics' },
  { key: 'plastic', icon: <ShoppingBag />, label: 'Plastic Waste' },
];

export default function ActivityForm() {
  const [activeTab, setActiveTab] = useState('transport');
  const [transportMode, setTransportMode] = useState('Car');
  const [transportFuel, setTransportFuel] = useState('Petrol (Gasoline)');
  const [distanceKm, setDistanceKm] = useState('10.00');
  const [billRiel, setBillRiel] = useState('50000');
  const [plasticItems, setPlasticItems] = useState('5');
  const [activityDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (payload) => {
    setError('');
    try {
      await api.post('/activities', payload);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <Layout>
      <h1 style={{ fontSize: 34, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Calculator size={30} /> Activity Carbon Tracker &amp; Calculator
      </h1>
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

      <h2 style={{ fontSize: 22, marginBottom: 16 }}>Current Input Summary</h2>
      <table className="data-table">
        <thead>
          <tr><th>Field</th><th>Value</th></tr>
        </thead>
        <tbody>
          {activeTab === 'transport' && (
            <>
              <tr><td>Vehicle Category</td><td>{transportMode}</td></tr>
              <tr><td>Fuel Type</td><td>{transportFuel}</td></tr>
              <tr><td>Distance (km)</td><td>{distanceKm}</td></tr>
            </>
          )}
          {activeTab === 'electricity' && (
            <tr><td>Monthly Bill (Riel)</td><td>{billRiel}</td></tr>
          )}
          {activeTab === 'plastic' && (
            <tr><td>Single-use Items</td><td>{plasticItems}</td></tr>
          )}
        </tbody>
      </table>

      <button
        className="btn-block"
        style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        onClick={() => navigate('/dashboard')}
      >
        <LayoutDashboard size={16} /> View Executive Carbon Dashboard
      </button>
    </Layout>
  );
}