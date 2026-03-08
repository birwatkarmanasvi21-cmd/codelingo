import { Home, Target, Trophy, User, Users } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Learn' },
    { id: 'practice', icon: Target, label: 'Skills' },
    { id: 'league', icon: Trophy, label: 'League' },
    { id: 'community', icon: Users, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-pb">
      <div className="container max-w-lg mx-auto">
        <div className="flex items-center justify-around py-2">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all tap-target ${
                activeTab === id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${activeTab === id ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
