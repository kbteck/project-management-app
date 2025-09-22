import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface DataPoint {
  id: string;
  day: number;
  planned: number;
  actual: number;
}

export const BurndownChart: React.FC = () => {
  const [sprintLength, setSprintLength] = useState(10);
  const [totalStoryPoints, setTotalStoryPoints] = useState(50);
  const [chartType, setChartType] = useState<'burndown' | 'burnup'>('burndown');
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { id: '1', day: 0, planned: 50, actual: 50 },
    { id: '2', day: 5, planned: 25, actual: 30 },
    { id: '3', day: 10, planned: 0, actual: 5 }
  ]);

  const addDataPoint = () => {
    const newPoint: DataPoint = {
      id: Date.now().toString(),
      day: Math.max(...dataPoints.map(p => p.day)) + 1,
      planned: 0,
      actual: 0
    };
    setDataPoints([...dataPoints, newPoint]);
  };

  const updateDataPoint = (id: string, field: keyof DataPoint, value: string | number) => {
    setDataPoints(dataPoints.map(point => 
      point.id === id ? { ...point, [field]: value } : point
    ));
  };

  const removeDataPoint = (id: string) => {
    setDataPoints(dataPoints.filter(point => point.id !== id));
  };

  const generateIdealLine = () => {
    const points = [];
    for (let day = 0; day <= sprintLength; day++) {
      if (chartType === 'burndown') {
        points.push({ day, value: totalStoryPoints - (totalStoryPoints * day / sprintLength) });
      } else {
        points.push({ day, value: totalStoryPoints * day / sprintLength });
      }
    }
    return points;
  };

  const idealLine = generateIdealLine();
  const maxValue = Math.max(totalStoryPoints, ...dataPoints.map(p => Math.max(p.planned, p.actual)));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📉</span>
            {chartType === 'burndown' ? 'Burndown' : 'Burnup'} Chart Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sprint-length">Sprint Length (days)</Label>
              <Input
                id="sprint-length"
                type="number"
                value={sprintLength}
                onChange={(e) => setSprintLength(parseInt(e.target.value) || 10)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="total-points">Total Story Points</Label>
              <Input
                id="total-points"
                type="number"
                value={totalStoryPoints}
                onChange={(e) => setTotalStoryPoints(parseInt(e.target.value) || 50)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="chart-type">Chart Type</Label>
              <Select value={chartType} onValueChange={(value: 'burndown' | 'burnup') => setChartType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="burndown">Burndown</SelectItem>
                  <SelectItem value="burnup">Burnup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-white p-4 border rounded-lg">
            <svg width="100%" height="300" viewBox="0 0 500 300">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map(i => (
                <g key={i}>
                  <line x1="50" y1={50 + i * 40} x2="450" y2={50 + i * 40} stroke="#e5e7eb" strokeWidth="1" />
                  <text x="40" y={55 + i * 40} fontSize="10" fill="#666" textAnchor="end">
                    {Math.round(maxValue - (maxValue * i / 5))}
                  </text>
                </g>
              ))}
              
              {/* Ideal line */}
              <polyline
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="5,5"
                points={idealLine.map(p => `${50 + (p.day * 400 / sprintLength)},${250 - (p.value * 200 / maxValue)}`).join(' ')}
              />
              
              {/* Actual line */}
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                points={dataPoints.sort((a, b) => a.day - b.day).map(p => `${50 + (p.day * 400 / sprintLength)},${250 - (p.actual * 200 / maxValue)}`).join(' ')}
              />
              
              {/* Data points */}
              {dataPoints.map(point => (
                <circle
                  key={point.id}
                  cx={50 + (point.day * 400 / sprintLength)}
                  cy={250 - (point.actual * 200 / maxValue)}
                  r="4"
                  fill="#ef4444"
                />
              ))}
              
              {/* X-axis labels */}
              {Array.from({length: sprintLength + 1}, (_, i) => (
                <text key={i} x={50 + (i * 400 / sprintLength)} y="275" fontSize="10" fill="#666" textAnchor="middle">
                  Day {i}
                </text>
              ))}
            </svg>
            
            <div className="flex gap-4 mt-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-gray-400 border-dashed border-t-2"></div>
                <span>Ideal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-red-500"></div>
                <span>Actual</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Data Points</h3>
              <Button onClick={addDataPoint} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Point
              </Button>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {dataPoints.map(point => (
                <div key={point.id} className="flex gap-2 items-center p-2 bg-gray-50 rounded">
                  <Input
                    type="number"
                    placeholder="Day"
                    value={point.day}
                    onChange={(e) => updateDataPoint(point.id, 'day', parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <Input
                    type="number"
                    placeholder="Actual"
                    value={point.actual}
                    onChange={(e) => updateDataPoint(point.id, 'actual', parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeDataPoint(point.id)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};