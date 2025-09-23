import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Plus, Trash2, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Feedback {
  id: string;
  title: string;
  content: string;
  category: 'process' | 'team' | 'tools' | 'communication' | 'other';
  type: 'positive' | 'negative' | 'suggestion';
  author: string;
  isAnonymous: boolean;
  timestamp: string;
  likes: number;
  dislikes: number;
}

const TeamFeedbackCollector: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      title: 'Great Sprint Planning',
      content: 'The new sprint planning format really helped us estimate better and understand requirements.',
      category: 'process',
      type: 'positive',
      author: 'Sarah',
      isAnonymous: false,
      timestamp: '2024-01-15T10:30:00Z',
      likes: 5,
      dislikes: 0
    },
    {
      id: '2',
      title: 'Standup Improvements Needed',
      content: 'Daily standups are running too long. We should focus more on blockers and less on detailed updates.',
      category: 'process',
      type: 'suggestion',
      author: 'Anonymous',
      isAnonymous: true,
      timestamp: '2024-01-14T14:20:00Z',
      likes: 3,
      dislikes: 1
    }
  ]);

  const [newFeedback, setNewFeedback] = useState<Partial<Feedback>>({
    title: '',
    content: '',
    category: 'other',
    type: 'suggestion',
    author: '',
    isAnonymous: false
  });

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const addFeedback = () => {
    if (newFeedback.title && newFeedback.content) {
      const feedback: Feedback = {
        id: Date.now().toString(),
        title: newFeedback.title,
        content: newFeedback.content,
        category: newFeedback.category as 'team' | 'process' | 'tools' | 'communication' | 'other',
        type: newFeedback.type as 'positive' | 'negative' | 'suggestion',
        author: newFeedback.isAnonymous ? 'Anonymous' : (newFeedback.author || 'Anonymous'),
        isAnonymous: newFeedback.isAnonymous || false,
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0
      };
      setFeedbacks([feedback, ...feedbacks]);
      setNewFeedback({
        title: '',
        content: '',
        category: 'other',
        type: 'suggestion',
        author: '',
        isAnonymous: false
      });
    }
  };

  const removeFeedback = (id: string) => {
    setFeedbacks(feedbacks.filter(feedback => feedback.id !== id));
  };

  const voteFeedback = (id: string, voteType: 'like' | 'dislike') => {
    setFeedbacks(feedbacks.map(feedback => {
      if (feedback.id === id) {
        return {
          ...feedback,
          likes: voteType === 'like' ? feedback.likes + 1 : feedback.likes,
          dislikes: voteType === 'dislike' ? feedback.dislikes + 1 : feedback.dislikes
        };
      }
      return feedback;
    }));
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesCategory = filterCategory === 'all' || feedback.category === filterCategory;
    const matchesType = filterType === 'all' || feedback.type === filterType;
    return matchesCategory && matchesType;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'process': return 'bg-blue-100 text-blue-800';
      case 'team': return 'bg-green-100 text-green-800';
      case 'tools': return 'bg-purple-100 text-purple-800';
      case 'communication': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'suggestion': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💬</span>
            Team Feedback Collector
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submit Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="feedback-title">Feedback Title</Label>
                <Input
                  id="feedback-title"
                  value={newFeedback.title || ''}
                  onChange={(e) => setNewFeedback({...newFeedback, title: e.target.value})}
                  placeholder="Brief summary of your feedback"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="feedback-category">Category</Label>
                  <Select value={newFeedback.category} onValueChange={(value) => setNewFeedback({...newFeedback, category: value as 'team' | 'process' | 'tools' | 'communication' | 'other'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="process">Process</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="tools">Tools</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="feedback-type">Type</Label>
                  <Select value={newFeedback.type} onValueChange={(value) => setNewFeedback({...newFeedback, type: value as 'positive' | 'negative' | 'suggestion'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="negative">Concern</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="feedback-content">Feedback Details</Label>
                <Textarea
                  id="feedback-content"
                  value={newFeedback.content || ''}
                  onChange={(e) => setNewFeedback({...newFeedback, content: e.target.value})}
                  placeholder="Provide detailed feedback..."
                  rows={4}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="anonymous"
                    checked={newFeedback.isAnonymous || false}
                    onCheckedChange={(checked) => setNewFeedback({...newFeedback, isAnonymous: checked})}
                  />
                  <Label htmlFor="anonymous">Submit anonymously</Label>
                </div>
                
                {!newFeedback.isAnonymous && (
                  <div className="flex-1 ml-4">
                    <Input
                      value={newFeedback.author || ''}
                      onChange={(e) => setNewFeedback({...newFeedback, author: e.target.value})}
                      placeholder="Your name (optional)"
                    />
                  </div>
                )}
              </div>
              
              <Button onClick={addFeedback} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex gap-4">
            <div>
              <Label htmlFor="filter-category">Filter by Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="process">Process</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-type">Filter by Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Concerns</SelectItem>
                  <SelectItem value="suggestion">Suggestions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {filteredFeedbacks.map(feedback => (
              <Card key={feedback.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{feedback.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getCategoryColor(feedback.category)}>
                          {feedback.category}
                        </Badge>
                        <Badge className={getTypeColor(feedback.type)}>
                          {feedback.type}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          by {feedback.author} • {formatDate(feedback.timestamp)}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeFeedback(feedback.id)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{feedback.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => voteFeedback(feedback.id, 'like')}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {feedback.likes}
                    </Button>
                    <Button
                      onClick={() => voteFeedback(feedback.id, 'dislike')}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      {feedback.dislikes}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredFeedbacks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No feedback found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamFeedbackCollector;