import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Github, Linkedin, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </div>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">About This Project</h1>
            <p className="text-xl text-muted-foreground">
              Empowering teams with free, accessible project management tools
            </p>
          </div>

          {/* Mission */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Why This Tool is Free
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                I believe that effective project management shouldn't be a luxury reserved for teams with big budgets. 
                Every team, regardless of size or resources, deserves access to professional-grade tools that can help 
                them work more efficiently and deliver better results.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This collection of 33+ agile and project management tools is my contribution to the development community. 
                It's completely free, open-source, and designed to help teams adopt agile practices without financial barriers.
              </p>
            </CardContent>
          </Card>

          {/* About Developer */}
          <Card>
            <CardHeader>
              <CardTitle>About the Developer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Kelvin Benson – Agile Project Manager with hands-on software development experience. I built this free project management toolkit for project managers and teams who want to simplify their workflow and explore practical tools without barriers.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Built with modern web technologies (React, TypeScript, and Tailwind CSS), this tool represents my 
                commitment to creating high-quality, accessible software that makes a real difference in how teams work.
              </p>
              
              {/* Call to Action */}
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2 text-primary">Have feedback or suggestions?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  I'd love to hear from you! Whether you have ideas for new tools, found a bug, or just want to say hi, 
                  don't hesitate to reach out.
                </p>
                <Button asChild>
                  <a href="mailto:hello@kelvinbenson.com" target="_blank" rel="noopener noreferrer">
                    <Mail className="w-4 h-4 mr-2" />
                    Get in Touch
                  </a>
                </Button>
              </div>
              
              {/* Contact/Social Links */}
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Connect with me:</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://github.com/kbteck" target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="mailto:hello@kelvinbenson.com" target="_blank" rel="noopener noreferrer">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://linkedin.com/in/kelvinbenson" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Feel free to reach out if you have suggestions, feedback, or just want to connect!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>What You Get</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Project Management Tools</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Timeline & Milestone Tracking</li>
                    <li>• Resource Allocation</li>
                    <li>• Work Breakdown Structure</li>
                    <li>• RACI Matrix Builder</li>
                    <li>• Risk Register</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Agile & Scrum Tools</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Kanban Boards</li>
                    <li>• Sprint Planning</li>
                    <li>• Planning Poker</li>
                    <li>• Retrospective Boards</li>
                    <li>• User Story Mapping</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Productivity Tools</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Pomodoro Timer</li>
                    <li>• Task Timer</li>
                    <li>• Burndown Charts</li>
                    <li>• Velocity Tracking</li>
                    <li>• Team Performance Dashboard</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Collaboration Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Team Feedback Collection</li>
                    <li>• Meeting Notes Organization</li>
                    <li>• Mood Tracking</li>
                    <li>• Dot Voting</li>
                    <li>• Action Item Tracking</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Built With</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'React Router', 'Lucide Icons'].map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                This project showcases modern web development practices including component-based architecture, 
                TypeScript for type safety, responsive design, and optimized performance.
              </p>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;