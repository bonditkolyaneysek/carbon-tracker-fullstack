import { useEffect, useState } from 'react';
import api from '../api';
import Layout from '../components/Layout';
import ConfirmDialog from '../components/ConfirmDialog';
import { Trash2 } from 'lucide-react';

export default function History() {
  const [activities, setActivities] = useState([]);
  const [confirmTarget, setConfirmTarget] = useState(null); // activity id, or 'ALL'

  const load = () => api.get('/activities').then((res) => setActivities(res.data));
  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (confirmTarget === 'ALL') {
      for (const a of activities) {
        await api.delete(`/activities/${a.id}`);
      }
    } else {
      await api.delete(`/activities/${confirmTarget}`);
    }
    setConfirmTarget(null);
    load();
  };

  return (
    <Layout>
      <h1 style={{ fontSize: 34 }}>Activity History</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 16, marginBottom: 28 }}>
        A complete record of every activity you've logged.
      </p>

      {activities.length > 0 && (
        <button
          className="btn-block"
          style={{ width: 'auto', padding: '8px 16px', marginBottom: 20, background: 'var(--clay)', color: 'white', borderColor: 'var(--clay)' }}
          onClick={() => setConfirmTarget('ALL')}
        >
          Delete All Activities
        </button>
      )}

      <table className="data-table">
        <thead>
          <tr><th>Date</th><th>Category</th><th>Subtype</th><th>Distance/Qty</th><th>CO2 (kg)</th><th></th></tr>
        </thead>
        <tbody>
          {activities.map((log) => (
            <tr key={log.id}>
              <td>{log.activity_date}</td>
              <td style={{ textTransform: 'capitalize' }}>{log.type}</td>
              <td>{log.transport_mode || (log.type === 'electricity' ? 'Grid Power' : 'Single-use Items')}</td>
              <td>{log.transport_distance_km ?? log.plastic_items ?? '—'}</td>
              <td>{log.carbon_emitted}</td>
              <td>
                <button
                  onClick={() => setConfirmTarget(log.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clay)' }}
                  title="Delete this activity"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {activities.length === 0 && (
        <p style={{ color: 'var(--text-muted)', marginTop: 20 }}>No activities logged yet.</p>
      )}

      <ConfirmDialog
        open={confirmTarget !== null}
        title={confirmTarget === 'ALL' ? 'Delete all logged activities?' : 'Delete this activity?'}
        message="This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </Layout>
  );
}