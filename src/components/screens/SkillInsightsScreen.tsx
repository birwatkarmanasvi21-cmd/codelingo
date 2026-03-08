import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { skillInsights } from '@/data/mockData';
import { TrendingUp, TrendingDown, Minus, Brain, Target, Zap, Bug, Eye } from 'lucide-react';

const skillIcons: Record<string, React.ReactNode> = {
  'Logic Sound': <Brain className="w-5 h-5" />,
  'Edge-Case Aware': <Target className="w-5 h-5" />,
  'Efficient Thinker': <Zap className="w-5 h-5" />,
  'Debug Master': <Bug className="w-5 h-5" />,
  'Pattern Recognition': <Eye className="w-5 h-5" />,
};

export function SkillInsightsScreen() {
  const getStrengths = () => skillInsights.filter(s => s.percentage >= 70);
  const getWeaknesses = () => skillInsights.filter(s => s.percentage < 50);
  const getWorkingOn = () => skillInsights.filter(s => s.percentage >= 50 && s.percentage < 70);

  return (
    <div className="p-4 pb-24 space-y-6 slide-up">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-4">
          <Brain className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-2xl font-black text-foreground">Skill Insights</h1>
        <p className="text-muted-foreground mt-1">AI-powered analysis of your thinking patterns</p>
      </div>

      {/* Skill Cards */}
      <div className="space-y-3">
        {skillInsights.map((skill) => (
          <Card key={skill.name} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  skill.percentage >= 70 ? 'bg-correct/20 text-correct' :
                  skill.percentage >= 50 ? 'bg-xp/20 text-xp' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {skillIcons[skill.name]}
                </div>
                <span className="font-bold">{skill.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg">{skill.percentage}%</span>
                {skill.trend === 'up' && <TrendingUp className="w-4 h-4 text-correct" />}
                {skill.trend === 'down' && <TrendingDown className="w-4 h-4 text-incorrect" />}
                {skill.trend === 'stable' && <Minus className="w-4 h-4 text-muted-foreground" />}
              </div>
            </div>
            <Progress 
              value={skill.percentage} 
              className={`h-2 ${
                skill.percentage >= 70 ? '[&>div]:bg-correct' :
                skill.percentage >= 50 ? '[&>div]:bg-xp' :
                '[&>div]:bg-muted-foreground'
              }`}
            />
          </Card>
        ))}
      </div>

      {/* Strengths */}
      {getStrengths().length > 0 && (
        <Card className="p-4 bg-correct/10 border-correct/30">
          <h3 className="font-bold text-correct mb-3 flex items-center gap-2">
            <span className="text-lg">💪</span> Your Strengths
          </h3>
          <ul className="space-y-2">
            {getStrengths().map((skill) => (
              <li key={skill.name} className="text-sm text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-correct" />
                {skill.name} - Keep it up!
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Working On */}
      {getWorkingOn().length > 0 && (
        <Card className="p-4 bg-xp/10 border-xp/30">
          <h3 className="font-bold text-xp mb-3 flex items-center gap-2">
            <span className="text-lg">🔧</span> Working On
          </h3>
          <ul className="space-y-2">
            {getWorkingOn().map((skill) => (
              <li key={skill.name} className="text-sm text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-xp" />
                {skill.name} - Almost there!
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Weaknesses */}
      {getWeaknesses().length > 0 && (
        <Card className="p-4 bg-muted border-border">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="text-lg">🎯</span> Focus Areas
          </h3>
          <ul className="space-y-2">
            {getWeaknesses().map((skill) => (
              <li key={skill.name} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                {skill.name} - Practice more!
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* AI Recommendation */}
      <Card className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center float">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">AI Recommendation</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your <span className="text-correct font-semibold">Pattern Recognition</span> is excellent! 
              Try focusing on <span className="text-accent font-semibold">Efficient Thinking</span> by 
              practicing more algorithm optimization problems. Consider the "Two Sum" hackathon challenge!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
