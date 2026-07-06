export default function NumberStepper({ value, onChange, step = 1 }) {
  return (
    <div className="stepper-row">
      <input
        className="input"
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ paddingRight: 76 }}
      />
      <div className="stepper-btns">
        <button type="button" className="stepper-btn" onClick={() => onChange((parseFloat(value || 0) - step).toFixed(2))}>−</button>
        <button type="button" className="stepper-btn" onClick={() => onChange((parseFloat(value || 0) + step).toFixed(2))}>+</button>
      </div>
    </div>
  );
}