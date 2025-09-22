import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Copy, FileText, Plus, Trash2, Calendar } from 'lucide-react';

interface ReleaseNote {
  id: string;
  version: string;
  releaseDate: string;
  title: string;
  summary: string;
  features: string[];
  improvements: string[];
  bugFixes: string[];
  breakingChanges: string[];
  knownIssues: string[];
  template: 'Standard' | 'Technical' | 'Marketing' | 'Minimal';
}

export default function ReleaseNotesGenerator() {
  const [releases, setReleases] = useState<ReleaseNote[]>([
    {
      id: '1',
      version: '1.2.0',
      releaseDate: '2024-01-15',
      title: 'Enhanced User Experience',
      summary: 'This release focuses on improving user experience with new features and performance enhancements.',
      features: ['New dashboard design', 'Advanced search functionality', 'Mobile responsive layout'],
      improvements: ['Faster page load times', 'Better error handling', 'Improved accessibility'],
      bugFixes: ['Fixed login issue on Safari', 'Resolved data sync problems', 'Fixed mobile navigation'],
      breakingChanges: ['API endpoint /v1/users deprecated'],
      knownIssues: ['Minor display issue on IE11'],
      template: 'Standard'
    }
  ]);

  const [newRelease, setNewRelease] = useState({
    version: '',
    releaseDate: new Date().toISOString().split('T')[0],
    title: '',
    summary: '',
    features: [''],
    improvements: [''],
    bugFixes: [''],
    breakingChanges: [''],
    knownIssues: [''],
    template: 'Standard' as const
  });

  const templates = {
    'Standard': 'Comprehensive release notes with all sections',
    'Technical': 'Detailed technical information for developers',
    'Marketing': 'User-friendly format focused on benefits',
    'Minimal': 'Brief summary with key changes only'
  };

  const addRelease = () => {
    if (newRelease.version && newRelease.title) {
      setReleases([...releases, {
        id: Date.now().toString(),
        ...newRelease,
        features: newRelease.features.filter(f => f.trim()),
        improvements: newRelease.improvements.filter(i => i.trim()),
        bugFixes: newRelease.bugFixes.filter(b => b.trim()),
        breakingChanges: newRelease.breakingChanges.filter(b => b.trim()),
        knownIssues: newRelease.knownIssues.filter(k => k.trim())
      }]);
      setNewRelease({
        version: '',
        releaseDate: new Date().toISOString().split('T')[0],
        title: '',
        summary: '',
        features: [''],
        improvements: [''],
        bugFixes: [''],
        breakingChanges: [''],
        knownIssues: [''],
        template: 'Standard'
      });
    }
  };

  const deleteRelease = (id: string) => {
    setReleases(releases.filter(r => r.id !== id));
  };

  const addArrayItem = (field: keyof Pick<typeof newRelease, 'features' | 'improvements' | 'bugFixes' | 'breakingChanges' | 'knownIssues'>) => {
    setNewRelease({
      ...newRelease,
      [field]: [...newRelease[field], '']
    });
  };

  const updateArrayItem = (field: keyof Pick<typeof newRelease, 'features' | 'improvements' | 'bugFixes' | 'breakingChanges' | 'knownIssues'>, index: number, value: string) => {
    const updated = [...newRelease[field]];
    updated[index] = value;
    setNewRelease({ ...newRelease, [field]: updated });
  };

  const removeArrayItem = (field: keyof Pick<typeof newRelease, 'features' | 'improvements' | 'bugFixes' | 'breakingChanges' | 'knownIssues'>, index: number) => {
    setNewRelease({
      ...newRelease,
      [field]: newRelease[field].filter((_, i) => i !== index)
    });
  };

  const generateReleaseText = (release: ReleaseNote) => {
    const sections = [];
    
    sections.push(`# ${release.title} - v${release.version}`);
    sections.push(`**Release Date:** ${new Date(release.releaseDate).toLocaleDateString()}`);
    sections.push('');
    sections.push(release.summary);
    sections.push('');

    if (release.features.length > 0) {
      sections.push('## ✨ New Features');
      release.features.forEach(feature => sections.push(`- ${feature}`));
      sections.push('');
    }

    if (release.improvements.length > 0) {
      sections.push('## 🚀 Improvements');
      release.improvements.forEach(improvement => sections.push(`- ${improvement}`));
      sections.push('');
    }

    if (release.bugFixes.length > 0) {
      sections.push('## 🐛 Bug Fixes');
      release.bugFixes.forEach(fix => sections.push(`- ${fix}`));
      sections.push('');
    }

    if (release.breakingChanges.length > 0) {
      sections.push('## ⚠️ Breaking Changes');
      release.breakingChanges.forEach(change => sections.push(`- ${change}`));
      sections.push('');
    }

    if (release.knownIssues.length > 0) {
      sections.push('## 🚨 Known Issues');
      release.knownIssues.forEach(issue => sections.push(`- ${issue}`));
    }

    return sections.join('\n');
  };

  const copyReleaseText = (release: ReleaseNote) => {
    navigator.clipboard.writeText(generateReleaseText(release));
  };

  const fieldLabels = {
    features: 'New Features',
    improvements: 'Improvements',
    bugFixes: 'Bug Fixes',
    breakingChanges: 'Breaking Changes',
    knownIssues: 'Known Issues'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Release Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Version (e.g., 1.2.0)"
              value={newRelease.version}
              onChange={(e) => setNewRelease({ ...newRelease, version: e.target.value })}
            />
            <Input
              type="date"
              value={newRelease.releaseDate}
              onChange={(e) => setNewRelease({ ...newRelease, releaseDate: e.target.value })}
            />
            <Select value={newRelease.template} onValueChange={(value: any) => setNewRelease({ ...newRelease, template: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(templates).map(([key, description]) => (
                  <SelectItem key={key} value={key}>
                    {key} - {description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            placeholder="Release Title"
            value={newRelease.title}
            onChange={(e) => setNewRelease({ ...newRelease, title: e.target.value })}
          />

          <Textarea
            placeholder="Release Summary"
            value={newRelease.summary}
            onChange={(e) => setNewRelease({ ...newRelease, summary: e.target.value })}
            className="min-h-[80px]"
          />

          {(Object.keys(fieldLabels) as Array<keyof typeof fieldLabels>).map((field) => (
            <div key={field}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">{fieldLabels[field]}</label>
                <Button variant="outline" size="sm" onClick={() => addArrayItem(field)}>
                  <Plus className="w-4 h-4 mr-1" />Add
                </Button>
              </div>
              {newRelease[field].map((item: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder={`Enter ${fieldLabels[field].toLowerCase()}`}
                    value={item}
                    onChange={(e) => updateArrayItem(field, index, e.target.value)}
                    className="flex-1"
                  />
                  {newRelease[field].length > 1 && (
                    <Button variant="outline" size="sm" onClick={() => removeArrayItem(field, index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ))}

          <Button onClick={addRelease} className="w-full">
            <FileText className="w-4 h-4 mr-2" />Generate Release Notes
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Generated Release Notes ({releases.length})</h3>
        {releases.map((release) => (
          <Card key={release.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{release.title} - v{release.version}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{new Date(release.releaseDate).toLocaleDateString()}</span>
                    <Badge variant="outline">{release.template}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyReleaseText(release)}>
                    <Copy className="w-4 h-4 mr-1" />Copy
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteRelease(release.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{release.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {release.features.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2 text-green-700">✨ New Features</h5>
                    <ul className="text-sm space-y-1">
                      {release.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.improvements.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2 text-blue-700">🚀 Improvements</h5>
                    <ul className="text-sm space-y-1">
                      {release.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.bugFixes.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2 text-orange-700">🐛 Bug Fixes</h5>
                    <ul className="text-sm space-y-1">
                      {release.bugFixes.map((fix, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-500">•</span>
                          <span>{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {release.breakingChanges.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2 text-red-700">⚠️ Breaking Changes</h5>
                    <ul className="text-sm space-y-1">
                      {release.breakingChanges.map((change, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {release.knownIssues.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2 text-yellow-700">🚨 Known Issues</h5>
                  <ul className="text-sm space-y-1">
                    {release.knownIssues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}