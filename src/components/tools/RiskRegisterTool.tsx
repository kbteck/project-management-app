import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Trash2, Plus, AlertTriangle, Shield, Clock } from 'lucide-react';

interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Mitigated' | 'Closed';
  owner: string;
  mitigation: string;
  dateIdentified: string;
  dueDate: string;
}

const RiskRegisterTool: React.FC = () => {
  const [risks, setRisks] = useState<Risk[]>([
    {
      id: '1',
      title: 'Key Developer Departure',
      description: 'Risk of losing critical team member with domain knowledge',
      category: 'Resource',
      probability: 'Medium',
      impact: 'High',
      status: 'Open',
      owner: 'Project Manager',
      mitigation: 'Document knowledge, cross-train team members',
      dateIdentified: '2024-01-15',
      dueDate: '2024-02-15'
    }
  ]);

  const [newRisk, setNewRisk] = useState<Partial<Risk>>({
    title: '',
    description: '',
    category: '',
    probability: 'Low',
    impact: 'Low',
    status: 'Open',
    owner: '',
    mitigation: '',
    dueDate: ''
  });

  const categories = ['Technical', 'Resource', 'Schedule', 'Budget', 'Quality', 'External'];
  const probabilities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
  const impacts: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
  const statuses: ('Open' | 'Mitigated' | 'Closed')[] = ['Open', 'Mitigated', 'Closed'];

  const addRisk = () => {
    if (newRisk.title && newRisk.description && newRisk.category && newRisk.owner) {
      const risk: Risk = {
        id: Date.now().toString(),
        title: newRisk.title,
        description: newRisk.description,
        category: newRisk.category,
        probability: newRisk.probability || 'Low',
        impact: newRisk.impact || 'Low',
        status: newRisk.status || 'Open',
        owner: newRisk.owner,
        mitigation: newRisk.mitigation || '',
        dateIdentified: new Date().toISOString().split('T')[0],
        dueDate: newRisk.dueDate || ''
      };
      setRisks([...risks, risk]);
      setNewRisk({
        title: '',
        description: '',
        category: '',
        probability: 'Low',
        impact: 'Low',
        status: 'Open',
        owner: '',
        mitigation: '',
        dueDate: ''
      });
    }
  };

  const removeRisk = (id: string) => {
    setRisks(risks.filter(r => r.id !== id));
  };

  const updateRiskStatus = (id: string, status: 'Open' | 'Mitigated' | 'Closed') => {
    setRisks(risks.map(r => r.id === id ? { ...r, status } : r));
  };

  const getRiskScore = (probability: string, impact: string) => {
    const probScore = probability === 'High' ? 3 : probability === 'Medium' ? 2 : 1;
    const impactScore = impact === 'High' ? 3 : impact === 'Medium' ? 2 : 1;
    return probScore * impactScore;
  };

  const getRiskLevel = (score: number) => {
    if (score >= 6) return { level: 'Critical', color: 'bg-red-500' };
    if (score >= 4) return { level: 'High', color: 'bg-orange-500' };
    if (score >= 2) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'Low', color: 'bg-green-500' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'Mitigated': return 'bg-yellow-100 text-yellow-800';
      case 'Closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openRisks = risks.filter(r => r.status === 'Open');
  const highRisks = risks.filter(r => getRiskScore(r.probability, r.impact) >= 6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Total Risks</p>
                <p className="text-2xl font-bold">{risks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Open Risks</p>
                <p className="text-2xl font-bold">{openRisks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Critical Risks</p>
                <p className="text-2xl font-bold">{highRisks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="register" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">Risk Register</TabsTrigger>
          <TabsTrigger value="add">Add Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Risk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="riskTitle">Risk Title</Label>
                  <Input
                    id="riskTitle"
                    value={newRisk.title}
                    onChange={(e) => setNewRisk({...newRisk, title: e.target.value})}
                    placeholder="Enter risk title"
                  />
                </div>
                <div>
                  <Label htmlFor="riskCategory">Category</Label>
                  <Select value={newRisk.category} onValueChange={(value) => setNewRisk({...newRisk, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="riskDescription">Description</Label>
                <Textarea
                  id="riskDescription"
                  value={newRisk.description}
                  onChange={(e) => setNewRisk({...newRisk, description: e.target.value})}
                  placeholder="Describe the risk..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="riskProbability">Probability</Label>
                  <Select value={newRisk.probability} onValueChange={(value: 'Low' | 'Medium' | 'High') => setNewRisk({...newRisk, probability: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {probabilities.map(prob => (
                        <SelectItem key={prob} value={prob}>{prob}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="riskImpact">Impact</Label>
                  <Select value={newRisk.impact} onValueChange={(value: 'Low' | 'Medium' | 'High') => setNewRisk({...newRisk, impact: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {impacts.map(impact => (
                        <SelectItem key={impact} value={impact}>{impact}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="riskOwner">Risk Owner</Label>
                  <Input
                    id="riskOwner"
                    value={newRisk.owner}
                    onChange={(e) => setNewRisk({...newRisk, owner: e.target.value})}
                    placeholder="Enter risk owner"
                  />
                </div>
                <div>
                  <Label htmlFor="riskDueDate">Due Date</Label>
                  <Input
                    id="riskDueDate"
                    type="date"
                    value={newRisk.dueDate}
                    onChange={(e) => setNewRisk({...newRisk, dueDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="riskMitigation">Mitigation Strategy</Label>
                <Textarea
                  id="riskMitigation"
                  value={newRisk.mitigation}
                  onChange={(e) => setNewRisk({...newRisk, mitigation: e.target.value})}
                  placeholder="Describe mitigation strategy..."
                />
              </div>

              <Button onClick={addRisk}>
                <Plus className="h-4 w-4 mr-2" />
                Add Risk
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register" className="space-y-4">
          <div className="grid gap-4">
            {risks.map((risk) => {
              const riskScore = getRiskScore(risk.probability, risk.impact);
              const riskLevel = getRiskLevel(riskScore);
              
              return (
                <Card key={risk.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{risk.title}</h3>
                          <Badge variant="secondary">{risk.category}</Badge>
                          <Badge className={getStatusColor(risk.status)}>{risk.status}</Badge>
                          <div className={`px-2 py-1 rounded text-xs text-white ${riskLevel.color}`}>
                            {riskLevel.level}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{risk.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Probability: {risk.probability}</div>
                          <div>Impact: {risk.impact}</div>
                          <div>Owner: {risk.owner}</div>
                          <div>Due: {risk.dueDate}</div>
                        </div>
                        {risk.mitigation && (
                          <div className="text-sm">
                            <strong>Mitigation:</strong> {risk.mitigation}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Select value={risk.status} onValueChange={(value: 'Open' | 'Mitigated' | 'Closed') => updateRiskStatus(risk.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRisk(risk.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskRegisterTool;