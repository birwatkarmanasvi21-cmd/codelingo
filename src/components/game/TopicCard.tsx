import { Lock } from 'lucide-react';

interface TopicCardProps {
  icon: string;
  name: string;
  progress: number;
  isLocked?: boolean;
  onClick?: () => void;
}

export function TopicCard({ icon, name, progress, isLocked = false, onClick }: TopicCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`relative w-full p-4 rounded-2xl border-2 transition-all duration-200 tap-target ${
        isLocked
          ? 'bg-muted/50 border-muted cursor-not-allowed'
          : 'bg-card border-border hover:border-primary hover:shadow-lg active:scale-95'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`text-3xl ${isLocked ? 'grayscale opacity-50' : ''}`}>
          {icon}
        </div>
        <div className="flex-1 text-left">
          <h3 className={`font-bold ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
            {name}
          </h3>
          {!isLocked && (
            <div className="mt-1.5 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary progress-fill rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        {isLocked && (
          <Lock className="w-5 h-5 text-muted-foreground" />
        )}
        {!isLocked && (
          <span className="text-sm font-semibold text-primary">{progress}%</span>
        )}
      </div>
    </button>
  );
}
