import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Trash2, Plus, TrendingUp, Users, Target, Clock } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  tasksCompleted: number;
  tasksInProgress: number;
  performance: number;
  velocity: number;
}

interface TeamMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
}

const TeamPerformanceDashboard: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      role: 'Frontend Developer',
      tasksCompleted: 15,
      tasksInProgress: 3,
      performance: 92,
      velocity: 8
    }
  ]);

  const [metrics, setMetrics] = useState<TeamMetric[]>([
    { id: '1', name: 'Sprint Velocity', value: 45, target: 50, unit: 'points' },
    { id: '2', name: 'Code Quality', value: 88, target: 90, unit: '%' },
    { id: '3', name: 'Bug Rate', value: 2, target: 5, unit: 'bugs/sprint' }
  ]);

  const [newMember, setNewMember] = useState({ name: '', role: '' });
  const [newMetric, setNewMetric] = useState({ name: '', value: 0, target: 0, unit: '' });

  const addMember = () => {
    if (newMember.name && newMember.role) {
      const member: TeamMember = {
        id: Date.now().toString(),
        name: newMember.name,
        role: newMember.role,
        tasksCompleted: 0,
        tasksInProgress: 0,
        performance: 0,
        velocity: 0
      };
      setMembers([...members, member]);
      setNewMember({ name: '', role: '' });
    }
  };

  const addMetric = () => {
    if (newMetric.name && newMetric.unit) {
      const metric: TeamMetric = {
        id: Date.now().toString(),
        ...newMetric
      };
      setMetrics([...metrics, metric]);
      setNewMetric({ name: '', value: 0, target: 0, unit: '' });
    }
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const removeMetric = (id: string) => {
    setMetrics(metrics.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Team Size</p>
                    <p className="text-2xl font-bold">{members.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Avg Performance</p>
                    <p className="text-2xl font-bold">
                      {Math.round(members.reduce((acc, m) => acc + m.performance, 0) / members.length || 0)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Team Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="memberName">Name</Label>
                  <Input
                    id="memberName"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    placeholder="Enter member name"
                  />
                </div>
                <div>
                  <Label htmlFor="memberRole">Role</Label>
                  <Input
                    id="memberRole"
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    placeholder="Enter role"
                  />
                </div>
              </div>
              <Button onClick={addMember}>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{member.name}</h3>
                        <Badge variant="secondary">{member.role}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Completed: {member.tasksCompleted}</div>
                        <div>In Progress: {member.tasksInProgress}</div>
                        <div>Performance: {member.performance}%</div>
                        <div>Velocity: {member.velocity}</div>
                      </div>
                      <Progress value={member.performance} className="w-full" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Metric</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metricName">Metric Name</Label>
                  <Input
                    id="metricName"
                    value={newMetric.name}
                    onChange={(e) => setNewMetric({...newMetric, name: e.target.value})}
                    placeholder="Enter metric name"
                  />
                </div>
                <div>
                  <Label htmlFor="metricUnit">Unit</Label>
                  <Input
                    id="metricUnit"
                    value={newMetric.unit}
                    onChange={(e) => setNewMetric({...newMetric, unit: e.target.value})}
                    placeholder="e.g., %, points, hours"
                  />
                </div>
                <div>
                  <Label htmlFor="metricValue">Current Value</Label>
                  <Input
                    id="metricValue"
                    type="number"
                    value={newMetric.value}
                    onChange={(e) => setNewMetric({...newMetric, value: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="metricTarget">Target</Label>
                  <Input
                    id="metricTarget"
                    type="number"
                    value={newMetric.target}
                    onChange={(e) => setNewMetric({...newMetric, target: Number(e.target.value)})}
                  />
                </div>
              </div>
              <Button onClick={addMetric}>
                <Plus className="h-4 w-4 mr-2" />
                Add Metric
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {metrics.map((metric) => (
              <Card key={metric.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{metric.name}</h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold">{metric.value} {metric.unit}</span>
                        <span className="text-sm text-gray-600">Target: {metric.target} {metric.unit}</span>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="w-full" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMetric(metric.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamPerformanceDashboard;