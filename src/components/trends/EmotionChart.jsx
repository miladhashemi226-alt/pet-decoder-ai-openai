import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = [
  '#10b981', // green - happy emotions
  '#3b82f6', // blue - playful/excited
  '#8b5cf6', // purple - calm/relaxed
  '#f59e0b', // amber - alert/curious
  '#ef4444', // red - stressed/anxious
  '#6b7280', // gray - neutral
  '#ec4899', // pink - affectionate
  '#14b8a6', // teal - content
];

const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent
  } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
        {payload.emotion}
      </text>
      <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#666" className="text-sm">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
      <text x={cx} y={cy + 30} dy={8} textAnchor="middle" fill="#999" className="text-xs">
        {`${payload.count} ${payload.count === 1 ? 'time' : 'times'}`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function EmotionChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-purple-100">
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Emotion Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <PieChartIcon className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No emotion data available</p>
            <p className="text-sm">Analyze some videos to see emotion distribution</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-purple-200">
          <p className="font-bold text-gray-900 text-lg">{payload[0].name}</p>
          <p className="text-gray-600">
            Count: <span className="font-semibold">{payload[0].value}</span> ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {payload.map((entry, index) => (
          <div 
            key={`legend-${index}`} 
            className="flex items-center gap-2 p-2 rounded hover:bg-purple-50 cursor-pointer transition-colors"
            onClick={() => setActiveIndex(index)}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700 font-medium">
              {entry.value}: {data[index].count}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-purple-100">
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5" />
          Emotion Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
              nameKey="emotion"
              onMouseEnter={onPieEnter}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}