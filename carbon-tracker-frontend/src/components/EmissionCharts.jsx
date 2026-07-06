import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function EmissionCharts({ breakdown, averages, dailyInputs }) {
  const barData = [
    { name: 'Energy (kWh/day)', You: dailyInputs.energyKwh, Average: averages.avg_energy_kwh },
    { name: 'Transport (km/day)', You: dailyInputs.transportKm, Average: averages.avg_transport_km },
    { name: 'Plastic (kg/day)', You: dailyInputs.plasticKg, Average: averages.avg_plastic_kg },
  ];

  const pieData = [
    { name: 'Electricity', value: breakdown.electricity_co2 },
    { name: 'Transport', value: breakdown.transport_co2 },
    { name: 'Plastic', value: breakdown.plastic_co2 },
  ].filter((d) => d.value > 0);

  const colors = ['#22c55e', '#f59e0b', '#ec4899'];

  return (
    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginTop: 20 }}>
      <div>
        <h4>You vs. Average</h4>
        <BarChart width={400} height={280} data={barData}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="You" fill="#22c55e" />
          <Bar dataKey="Average" fill="#0ea5e9" />
        </BarChart>
      </div>

      <div>
        <h4>Emissions Breakdown</h4>
        {pieData.length > 0 ? (
          <PieChart width={280} height={280}>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
              {pieData.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <p>No activity data yet — log an activity to see your breakdown.</p>
        )}
      </div>
    </div>
  );
}