import Layout from '../components/Layout';
import { Database, Calculator, Activity } from 'lucide-react';

export default function ModelTransparency() {
  return (
    <Layout>
      <h1 style={{ fontSize: 34 }}>Model Transparency</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 16, marginBottom: 32 }}>
        How this app calculates and predicts your carbon footprint — dataset,
        formulas, and model diagnostics.
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Database size={20} /><h2 style={{ fontSize: 20 }}>Dataset</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
          The prediction model's calibration layer is trained against a survey
          dataset of real household energy, transport, and plastic usage
          collected in Cambodia (primary_data_CO2.csv), used to correct a
          base model originally trained on IoT sensor data so its output
          reflects locally realistic emission levels.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Calculator size={20} /><h2 style={{ fontSize: 20 }}>Emission Factor Formulas</h2>
        </div>
        <table className="data-table">
          <thead><tr><th>Category</th><th>Formula</th></tr></thead>
          <tbody>
            <tr><td>Electricity</td><td>(Monthly Bill in Riel ÷ 610 Riel/kWh) ÷ 30 days × 0.18708 kg CO2/kWh</td></tr>
            <tr><td>Transport</td><td>Distance (km) × mode/fuel-specific factor (e.g. Petrol Car: 0.308 kg CO2/km, Bicycle: 0 kg CO2/km)</td></tr>
            <tr><td>Plastic</td><td>Item count × 0.141 kg/item × 6.0 kg CO2/kg lifecycle factor</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Activity size={20} /><h2 style={{ fontSize: 20 }}>Model Diagnostics</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 12 }}>
          The prediction pipeline runs in two stages: a Linear Regression
          model trained on energy, transport, and plastic usage predicts a
          raw emissions estimate; a second calibrator model then rescales
          that estimate to align with real survey-based emissions data.
          If either stage is unavailable, the app falls back to a direct
          sum of your logged, formula-based emissions — so a prediction is
          always available.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic' }}>
          Note: as a linear model trained on a limited regional sample, predictions
          should be treated as directional estimates rather than precise forecasts.
        </p>
      </div>
    </Layout>
  );
}