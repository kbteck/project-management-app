export interface Tool {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ToolCategory {
  id: string;
  title: string;
  icon: string;
  tools: Tool[];
}

export const toolCategories: ToolCategory[] = [
  {
    id: 'project-management',
    title: 'Project Management Tools',
    icon: '📦',
    tools: [
      { id: 'timeline', icon: '📅', title: 'Project Timeline Viewer', description: 'Visualize project timelines and milestones' },
      { id: 'wbs', icon: '🏗️', title: 'Work Breakdown Structure', description: 'Break down work into manageable components' },
      { id: 'charter', icon: '📋', title: 'Project Charter Generator', description: 'Create comprehensive project charters' },
      { id: 'milestones', icon: '🎯', title: 'Milestone Tracker', description: 'Track and manage project milestones' },
      { id: 'resources', icon: '👥', title: 'Resource Allocation Tool', description: 'Manage team resources and assignments' },
      { id: 'raci', icon: '📊', title: 'RACI Matrix Builder', description: 'Define roles and responsibilities' },
    ]
  },
  {
    id: 'agile-scrum',
    title: 'Agile Planning & Scrum Tools',
    icon: '📊',
    tools: [
      { id: 'kanban', icon: '📋', title: 'Kanban Board', description: 'Visual workflow management' },
      { id: 'sprint-board', icon: '🏃', title: 'Scrum Sprint Board', description: 'Manage sprint tasks and progress' },
      { id: 'sprint-planning', icon: '📝', title: 'Sprint Planning Assistant', description: 'Plan and organize sprints effectively' },
      { id: 'standup', icon: '🗣️', title: 'Daily Standup Log', description: 'Track daily standup meetings' },
      { id: 'user-story-map', icon: '🗺️', title: 'User Story Mapping Tool', description: 'Map user journeys and stories' },
      { id: 'dependencies', icon: '🔗', title: 'Task Dependency Mapper', description: 'Visualize task dependencies' },
    ]
  },
  {
    id: 'estimation-retrospectives',
    title: 'Agile Estimation & Retrospectives',
    icon: '📈',
    tools: [
      { id: 'planning-poker', icon: '🃏', title: 'Planning Poker', description: 'Point-based estimation game with remote voting' },
      { id: 'tshirt-sizing', icon: '👕', title: 'T-Shirt Sizing Tool', description: 'Simplified relative sizing (XS to XL)' },
      { id: 'affinity-estimation', icon: '📊', title: 'Affinity Estimation Tool', description: 'Drag stories into groups based on effort' },
      { id: 'retrospective-board', icon: '🔄', title: 'Retrospective Board', description: 'Structured templates (Start, Stop, Continue; Glad, Sad, Mad; 4Ls)' },
      { id: 'dot-voting', icon: '🔴', title: 'Dot Voting Tool', description: 'Let team members vote on issues to address' },
      { id: 'retro-actions', icon: '✅', title: 'Retro Action Item Tracker', description: 'Assign follow-ups and improvements' },
    ]
  },
  {
    id: 'requirements-documentation',
    title: 'Requirements & Documentation',
    icon: '📝',
    tools: [
      { id: 'backlog-manager', icon: '📚', title: 'Backlog Manager', description: 'Prioritize, filter, and manage product backlog' },
      { id: 'user-story-creator', icon: '📖', title: 'User Story Creator', description: 'Create stories using the "As a… I want… so that…" template' },
      { id: 'acceptance-criteria', icon: '✔️', title: 'Acceptance Criteria Template Generator', description: 'Define DoD and acceptance rules' },
      { id: 'sprint-goal-writer', icon: '🎯', title: 'Sprint Goal Writer', description: 'Assist in drafting focused sprint goals' },
      { id: 'release-notes', icon: '📄', title: 'Release Notes Generator', description: 'Summarize features and changes post-release' },
    ]
  },
  {
    id: 'time-productivity',
    title: 'Time & Productivity Tools',
    icon: '🕒',
    tools: [
      { id: 'pomodoro', icon: '🍅', title: 'Pomodoro Timer', description: 'Boost productivity with time-boxed sessions' },
      { id: 'task-timer', icon: '⏱️', title: 'Task Timer & Stopwatch', description: 'Track task durations in real-time' },
      { id: 'countdown', icon: '⏰', title: 'Countdown Timer', description: 'Time-box meetings or sessions' },
      { id: 'burndown-chart', icon: '📉', title: 'Burnup/Burndown Chart Generator', description: 'Visualize progress per sprint/release' },
      { id: 'velocity-tracker', icon: '📈', title: 'Velocity Tracker', description: 'Track and analyze past team velocities' },
      { id: 'cycle-time', icon: '🔄', title: 'Cycle Time Calculator', description: 'Time it takes for a task to go from "Start" to "Done"' },
    ]
  },
  {
    id: 'communication-feedback',
    title: 'Communication & Feedback Tools',
    icon: '📬',
    tools: [
      { id: 'meeting-notes', icon: '📝', title: 'Meeting Notes Organizer', description: 'Save notes by date, project, or type' },
      { id: 'team-feedback', icon: '💬', title: 'Team Feedback Collector', description: 'Anonymous or public feedback from team' },
      { id: 'mood-tracker', icon: '😊', title: 'Mood Tracker / Team Sentiment Check', description: 'Pulse-check team morale' },
      { id: 'sprint-summary', icon: '📊', title: 'Sprint Summary Report Generator', description: 'Export key metrics and updates' },
      { id: 'team-performance', icon: '📈', title: 'Team Performance Dashboard', description: 'Visual KPI tracking (velocity, story completion, bugs, etc)' },
      { id: 'risk-register', icon: '⚠️', title: 'Risk Register Tool', description: 'Track and manage project risks' },
    ]
  }
];