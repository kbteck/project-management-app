import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Download, Save } from 'lucide-react';

interface ProjectCharter {
  projectName: string;
  projectManager: string;
  sponsor: string;
  startDate: string;
  endDate: string;
  budget: string;
  objectives: string;
  scope: string;
  deliverables: string;
  assumptions: string;
  constraints: string;
  risks: string;
}

export const ProjectCharterGenerator: React.FC = () => {
  const [charter, setCharter] = useState<ProjectCharter>({
    projectName: '',
    projectManager: '',
    sponsor: '',
    startDate: '',
    endDate: '',
    budget: '',
    objectives: '',
    scope: '',
    deliverables: '',
    assumptions: '',
    constraints: '',
    risks: ''
  });

  const updateField = (field: keyof ProjectCharter, value: string) => {
    setCharter(prev => ({ ...prev, [field]: value }));
  };

  const exportCharter = () => {
    const content = `
PROJECT CHARTER

Project Name: ${charter.projectName}
Project Manager: ${charter.projectManager}
Sponsor: ${charter.sponsor}
Start Date: ${charter.startDate}
End Date: ${charter.endDate}
Budget: ${charter.budget}

PROJECT OBJECTIVES:
${charter.objectives}

PROJECT SCOPE:
${charter.scope}

DELIVERABLES:
${charter.deliverables}

ASSUMPTIONS:
${charter.assumptions}

CONSTRAINTS:
${charter.constraints}

RISKS:
${charter.risks}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${charter.projectName || 'project'}-charter.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">📋 Project Charter Generator</h2>
        <p className="text-gray-600">Create comprehensive project charters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Project Name"
              value={charter.projectName}
              onChange={(e) => updateField('projectName', e.target.value)}
            />
            <Input
              placeholder="Project Manager"
              value={charter.projectManager}
              onChange={(e) => updateField('projectManager', e.target.value)}
            />
            <Input
              placeholder="Project Sponsor"
              value={charter.sponsor}
              onChange={(e) => updateField('sponsor', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="Start Date"
                value={charter.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
              />
              <Input
                type="date"
                placeholder="End Date"
                value={charter.endDate}
                onChange={(e) => updateField('endDate', e.target.value)}
              />
            </div>
            <Input
              placeholder="Budget"
              value={charter.budget}
              onChange={(e) => updateField('budget', e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Project Objectives"
              value={charter.objectives}
              onChange={(e) => updateField('objectives', e.target.value)}
              rows={3}
            />
            <Textarea
              placeholder="Project Scope"
              value={charter.scope}
              onChange={(e) => updateField('scope', e.target.value)}
              rows={3}
            />
            <Textarea
              placeholder="Key Deliverables"
              value={charter.deliverables}
              onChange={(e) => updateField('deliverables', e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Assumptions"
            value={charter.assumptions}
            onChange={(e) => updateField('assumptions', e.target.value)}
            rows={2}
          />
          <Textarea
            placeholder="Constraints"
            value={charter.constraints}
            onChange={(e) => updateField('constraints', e.target.value)}
            rows={2}
          />
          <Textarea
            placeholder="Identified Risks"
            value={charter.risks}
            onChange={(e) => updateField('risks', e.target.value)}
            rows={2}
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={exportCharter} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Charter
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Draft
        </Button>
      </div>
    </div>
  );
};