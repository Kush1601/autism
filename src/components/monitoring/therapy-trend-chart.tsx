"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TherapyData {
  date: string;
  score: number;
}

export const TherapyTrendChart = ({ data }: { data: TherapyData[] }) => {
  const isEmpty = data.length === 0;
  return (
    <Card className="w-full h-full border-none shadow-md bg-blue-50/30">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-blue-800">Therapy Sessions Progress</CardTitle>
        <CardDescription>Daily improvement scores from therapy logs.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full pt-4">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
            <p className="text-sm font-medium">No therapy sessions logged yet</p>
            <p className="text-xs">Log your first session to see trends here</p>
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 10]}
            />
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar 
              dataKey="score" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
