export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div className="card" style={{ width: 380, padding: 24 }}>
        <h3 style={{ fontSize: 18, marginBottom: 10 }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn-block" style={{ width: 'auto', padding: '8px 16px' }} onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn-block"
            style={{ width: 'auto', padding: '8px 16px', background: 'var(--clay)', color: 'white', borderColor: 'var(--clay)' }}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}