import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface RACIEntry {
  taskId: string;
  personId: string;
  role: 'R' | 'A' | 'C' | 'I' | '';
}

interface Task {
  id: string;
  name: string;
}

interface Person {
  id: string;
  name: string;
}

const RACIMatrixBuilder: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Requirements Gathering' },
    { id: '2', name: 'Design Review' },
    { id: '3', name: 'Development' },
    { id: '4', name: 'Testing' },
    { id: '5', name: 'Deployment' }
  ]);

  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: 'Project Manager' },
    { id: '2', name: 'Business Analyst' },
    { id: '3', name: 'Developer' },
    { id: '4', name: 'QA Tester' },
    { id: '5', name: 'Stakeholder' }
  ]);

  const [raciMatrix, setRaciMatrix] = useState<RACIEntry[]>([
    { taskId: '1', personId: '1', role: 'A' },
    { taskId: '1', personId: '2', role: 'R' },
    { taskId: '1', personId: '5', role: 'C' },
    { taskId: '3', personId: '3', role: 'R' },
    { taskId: '3', personId: '1', role: 'A' },
    { taskId: '4', personId: '4', role: 'R' },
    { taskId: '4', personId: '1', role: 'A' }
  ]);

  const [newTask, setNewTask] = useState('');
  const [newPerson, setNewPerson] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = { id: Date.now().toString(), name: newTask };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const addPerson = () => {
    if (newPerson.trim()) {
      const person: Person = { id: Date.now().toString(), name: newPerson };
      setPeople([...people, person]);
      setNewPerson('');
    }
  };

  const updateRACIRole = (taskId: string, personId: string, role: 'R' | 'A' | 'C' | 'I' | '') => {
    const existingEntry = raciMatrix.find(entry => entry.taskId === taskId && entry.personId === personId);
    
    if (existingEntry) {
      if (role === '') {
        setRaciMatrix(raciMatrix.filter(entry => !(entry.taskId === taskId && entry.personId === personId)));
      } else {
        setRaciMatrix(raciMatrix.map(entry => 
          entry.taskId === taskId && entry.personId === personId 
            ? { ...entry, role } 
            : entry
        ));
      }
    } else if (role !== '') {
      setRaciMatrix([...raciMatrix, { taskId, personId, role }]);
    }
  };

  const getRACIRole = (taskId: string, personId: string): 'R' | 'A' | 'C' | 'I' | '' => {
    const entry = raciMatrix.find(entry => entry.taskId === taskId && entry.personId === personId);
    return entry?.role || '';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'R': return 'bg-blue-500 text-white';
      case 'A': return 'bg-green-500 text-white';
      case 'C': return 'bg-yellow-500 text-white';
      case 'I': return 'bg-gray-500 text-white';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">📊 RACI Matrix Builder</h2>
        <p className="text-gray-600">Define roles and responsibilities for project tasks</p>
        <div className="mt-2 text-sm text-gray-500">
          <span className="font-medium">R</span>esponsible, <span className="font-medium">A</span>ccountable, 
          <span className="font-medium">C</span>onsulted, <span className="font-medium">I</span>nformed
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Task name"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addTask}>Add</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Person/Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Person/Role name"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addPerson}>Add</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>RACI Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-50 text-left font-medium">Tasks</th>
                  {people.map(person => (
                    <th key={person.id} className="border p-2 bg-gray-50 text-center font-medium min-w-[120px]">
                      {person.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td className="border p-2 font-medium">{task.name}</td>
                    {people.map(person => (
                      <td key={person.id} className="border p-1 text-center">
                        <select
                          value={getRACIRole(task.id, person.id)}
                          onChange={(e) => updateRACIRole(task.id, person.id, e.target.value as any)}
                          className={`w-full p-1 rounded text-center font-bold ${getRoleColor(getRACIRole(task.id, person.id))}`}
                        >
                          <option value="">-</option>
                          <option value="R">R</option>
                          <option value="A">A</option>
                          <option value="C">C</option>
                          <option value="I">I</option>
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RACIMatrixBuilder;