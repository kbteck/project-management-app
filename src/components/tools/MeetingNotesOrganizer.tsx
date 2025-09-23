import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Search, Calendar, Users } from 'lucide-react';

interface MeetingNote {
  id: string;
  title: string;
  date: string;
  type: 'standup' | 'planning' | 'retrospective' | 'review' | 'other';
  project: string;
  attendees: string[];
  notes: string;
  actionItems: string[];
}

const MeetingNotesOrganizer: React.FC = () => {
  const [notes, setNotes] = useState<MeetingNote[]>([
    {
      id: '1',
      title: 'Sprint Planning - Sprint 5',
      date: '2024-01-15',
      type: 'planning',
      project: 'Web App',
      attendees: ['John', 'Sarah', 'Mike'],
      notes: 'Discussed user stories for upcoming sprint. Estimated 32 story points total.',
      actionItems: ['Create detailed acceptance criteria', 'Set up development environment']
    }
  ]);

  const [newNote, setNewNote] = useState<Partial<MeetingNote>>({
    title: '',
    date: '',
    type: 'other',
    project: '',
    attendees: [],
    notes: '',
    actionItems: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');

  const addNote = () => {
    if (newNote.title && newNote.date && newNote.notes) {
      const note: MeetingNote = {
        id: Date.now().toString(),
        title: newNote.title,
        date: newNote.date,
        type: newNote.type as 'standup' | 'planning' | 'retrospective' | 'review' | 'other',
        project: newNote.project || '',
        attendees: newNote.attendees || [],
        notes: newNote.notes,
        actionItems: newNote.actionItems || []
      };
      setNotes([note, ...notes]);
      setNewNote({
        title: '',
        date: '',
        type: 'other',
        project: '',
        attendees: [],
        notes: '',
        actionItems: []
      });
    }
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const updateAttendees = (value: string) => {
    const attendees = value.split(',').map(a => a.trim()).filter(a => a);
    setNewNote({...newNote, attendees});
  };

  const updateActionItems = (value: string) => {
    const actionItems = value.split('\n').filter(item => item.trim());
    setNewNote({...newNote, actionItems});
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || note.type === filterType;
    const matchesProject = filterProject === 'all' || note.project === filterProject;
    
    return matchesSearch && matchesType && matchesProject;
  });

  const projects = Array.from(new Set(notes.map(note => note.project).filter(p => p)));
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standup': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-green-100 text-green-800';
      case 'retrospective': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📝</span>
            Meeting Notes Organizer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Note */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Meeting Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meeting-title">Meeting Title</Label>
                  <Input
                    id="meeting-title"
                    value={newNote.title || ''}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    placeholder="Sprint Planning Meeting"
                  />
                </div>
                <div>
                  <Label htmlFor="meeting-date">Date</Label>
                  <Input
                    id="meeting-date"
                    type="date"
                    value={newNote.date || ''}
                    onChange={(e) => setNewNote({...newNote, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meeting-type">Meeting Type</Label>
                  <Select value={newNote.type} onValueChange={(value) => setNewNote({...newNote, type: value as 'standup' | 'planning' | 'retrospective' | 'review' | 'other'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standup">Daily Standup</SelectItem>
                      <SelectItem value="planning">Sprint Planning</SelectItem>
                      <SelectItem value="retrospective">Retrospective</SelectItem>
                      <SelectItem value="review">Sprint Review</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="project">Project</Label>
                  <Input
                    id="project"
                    value={newNote.project || ''}
                    onChange={(e) => setNewNote({...newNote, project: e.target.value})}
                    placeholder="Project name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="attendees">Attendees (comma-separated)</Label>
                <Input
                  id="attendees"
                  value={newNote.attendees?.join(', ') || ''}
                  onChange={(e) => updateAttendees(e.target.value)}
                  placeholder="John, Sarah, Mike"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Meeting Notes</Label>
                <Textarea
                  id="notes"
                  value={newNote.notes || ''}
                  onChange={(e) => setNewNote({...newNote, notes: e.target.value})}
                  placeholder="Key discussion points, decisions made..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="action-items">Action Items (one per line)</Label>
                <Textarea
                  id="action-items"
                  value={newNote.actionItems?.join('\n') || ''}
                  onChange={(e) => updateActionItems(e.target.value)}
                  placeholder="Create user stories&#10;Schedule follow-up meeting&#10;Update documentation"
                  rows={3}
                />
              </div>
              
              <Button onClick={addNote} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Meeting Note
              </Button>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Search Notes</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or content..."
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filter-type">Filter by Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standup">Standup</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="retrospective">Retrospective</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-project">Filter by Project</Label>
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project} value={project}>{project}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-4">
            {filteredNotes.map(note => (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getTypeColor(note.type)}>
                          {note.type}
                        </Badge>
                        {note.project && (
                          <Badge variant="outline">{note.project}</Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {note.date}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {note.attendees.length} attendees
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeNote(note.id)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{note.notes}</p>
                  </div>
                  
                  {note.attendees.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Attendees</h4>
                      <div className="flex flex-wrap gap-1">
                        {note.attendees.map((attendee, index) => (
                          <Badge key={index} variant="secondary">{attendee}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {note.actionItems.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Action Items</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {note.actionItems.map((item, index) => (
                          <li key={index} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {filteredNotes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No meeting notes found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingNotesOrganizer;