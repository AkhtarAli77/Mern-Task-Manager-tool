import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Chart = ({ data }) => {
  // Check if data exists and has values
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No chart data available. Create tasks with different priorities!
      </div>
    );
  }

  // Check if all values are zero
  const allZero = data.every(item => item.value === 0);
  if (allZero) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks found. Create your first task to see the chart!
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;