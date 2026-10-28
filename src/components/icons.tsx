import React from 'react';
import {
  Coins,
  Dice5,
  Disc,
  Brain,
  Zap,
  Activity,
  Trophy,
  Sliders,
  Search,
  Volume2,
  VolumeX,
  Menu,
  X,
  Home,
  BarChart3,
  Sparkles,
  Info,
  CheckCircle2,
  Flame,
  Gamepad2,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  RotateCcw,
  Play,
  Award
} from 'lucide-react';

interface GameIconProps {
  name: string;
  className?: string;
}

export const GameIcon: React.FC<GameIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Coins': return <Coins className={className} />;
    case 'Dice5': return <Dice5 className={className} />;
    case 'Disc': return <Disc className={className} />;
    case 'Brain': return <Brain className={className} />;
    case 'Zap': return <Zap className={className} />;
    default: return <Gamepad2 className={className} />;
  }
};

export {
  Activity,
  Trophy,
  Sliders,
  Search,
  Volume2,
  VolumeX,
  Menu,
  X,
  Home,
  BarChart3,
  Sparkles,
  Info,
  CheckCircle2,
  Flame,
  Gamepad2,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  RotateCcw,
  Play,
  Award,
  Zap
};
