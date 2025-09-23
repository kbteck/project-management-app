import React, { Suspense } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toolCategories } from '@/data/toolsData';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

// Lazy load tool components - simplified imports
const ProjectTimelineViewer = React.lazy(() => import('./tools/ProjectTimelineViewer'));
const WorkBreakdownStructure = React.lazy(() => import('./tools/WorkBreakdownStructure'));
const ProjectCharterGenerator = React.lazy(() => import('./tools/ProjectCharterGenerator'));
const MilestoneTracker = React.lazy(() => import('./tools/MilestoneTracker'));
const ResourceAllocationTool = React.lazy(() => import('./tools/ResourceAllocationTool'));
const RACIMatrixBuilder = React.lazy(() => import('./tools/RACIMatrixBuilder'));
const KanbanBoard = React.lazy(() => import('./tools/KanbanBoard'));
const ScrumSprintBoard = React.lazy(() => import('./tools/ScrumSprintBoard'));
const SprintPlanningAssistant = React.lazy(() => import('./tools/SprintPlanningAssistant'));
const DailyStandupLog = React.lazy(() => import('./tools/DailyStandupLog'));
const UserStoryMappingTool = React.lazy(() => import('./tools/UserStoryMappingTool'));
const TaskDependencyMapper = React.lazy(() => import('./tools/TaskDependencyMapper'));
const PlanningPoker = React.lazy(() => import('./tools/PlanningPoker'));
const TShirtSizing = React.lazy(() => import('./tools/TShirtSizing'));
const AffinityEstimation = React.lazy(() => import('./tools/AffinityEstimation'));
const RetrospectiveBoard = React.lazy(() => import('./tools/RetrospectiveBoard'));
const DotVoting = React.lazy(() => import('./tools/DotVoting'));
const RetroActionTracker = React.lazy(() => import('./tools/RetroActionTracker'));
const BacklogManager = React.lazy(() => import('./tools/BacklogManager'));
const UserStoryCreator = React.lazy(() => import('./tools/UserStoryCreator'));
const AcceptanceCriteriaGenerator = React.lazy(() => import('./tools/AcceptanceCriteriaGenerator'));
const SprintGoalWriter = React.lazy(() => import('./tools/SprintGoalWriter'));
const ReleaseNotesGenerator = React.lazy(() => import('./tools/ReleaseNotesGenerator'));
const PomodoroTimer = React.lazy(() => import('./tools/PomodoroTimer'));
const CountdownTimer = React.lazy(() => import('./tools/CountdownTimer'));
const BurndownChart = React.lazy(() => import('./tools/BurndownChart'));
const VelocityTracker = React.lazy(() => import('./tools/VelocityTracker'));
const CycleTimeCalculator = React.lazy(() => import('./tools/CycleTimeCalculator'));
const MeetingNotesOrganizer = React.lazy(() => import('./tools/MeetingNotesOrganizer'));
const TeamFeedbackCollector = React.lazy(() => import('./tools/TeamFeedbackCollector'));
const MoodTracker = React.lazy(() => import('./tools/MoodTracker'));
const SprintSummaryReportGenerator = React.lazy(() => import('./tools/SprintSummaryReportGenerator'));
const TeamPerformanceDashboard = React.lazy(() => import('./tools/TeamPerformanceDashboard'));
const RiskRegisterTool = React.lazy(() => import('./tools/RiskRegisterTool'));
const TaskTimer = React.lazy(() => import('./tools/TaskTimer'));

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolTitle: string;
  toolIcon: string;
  toolId: string;
}

const ToolModal: React.FC<ToolModalProps> = ({ isOpen, onClose, toolTitle, toolIcon, toolId }) => {
  // Get all tool IDs dynamically from toolsData instead of hardcoding
  const allToolIds = toolCategories.flatMap(category => category.tools.map(tool => tool.id));

  const renderToolContent = () => {
    switch (toolId) {
      case 'timeline':
        return <ProjectTimelineViewer />;
      case 'wbs':
        return <WorkBreakdownStructure />;
      case 'charter':
        return <ProjectCharterGenerator />;
      case 'milestones':
        return <MilestoneTracker />;
      case 'resources':
        return <ResourceAllocationTool />;
      case 'raci':
        return <RACIMatrixBuilder />;
      case 'kanban':
        return <KanbanBoard />;
      case 'sprint-board':
        return <ScrumSprintBoard />;
      case 'sprint-planning':
        return <SprintPlanningAssistant />;
      case 'standup':
        return <DailyStandupLog />;
      case 'user-story-map':
        return <UserStoryMappingTool />;
      case 'dependencies':
        return <TaskDependencyMapper />;
      case 'planning-poker':
        return <PlanningPoker />;
      case 'tshirt-sizing':
        return <TShirtSizing />;
      case 'affinity-estimation':
        return <AffinityEstimation />;
      case 'retrospective-board':
        return <RetrospectiveBoard />;
      case 'dot-voting':
        return <DotVoting />;
      case 'retro-actions':
        return <RetroActionTracker />;
      case 'backlog-manager':
        return <BacklogManager />;
      case 'user-story-creator':
        return <UserStoryCreator />;
      case 'acceptance-criteria':
        return <AcceptanceCriteriaGenerator />;
      case 'sprint-goal-writer':
        return <SprintGoalWriter />;
      case 'release-notes':
        return <ReleaseNotesGenerator />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'task-timer':
        return <TaskTimer />;
      case 'countdown':
        return <CountdownTimer />;
      case 'burndown-chart':
        return <BurndownChart />;
      case 'velocity-tracker':
        return <VelocityTracker />;
      case 'cycle-time':
        return <CycleTimeCalculator />;
      case 'meeting-notes':
        return <MeetingNotesOrganizer />;
      case 'team-feedback':
        return <TeamFeedbackCollector />;
      case 'mood-tracker':
        return <MoodTracker />;
      case 'sprint-summary':
        return <SprintSummaryReportGenerator />;
      case 'team-performance':
        return <TeamPerformanceDashboard />;
      case 'risk-register':
        return <RiskRegisterTool />;
      default:
        return (
          <div className="py-4">
            <p className="text-muted-foreground mb-4">
              This tool is coming soon! We're working on implementing {toolTitle.toLowerCase()} functionality.
            </p>
            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
        {toolId && allToolIds.includes(toolId) ? (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner message={`Loading ${toolTitle}...`} size="lg" />}>
              {renderToolContent()}
            </Suspense>
          </ErrorBoundary>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl">{toolIcon}</span>
                {toolTitle}
              </DialogTitle>
            </DialogHeader>
            {renderToolContent()}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ToolModal;