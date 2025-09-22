import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, User, Calendar, Percent } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  role: string;
  email: string;
  capacity: number; // hours per week
  currentAllocation: number; // percentage
  skills: string[];
}

interface Assignment {
  id: string;
  resourceId: string;
  projectName: string;
  taskName: string;
  allocation: number; // percentage
  startDate: string;
  endDate: string;
}

export const ResourceAllocationTool: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'Frontend Developer',
      email: 'john@example.com',
      capacity: 40,
      currentAllocation: 80,
      skills: ['React', 'TypeScript', 'CSS']
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Backend Developer',
      email: 'jane@example.com',
      capacity: 40,
      currentAllocation: 60,
      skills: ['Node.js', 'Python', 'SQL']
    },
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'UI/UX Designer',
      email: 'mike@example.com',
      capacity: 40,
      currentAllocation: 40,
      skills: ['Figma', 'Sketch', 'Prototyping']
    }
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      resourceId: '1',
      projectName: 'Web App',
      taskName: 'Frontend Development',
      allocation: 80,
      startDate: '2024-01-15',
      endDate: '2024-03-15'
    }
  ]);

  const [newResource, setNewResource] = useState({
    name: '',
    role: '',
    email: '',
    capacity: 40,
    skills: ''
  });

  const addResource = () => {
    if (newResource.name && newResource.role) {
      const resource: Resource = {
        id: Date.now().toString(),
        ...newResource,
        currentAllocation: 0,
        skills: newResource.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      setResources([...resources, resource]);
      setNewResource({ name: '', role: '', email: '', capacity: 40, skills: '' });
    }
  };

  const getAvailabilityColor = (allocation: number) => {
    if (allocation >= 90) return 'bg-red-100 text-red-800';
    if (allocation >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getAvailabilityText = (allocation: number) => {
    if (allocation >= 90) return 'Overallocated';
    if (allocation >= 70) return 'Busy';
    return 'Available';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">👥 Resource Allocation Tool</h2>
        <p className="text-gray-600">Manage team resources and assignments</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Resource
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Name"
              value={newResource.name}
              onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
            />
            <Input
              placeholder="Role"
              value={newResource.role}
              onChange={(e) => setNewResource({ ...newResource, role: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={newResource.email}
              onChange={(e) => setNewResource({ ...newResource, email: e.target.value })}
            />
            <Input
              placeholder="Weekly Capacity (hours)"
              type="number"
              value={newResource.capacity}
              onChange={(e) => setNewResource({ ...newResource, capacity: parseInt(e.target.value) || 40 })}
            />
            <Input
              placeholder="Skills (comma separated)"
              value={newResource.skills}
              onChange={(e) => setNewResource({ ...newResource, skills: e.target.value })}
              className="md:col-span-2"
            />
          </div>
          <Button onClick={addResource}>Add Resource</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <Card key={resource.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  <div>
                    <CardTitle className="text-lg">{resource.name}</CardTitle>
                    <p className="text-sm text-gray-600">{resource.role}</p>
                  </div>
                </div>
                <Badge className={getAvailabilityColor(resource.currentAllocation)}>
                  {getAvailabilityText(resource.currentAllocation)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{resource.capacity}h/week capacity</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Percent className="w-4 h-4" />
                  <span>{resource.currentAllocation}% allocated</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      resource.currentAllocation >= 90 ? 'bg-red-500' :
                      resource.currentAllocation >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(resource.currentAllocation, 100)}%` }}
                  ></div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {resource.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {resource.email}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};