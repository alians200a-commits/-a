import React from 'react';
import { BookOpen, Map, Users, Star, Volume2, VolumeX, PlayCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentView: 'map' | 'journey' | 'parents';
  setCurrentView: (view: 'map' | 'journey' | 'parents') => void;
  totalStars: number;
  completedActivitiesCount: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onResumeLast: () => void;
  lastLessonTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  totalStars,
  completedActivitiesCount,
  soundEnabled,
  setSoundEnabled,
  onResumeLast,
  lastLessonTitle,
}) => {
  const toggleSound = () => {
    const newState = !soundEnabled;
    sound.enabled = newState;
    setSoundEnabled(newState);
    if (newState) sound.playTap();
  };

  return (
    <header className="sticky top-0 z-30 bg-amber-50/95 backdrop-blur-md border-b border-amber-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* App Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-sm flex items-center justify-center text-2xl select-none border border-amber-300">
            📖
          </div>
          <div>
            <h1 className="text-xl font-bold text-amber-950 tracking-tight flex items-center gap-2">
              <span>قِرَاءَتِي</span>
              <span className="text-xs bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                الصف الأول الابتدائي
              </span>
            </h1>
            <p className="text-xs text-amber-800/80">
              ٣٢ درساً • ١٧ نشاطاً لكل درس • رحلة قراءة تفاعلية
            </p>
          </div>
        </div>

        {/* Action Controls & Stats */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Resume Button */}
          <button
            onClick={onResumeLast}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
            title="استئناف آخر نشاط"
          >
            <PlayCircle className="w-4 h-4" />
            <span className="hidden sm:inline">استئناف:</span>
            <span className="max-w-[120px] truncate">{lastLessonTitle}</span>
          </button>

          {/* Stars Pill */}
          <div className="flex items-center gap-1.5 bg-amber-100/90 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-300/80 shadow-2xs">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
            <span>{totalStars}</span>
            <span className="hidden sm:inline text-amber-700/80 font-normal">نجمة</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-white text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-stone-200 text-stone-500 border-stone-300 hover:bg-stone-300'
            }`}
            title={soundEnabled ? 'كتم النغمات' : 'تشغيل النغمات'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 pb-2 pt-1 flex items-center justify-center sm:justify-start gap-2 border-t border-amber-100">
        <button
          onClick={() => {
            sound.playTap();
            setCurrentView('map');
          }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
            currentView === 'map'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-amber-900/80 hover:bg-amber-100/80'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>خريطة الدروس (٣٢)</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            setCurrentView('journey');
          }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
            currentView === 'journey'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-amber-900/80 hover:bg-amber-100/80'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>رحلة الدرس الحالي</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            setCurrentView('parents');
          }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
            currentView === 'parents'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-amber-900/80 hover:bg-amber-100/80'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>متابعة للأهل</span>
        </button>
      </div>
    </header>
  );
};
