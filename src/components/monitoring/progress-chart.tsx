"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  date: string;
  score: number;
}

export const ProgressChart = ({ data }: { data: ChartData[] }) => {
  const isEmpty = data.length === 0;
  return (
    <Card className="w-full h-full border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Developmental Progress Over Time</CardTitle>
        <CardDescription>Screening scores across clinical evaluations.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full pt-4">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
            <p className="text-sm font-medium">No screenings completed yet</p>
            <p className="text-xs">Complete your first screening to see progress here</p>
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}`}
              domain={[0, 10]}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
