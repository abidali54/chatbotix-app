import React from 'react';
import { Card } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', conversations: 40 },
  { name: 'Tue', conversations: 30 },
  { name: 'Wed', conversations: 45 },
  { name: 'Thu', conversations: 50 },
  { name: 'Fri', conversations: 35 },
  { name: 'Sat', conversations: 25 },
  { name: 'Sun', conversations: 20 },
];

export function ChatMetrics() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Conversations Overview</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="conversations" stroke="#6366f1" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}