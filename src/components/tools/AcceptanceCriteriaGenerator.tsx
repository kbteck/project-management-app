import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Copy, Plus, Trash2, CheckCircle } from 'lucide-react';

interface AcceptanceCriteria {
  id: string;
  storyTitle: string;
  criteria: string[];
  definitionOfDone: string[];
  template: 'Given-When-Then' | 'Checklist' | 'Scenario-Based';
  priority: 'Must Have' | 'Should Have' | 'Could Have';
}

export default function AcceptanceCriteriaGenerator() {
  const [criteriaList, setCriteriaList] = useState<AcceptanceCriteria[]>([
    {
      id: '1',
      storyTitle: 'User Login',
      criteria: [
        'Given a registered user, When they enter valid credentials, Then they should be logged in',
        'Given invalid credentials, When user attempts login, Then error message should be displayed'
      ],
      definitionOfDone: ['Unit tests pass', 'Code reviewed', 'Security tested'],
      template: 'Given-When-Then',
      priority: 'Must Have'
    }
  ]);

  const [newCriteria, setNewCriteria] = useState({
    storyTitle: '',
    criteria: [''],
    definitionOfDone: [''],
    template: 'Given-When-Then' as const,
    priority: 'Must Have' as const
  });

  const templates = {
    'Given-When-Then': {
      description: 'Behavior-driven format',
      example: 'Given [context], When [action], Then [outcome]'
    },
    'Checklist': {
      description: 'Simple checklist format',
      example: '✓ Feature works as expected'
    },
    'Scenario-Based': {
      description: 'Scenario descriptions',
      example: 'User can successfully complete the action'
    }
  };

  const addCriteria = () => {
    if (newCriteria.storyTitle && newCriteria.criteria.some(c => c.trim())) {
      setCriteriaList([...criteriaList, {
        id: Date.now().toString(),
        ...newCriteria,
        criteria: newCriteria.criteria.filter(c => c.trim()),
        definitionOfDone: newCriteria.definitionOfDone.filter(d => d.trim())
      }]);
      setNewCriteria({
        storyTitle: '',
        criteria: [''],
        definitionOfDone: [''],
        template: 'Given-When-Then',
        priority: 'Must Have'
      });
    }
  };

  const deleteCriteria = (id: string) => {
    setCriteriaList(criteriaList.filter(c => c.id !== id));
  };

  const addCriteriaItem = () => {
    setNewCriteria({
      ...newCriteria,
      criteria: [...newCriteria.criteria, '']
    });
  };

  const updateCriteriaItem = (index: number, value: string) => {
    const updated = [...newCriteria.criteria];
    updated[index] = value;
    setNewCriteria({ ...newCriteria, criteria: updated });
  };

  const removeCriteriaItem = (index: number) => {
    setNewCriteria({
      ...newCriteria,
      criteria: newCriteria.criteria.filter((_, i) => i !== index)
    });
  };

  const addDoDItem = () => {
    setNewCriteria({
      ...newCriteria,
      definitionOfDone: [...newCriteria.definitionOfDone, '']
    });
  };

  const updateDoDItem = (index: number, value: string) => {
    const updated = [...newCriteria.definitionOfDone];
    updated[index] = value;
    setNewCriteria({ ...newCriteria, definitionOfDone: updated });
  };

  const removeDoDItem = (index: number) => {
    setNewCriteria({
      ...newCriteria,
      definitionOfDone: newCriteria.definitionOfDone.filter((_, i) => i !== index)
    });
  };

  const copyCriteriaText = (criteria: AcceptanceCriteria) => {
    const text = `**${criteria.storyTitle}**

**Acceptance Criteria:**
${criteria.criteria.map(c => `- ${c}`).join('\n')}

**Definition of Done:**
${criteria.definitionOfDone.map(d => `- ${d}`).join('\n')}

**Priority:** ${criteria.priority}
**Template:** ${criteria.template}`;

    navigator.clipboard.writeText(text);
  };

  const generateTemplate = (template: string) => {
    switch (template) {
      case 'Given-When-Then':
        return 'Given [initial context], When [action occurs], Then [expected outcome]';
      case 'Checklist':
        return 'Feature requirement is met';
      case 'Scenario-Based':
        return 'User can successfully [action] and [expected result]';
      default:
        return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Must Have': return 'bg-red-100 text-red-800';
      case 'Should Have': return 'bg-yellow-100 text-yellow-800';
      case 'Could Have': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Acceptance Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="User Story Title"
            value={newCriteria.storyTitle}
            onChange={(e) => setNewCriteria({ ...newCriteria, storyTitle: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={newCriteria.template} onValueChange={(value: any) => setNewCriteria({ ...newCriteria, template: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(templates).map(([key, template]) => (
                  <SelectItem key={key} value={key}>
                    {key} - {template.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={newCriteria.priority} onValueChange={(value: any) => setNewCriteria({ ...newCriteria, priority: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Must Have">Must Have</SelectItem>
                <SelectItem value="Should Have">Should Have</SelectItem>
                <SelectItem value="Could Have">Could Have</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium mb-1">Template Example:</p>
            <p className="text-sm text-gray-600">{templates[newCriteria.template].example}</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Acceptance Criteria</label>
              <Button variant="outline" size="sm" onClick={addCriteriaItem}>
                <Plus className="w-4 h-4 mr-1" />Add
              </Button>
            </div>
            {newCriteria.criteria.map((criteria, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Textarea
                  placeholder={generateTemplate(newCriteria.template)}
                  value={criteria}
                  onChange={(e) => updateCriteriaItem(index, e.target.value)}
                  className="flex-1 min-h-[60px]"
                />
                {newCriteria.criteria.length > 1 && (
                  <Button variant="outline" size="sm" onClick={() => removeCriteriaItem(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Definition of Done</label>
              <Button variant="outline" size="sm" onClick={addDoDItem}>
                <Plus className="w-4 h-4 mr-1" />Add
              </Button>
            </div>
            {newCriteria.definitionOfDone.map((dod, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Definition of Done item"
                  value={dod}
                  onChange={(e) => updateDoDItem(index, e.target.value)}
                  className="flex-1"
                />
                {newCriteria.definitionOfDone.length > 1 && (
                  <Button variant="outline" size="sm" onClick={() => removeDoDItem(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button onClick={addCriteria} className="w-full">
            <CheckCircle className="w-4 h-4 mr-2" />Generate Criteria
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Generated Criteria ({criteriaList.length})</h3>
        {criteriaList.map((criteria) => (
          <Card key={criteria.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-lg">{criteria.storyTitle}</h4>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(criteria.priority)}>{criteria.priority}</Badge>
                  <Badge variant="outline">{criteria.template}</Badge>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="font-medium mb-2">Acceptance Criteria:</h5>
                <ul className="space-y-1">
                  {criteria.criteria.map((criterion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {criteria.definitionOfDone.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium mb-2">Definition of Done:</h5>
                  <ul className="space-y-1">
                    {criteria.definitionOfDone.map((dod, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>{dod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => copyCriteriaText(criteria)}>
                  <Copy className="w-4 h-4 mr-1" />Copy
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteCriteria(criteria.id)}>
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