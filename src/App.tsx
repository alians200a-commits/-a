import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LessonsMap } from './components/LessonsMap';
import { JourneyView } from './components/JourneyView';
import { ParentsDashboard } from './components/ParentsDashboard';
import { LESSONS } from './data/lessonsData';
import { sound } from './utils/audio';

const STORAGE_KEY = 'qiraati_app_progress_v1';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'map' | 'journey' | 'parents'>('map');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [selectedActivityId, setSelectedActivityId] = useState<number>(1);
  const [completedActivities, setCompletedActivities] = useState<Record<number, number[]>>({});
  const [totalStars, setTotalStars] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load saved progress from localStorage on boot
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lastLessonId) setSelectedLessonId(parsed.lastLessonId);
        if (parsed.lastActivityId) setSelectedActivityId(parsed.lastActivityId);
        if (parsed.completedActivities) setCompletedActivities(parsed.completedActivities);
        if (typeof parsed.totalStars === 'number') setTotalStars(parsed.totalStars);
        if (typeof parsed.soundEnabled === 'boolean') {
          setSoundEnabled(parsed.soundEnabled);
          sound.enabled = parsed.soundEnabled;
        }
      }
    } catch {
      // Local storage fallback
    }
  }, []);

  // Save progress changes to localStorage
  const saveProgress = (
    newCompleted: Record<number, number[]>,
    stars: number,
    lessonId: number,
    actId: number,
    soundOn: boolean
  ) => {
    try {
      const data = {
        lastLessonId: lessonId,
        lastActivityId: actId,
        completedActivities: newCompleted,
        totalStars: stars,
        soundEnabled: soundOn,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore storage quota errors
    }
  };

  const handleCompleteActivity = (lessonId: number, actId: number) => {
    const existing = completedActivities[lessonId] || [];
    if (!existing.includes(actId)) {
      const updatedList = [...existing, actId];
      const updatedMap = { ...completedActivities, [lessonId]: updatedList };
      const newStars = totalStars + 1;
      setCompletedActivities(updatedMap);
      setTotalStars(newStars);
      saveProgress(updatedMap, newStars, lessonId, actId, soundEnabled);
    }
  };

  const handleSelectLesson = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setSelectedActivityId(1);
    setCurrentView('journey');
    saveProgress(completedActivities, totalStars, lessonId, 1, soundEnabled);
  };

  const handleResumeLast = () => {
    setCurrentView('journey');
  };

  const handleSelectNextLesson = () => {
    if (selectedLessonId < 32) {
      const nextId = selectedLessonId + 1;
      setSelectedLessonId(nextId);
      setSelectedActivityId(1);
      saveProgress(completedActivities, totalStars, nextId, 1, soundEnabled);
    } else {
      setCurrentView('parents');
    }
  };

  const handleResetProgress = () => {
    setCompletedActivities({});
    setTotalStars(0);
    setSelectedLessonId(1);
    setSelectedActivityId(1);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const activeLesson = LESSONS.find((l) => l.id === selectedLessonId) || LESSONS[0];
  const lastLessonObj = LESSONS.find((l) => l.id === selectedLessonId) || LESSONS[0];

  let completedCount = 0;
  Object.values(completedActivities).forEach((arr) => {
    completedCount += arr.length;
  });

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-800 flex flex-col font-arabic">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        totalStars={totalStars}
        completedActivitiesCount={completedCount}
        soundEnabled={soundEnabled}
        setSoundEnabled={(enabled) => {
          setSoundEnabled(enabled);
          saveProgress(completedActivities, totalStars, selectedLessonId, selectedActivityId, enabled);
        }}
        onResumeLast={handleResumeLast}
        lastLessonTitle={lastLessonObj.title}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-6">
        {currentView === 'map' && (
          <LessonsMap
            completedActivities={completedActivities}
            onSelectLesson={handleSelectLesson}
            lastLessonId={selectedLessonId}
            lastActivityId={selectedActivityId}
            onResume={handleResumeLast}
          />
        )}

        {currentView === 'journey' && (
          <JourneyView
            lesson={activeLesson}
            activityId={selectedActivityId}
            setActivityId={(actId) => {
              setSelectedActivityId(actId);
              saveProgress(completedActivities, totalStars, selectedLessonId, actId, soundEnabled);
            }}
            completedActivities={completedActivities}
            onCompleteActivity={handleCompleteActivity}
            onBackToMap={() => setCurrentView('map')}
            onSelectNextLesson={handleSelectNextLesson}
          />
        )}

        {currentView === 'parents' && (
          <ParentsDashboard
            completedActivities={completedActivities}
            totalStars={totalStars}
            onResetProgress={handleResetProgress}
            onSelectLesson={handleSelectLesson}
          />
        )}
      </main>

      <footer className="mt-auto border-t border-amber-200/80 bg-white/70 py-4 text-center text-xs text-amber-900/80">
        <p>
          قِرَاءَتِي — تطبيق قراءة تفاعلي للصف الأول الابتدائي • ٣٢ درساً و١٧ نشاطاً لكل درس • يعمل دون إنترنت
        </p>
      </footer>
    </div>
  );
};

export default App;
