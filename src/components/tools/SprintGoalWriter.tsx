import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Copy, Target, Plus, Trash2, Lightbulb } from 'lucide-react';

interface SprintGoal {
  id: string;
  sprintNumber: number;
  title: string;
  description: string;
  objectives: string[];
  successCriteria: string[];
  stakeholders: string[];
  risks: string[];
  template: 'SMART' | 'OKR' | 'Simple' | 'Value-Based';
  priority: 'High' | 'Medium' | 'Low';
}

export default function SprintGoalWriter() {
  const [goals, setGoals] = useState<SprintGoal[]>([
    {
      id: '1',
      sprintNumber: 1,
      title: 'User Authentication Foundation',
      description: 'Implement core user authentication features to enable secure user access',
      objectives: ['Complete login/logout functionality', 'Implement password reset', 'Add user registration'],
      successCriteria: ['Users can log in successfully', 'Password reset emails work', 'New users can register'],
      stakeholders: ['Product Owner', 'Development Team', 'QA Team'],
      risks: ['Third-party auth service downtime', 'Security vulnerabilities'],
      template: 'SMART',
      priority: 'High'
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    sprintNumber: 1,
    title: '',
    description: '',
    objectives: [''],
    successCriteria: [''],
    stakeholders: [''],
    risks: [''],
    template: 'SMART' as const,
    priority: 'Medium' as const
  });

  const templates = {
    'SMART': {
      description: 'Specific, Measurable, Achievable, Relevant, Time-bound',
      example: 'Complete user authentication with 95% test coverage by sprint end'
    },
    'OKR': {
      description: 'Objectives and Key Results format',
      example: 'Objective: Improve user onboarding. Key Results: Reduce signup time by 50%'
    },
    'Simple': {
      description: 'Clear and concise goal statement',
      example: 'Enable users to create and manage their profiles'
    },
    'Value-Based': {
      description: 'Focus on business value delivery',
      example: 'Deliver core shopping cart functionality to increase conversion by 15%'
    }
  };

  const addGoal = () => {
    if (newGoal.title && newGoal.description) {
      setGoals([...goals, {
        id: Date.now().toString(),
        ...newGoal,
        objectives: newGoal.objectives.filter(o => o.trim()),
        successCriteria: newGoal.successCriteria.filter(s => s.trim()),
        stakeholders: newGoal.stakeholders.filter(s => s.trim()),
        risks: newGoal.risks.filter(r => r.trim())
      }]);
      setNewGoal({
        sprintNumber: newGoal.sprintNumber + 1,
        title: '',
        description: '',
        objectives: [''],
        successCriteria: [''],
        stakeholders: [''],
        risks: [''],
        template: 'SMART',
        priority: 'Medium'
      });
    }
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const addArrayItem = (field: 'objectives' | 'successCriteria' | 'stakeholders' | 'risks') => {
    setNewGoal({
      ...newGoal,
      [field]: [...newGoal[field], '']
    });
  };

  const updateArrayItem = (field: 'objectives' | 'successCriteria' | 'stakeholders' | 'risks', index: number, value: string) => {
    const updated = [...newGoal[field]];
    updated[index] = value;
    setNewGoal({ ...newGoal, [field]: updated });
  };

  const removeArrayItem = (field: 'objectives' | 'successCriteria' | 'stakeholders' | 'risks', index: number) => {
    setNewGoal({
      ...newGoal,
      [field]: newGoal[field].filter((_, i) => i !== index)
    });
  };

  const copyGoalText = (goal: SprintGoal) => {
    const text = `**Sprint ${goal.sprintNumber} Goal: ${goal.title}**

**Description:**
${goal.description}

**Objectives:**
${goal.objectives.map(o => `- ${o}`).join('\n')}

**Success Criteria:**
${goal.successCriteria.map(s => `- ${s}`).join('\n')}

**Stakeholders:**
${goal.stakeholders.join(', ')}

**Risks:**
${goal.risks.map(r => `- ${r}`).join('\n')}

**Template:** ${goal.template}
**Priority:** ${goal.priority}`;

    navigator.clipboard.writeText(text);
  };

  const generateSuggestions = (template: string) => {
    const suggestions = {
      'SMART': [
        'Make it Specific: What exactly will be accomplished?',
        'Make it Measurable: How will success be measured?',
        'Make it Achievable: Is this realistic for the sprint?',
        'Make it Relevant: Does this align with product goals?',
        'Make it Time-bound: Can this be completed in the sprint?'
      ],
      'OKR': [
        'Define clear objective: What do you want to achieve?',
        'Set measurable key results: How will you measure success?',
        'Limit to 3-5 key results per objective',
        'Make key results ambitious but achievable'
      ],
      'Simple': [
        'Keep it concise and clear',
        'Focus on the main outcome',
        'Avoid technical jargon',
        'Make it understandable to all stakeholders'
      ],
      'Value-Based': [
        'Focus on business value or user benefit',
        'Quantify the expected impact',
        'Connect to business metrics',
        'Consider customer or user perspective'
      ]
    };
    return suggestions[template as keyof typeof suggestions] || [];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Sprint Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              placeholder="Sprint Number"
              value={newGoal.sprintNumber}
              onChange={(e) => setNewGoal({ ...newGoal, sprintNumber: parseInt(e.target.value) || 1 })}
            />
            <Select value={newGoal.template} onValueChange={(value: any) => setNewGoal({ ...newGoal, template: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(templates).map(([key, template]) => (
                  <SelectItem key={key} value={key}>
                    {key} - {template.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={newGoal.priority} onValueChange={(value: any) => setNewGoal({ ...newGoal, priority: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            placeholder="Sprint Goal Title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          />

          <Textarea
            placeholder="Goal Description"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            className="min-h-[80px]"
          />

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Template Suggestions ({newGoal.template}):</span>
            </div>
            <ul className="text-sm space-y-1">
              {generateSuggestions(newGoal.template).map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {['objectives', 'successCriteria', 'stakeholders', 'risks'].map((field) => (
            <div key={field}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <Button variant="outline" size="sm" onClick={() => addArrayItem(field as any)}>
                  <Plus className="w-4 h-4 mr-1" />Add
                </Button>
              </div>
              {newGoal[field as keyof typeof newGoal].map((item: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    value={item}
                    onChange={(e) => updateArrayItem(field as any, index, e.target.value)}
                    className="flex-1"
                  />
                  {newGoal[field as keyof typeof newGoal].length > 1 && (
                    <Button variant="outline" size="sm" onClick={() => removeArrayItem(field as any, index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ))}

          <Button onClick={addGoal} className="w-full">
            <Target className="w-4 h-4 mr-2" />Create Sprint Goal
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sprint Goals ({goals.length})</h3>
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">Sprint {goal.sprintNumber}: {goal.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(goal.priority)}>{goal.priority}</Badge>
                  <Badge variant="outline">{goal.template}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="font-medium mb-2">Objectives:</h5>
                  <ul className="text-sm space-y-1">
                    {goal.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Success Criteria:</h5>
                  <ul className="text-sm space-y-1">
                    {goal.successCriteria.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="font-medium mb-2">Stakeholders:</h5>
                  <div className="flex flex-wrap gap-1">
                    {goal.stakeholders.map((stakeholder, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {stakeholder}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Risks:</h5>
                  <ul className="text-sm space-y-1">
                    {goal.risks.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">⚠</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => copyGoalText(goal)}>
                  <Copy className="w-4 h-4 mr-1" />Copy
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteGoal(goal.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}