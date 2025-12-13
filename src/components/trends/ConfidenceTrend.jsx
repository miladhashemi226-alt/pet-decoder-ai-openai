
import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Area, ComposedChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

export default function ConfidenceTrend({ data }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-purple-100">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Confidence Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2 font-medium">No confidence data available</p>
              <p className="text-sm">Analyze more videos to see trends</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Aggregate multiple analyses per day
  const aggregatedDataMap = data.reduce((acc, item) => {
    try {
      const date = parseISO(item.date);
      const dayKey = format(date, 'yyyy-MM-dd'); // Group by day

      if (!acc[dayKey]) {
        acc[dayKey] = {
          confidences: [],
          emotions: [],
          originalDate: date, // Keep one date object for formatting later
          analysisCount: 0
        };
      }
      acc[dayKey].confidences.push(item.confidence);
      if (item.emotion) {
        acc[dayKey].emotions.push(item.emotion);
      }
      acc[dayKey].analysisCount++;
    } catch (error) {
      console.error("Error parsing date for item:", item.date, error);
    }
    return acc;
  }, {});

  // Format aggregated data for the chart
  const formattedData = Object.values(aggregatedDataMap).map(dayData => {
    const avgConfidence = dayData.confidences.reduce((sum, val) => sum + val, 0) / dayData.confidences.length;

    // Determine most common emotion
    let mostCommonEmotion = null;
    if (dayData.emotions.length > 0) {
      const emotionCounts = {};
      dayData.emotions.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
      mostCommonEmotion = Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b);
    }

    return {
      date: dayData.originalDate, // Use the original date object
      displayDate: format(dayData.originalDate, 'MMM d'), // e.g., "Jan 15"
      fullDate: format(dayData.originalDate, 'MMM d, yyyy'), // For tooltip
      sortDate: dayData.originalDate.getTime(),
      confidence: Math.round(avgConfidence), // Store as 'confidence' for the chart
      emotion: mostCommonEmotion, // Store as 'emotion' for the chart
      analysisCount: dayData.analysisCount
    };
  }).sort((a, b) => a.sortDate - b.sortDate);

  // Reduce number of ticks if there are too many data points
  const tickInterval = formattedData.length > 10 ? Math.ceil(formattedData.length / 8) : 0;

  // Calculate overall average confidence from aggregated daily averages
  const avgConfidence = Math.round(
    formattedData.reduce((sum, d) => sum + d.confidence, 0) / formattedData.length
  );

  // Calculate trend (improving, declining, stable) based on aggregated data
  const getTrend = () => {
    if (formattedData.length < 2) return "stable";
    
    const recentData = formattedData.slice(-5);
    const oldData = formattedData.slice(0, Math.min(5, formattedData.length - 5));
    
    if (oldData.length === 0) return "stable";
    
    const recentAvg = recentData.reduce((sum, d) => sum + d.confidence, 0) / recentData.length;
    const oldAvg = oldData.reduce((sum, d) => sum + d.confidence, 0) / oldData.length;
    
    const diff = recentAvg - oldAvg;
    
    if (diff > 5) return "improving";
    if (diff < -5) return "declining";
    return "stable";
  };

  const trend = getTrend();
  const trendColors = {
    improving: "bg-green-100 text-green-700 border-green-300",
    declining: "bg-red-100 text-red-700 border-red-300",
    stable: "bg-blue-100 text-blue-700 border-blue-300"
  };

  const trendLabels = {
    improving: "📈 Improving",
    declining: "📉 Declining",
    stable: "➡️ Stable"
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const confidence = payload[0].value;
      
      return (
        <div className="bg-white p-4 shadow-xl rounded-lg border-2 border-purple-200">
          <p className="font-bold text-gray-900 mb-2">{data.fullDate}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Avg Confidence:</span>{" "}
              <span className="font-bold text-blue-600">{confidence}%</span>
            </p>
            {data.emotion && (
              <p className="text-sm">
                <span className="text-gray-600">Most Common:</span>{" "}
                <span className="semibold text-gray-800">{data.emotion}</span>
              </p>
            )}
            {data.analysisCount && data.analysisCount > 1 && (
              <p className="text-xs text-gray-500 mt-2">
                {data.analysisCount} analyses this day
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={hoveredPoint === payload.displayDate ? 6 : 4}
        fill="#3b82f6"
        stroke="#fff"
        strokeWidth={2}
        style={{ 
          cursor: 'pointer',
          transition: 'r 0.2s'
        }}
      />
    );
  };

  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-purple-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Confidence Trend
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge className={trendColors[trend]}>
              {trendLabels[trend]}
            </Badge>
            <Badge variant="outline" className="border-purple-300">
              Avg: {avgConfidence}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart 
            data={formattedData}
            onMouseMove={(e) => {
              if (e && e.activePayload) {
                setHoveredPoint(e.activePayload[0].payload.displayDate);
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
            margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
          >
            <defs>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="displayDate" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={tickInterval}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              domain={[0, 100]}
              style={{ fontSize: '12px' }}
              label={{ 
                value: 'Confidence %', 
                angle: -90, 
                position: 'insideLeft', 
                style: { fontSize: '12px', fill: '#6b7280' } 
              }}
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {/* Reference line at 85% (high confidence threshold) */}
            <ReferenceLine 
              y={85} 
              stroke="#10b981" 
              strokeDasharray="5 5" 
              label={{ 
                value: 'High', 
                position: 'right', 
                fill: '#10b981', 
                fontSize: 10 
              }} 
            />
            
            {/* Reference line at 70% (medium confidence threshold) */}
            <ReferenceLine 
              y={70} 
              stroke="#f59e0b" 
              strokeDasharray="5 5" 
              label={{ 
                value: 'Medium', 
                position: 'right', 
                fill: '#f59e0b', 
                fontSize: 10 
              }} 
            />
            
            {/* Area under the line - hide from legend */}
            <Area
              type="monotone"
              dataKey="confidence"
              stroke="none"
              fill="url(#colorConfidence)"
              legendType="none"
            />
            
            {/* Main line */}
            <Line 
              type="monotone" 
              dataKey="confidence" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 8 }}
              name="Confidence Level"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
