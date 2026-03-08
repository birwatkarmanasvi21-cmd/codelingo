import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGame } from "@/contexts/GameContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeSwitch } from "@/components/ui/theme-toggle";
import { ChevronRight, Sparkles, Target, Clock, Code } from "lucide-react";

const tracks = [
  { id: "dsa", name: "DSA", icon: "🧮", description: "Data Structures & Algorithms" },
  { id: "python", name: "Python", icon: "🐍", description: "Python Programming" },
  { id: "java", name: "Java", icon: "☕", description: "Java Development" },
  { id: "web", name: "Web Dev", icon: "🌐", description: "Frontend & Backend" },
  { id: "dbms", name: "DBMS", icon: "🗄️", description: "Database Management" },
];

const levels = [
  { id: "beginner", name: "Beginner", description: "Just starting out", icon: "🌱" },
  { id: "intermediate", name: "Intermediate", description: "Know the basics", icon: "🌿" },
  { id: "advanced", name: "Advanced", description: "Ready for challenges", icon: "🌳" },
];

const goals = [
  { id: "exam", name: "Pass Exams", icon: "📝" },
  { id: "internship", name: "Land Internship", icon: "💼" },
  { id: "job", name: "Get a Job", icon: "🎯" },
  { id: "project", name: "Build Projects", icon: "🚀" },
];

const dailyTimes = [
  { id: 5, name: "5 min", description: "Quick daily dose" },
  { id: 10, name: "10 min", description: "Steady progress" },
  { id: 20, name: "20 min", description: "Power learning" },
  { id: 30, name: "30 min", description: "Deep focus" },
];

export function OnboardingFlow() {
  const { userProfile, completeOnboarding } = useGame();
  const { resolvedTheme } = useTheme();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    language: "",
    level: "" as "beginner" | "intermediate" | "advanced" | "",
    goal: "",
    dailyTime: 10,
  });

  const totalSteps = 6; // Added theme step
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      const email = userProfile?.email ?? "";
      try {
        await fetch(
          "https://r2yweyjn7f.execute-api.us-east-1.amazonaws.com/prod/interview",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mode: "save-onboarding",
              email,
              language: selections.language,
              level: selections.level,
              goal: selections.goal,
              dailyTime: selections.dailyTime,
            }),
          }
        );
      } catch {
        // Continue to home even if save fails
      }
      completeOnboarding({
        language: selections.language,
        level: selections.level || "beginner",
        goal: selections.goal,
        dailyTime: selections.dailyTime,
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return true; // Welcome
      case 1:
        return true; // Theme (always can proceed)
      case 2:
        return selections.language !== ""; // Track
      case 3:
        return selections.level !== ""; // Level
      case 4:
        return selections.goal !== ""; // Goal
      case 5:
        return selections.dailyTime > 0; // Time
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4">
      {/* Progress */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Step {step + 1} of {totalSteps}
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center slide-up">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-primary/20 rounded-full flex items-center justify-center float">
              <span className="text-7xl"><img src="favicon.png" alt="logo" /></span>
            </div>
            <h1 className="text-3xl font-black text-foreground">Welcome to Codelingo! 🎉</h1>
            <p className="text-lg text-muted-foreground max-w-sm mx-auto">
              Learn to think like a programmer before writing code. Master problem-solving through fun, bite-sized
              challenges!
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full">
                <Target className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">Gamified</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                <Code className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Think First</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Theme Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl mb-4 block">{resolvedTheme === "dark" ? "🌙" : "☀️"}</span>
              <h2 className="text-2xl font-bold text-foreground">Choose your vibe</h2>
              <p className="text-muted-foreground mt-2">You can change this anytime in settings</p>
            </div>
            <ThemeSwitch />
            <p className="text-center text-sm text-muted-foreground">
              {resolvedTheme === "dark"
                ? "🌙 Dark mode is easier on your eyes at night"
                : "☀️ Light mode is great for daytime learning"}
            </p>
          </div>
        )}

        {/* Step 2: Learning Track */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl mb-4 block">📚</span>
              <h2 className="text-2xl font-bold text-foreground">What do you want to learn?</h2>
              <p className="text-muted-foreground mt-2">Pick your primary focus</p>
            </div>
            <div className="space-y-3">
              {tracks.map((track) => (
                <Card
                  key={track.id}
                  onClick={() => setSelections({ ...selections, language: track.id })}
                  className={`p-4 cursor-pointer transition-all tap-target ${selections.language === track.id ? "ring-2 ring-primary bg-primary/10" : "hover:bg-muted"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{track.icon}</span>
                    <div>
                      <span className="font-bold block">{track.name}</span>
                      <span className="text-sm text-muted-foreground">{track.description}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Level */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl mb-4 block">📊</span>
              <h2 className="text-2xl font-bold text-foreground">What's your level?</h2>
              <p className="text-muted-foreground mt-2">We'll personalize your experience</p>
            </div>
            <div className="space-y-3">
              {levels.map((level) => (
                <Card
                  key={level.id}
                  onClick={() =>
                    setSelections({ ...selections, level: level.id as "beginner" | "intermediate" | "advanced" })
                  }
                  className={`p-4 cursor-pointer transition-all tap-target ${selections.level === level.id ? "ring-2 ring-primary bg-primary/10" : "hover:bg-muted"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{level.icon}</span>
                    <div>
                      <span className="font-bold block">{level.name}</span>
                      <span className="text-sm text-muted-foreground">{level.description}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Goal */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl mb-4 block">🎯</span>
              <h2 className="text-2xl font-bold text-foreground">What's your goal?</h2>
              <p className="text-muted-foreground mt-2">We'll help you get there!</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {goals.map((goal) => (
                <Card
                  key={goal.id}
                  onClick={() => setSelections({ ...selections, goal: goal.id })}
                  className={`p-4 cursor-pointer transition-all tap-target ${selections.goal === goal.id ? "ring-2 ring-primary bg-primary/10" : "hover:bg-muted"
                    }`}
                >
                  <div className="text-center">
                    <span className="text-4xl block mb-2">{goal.icon}</span>
                    <span className="font-bold">{goal.name}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Daily Time */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground">Daily learning time?</h2>
              <p className="text-muted-foreground mt-2">Consistency is key! 🔑</p>
            </div>
            <div className="space-y-3">
              {dailyTimes.map((time) => (
                <Card
                  key={time.id}
                  onClick={() => setSelections({ ...selections, dailyTime: time.id })}
                  className={`p-4 cursor-pointer transition-all tap-target ${selections.dailyTime === time.id ? "ring-2 ring-primary bg-primary/10" : "hover:bg-muted"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-lg">{time.name}</span>
                      <span className="text-sm text-muted-foreground block">{time.description}</span>
                    </div>
                    {selections.dailyTime === time.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <Button onClick={handleNext} disabled={!canProceed()} className="w-full h-14 text-lg font-bold game-button mt-6">
        {step === totalSteps - 1 ? (
          <>Start Learning! 🚀</>
        ) : (
          <>
            Continue
            <ChevronRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
