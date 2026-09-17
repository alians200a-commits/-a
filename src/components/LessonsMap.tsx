import React, { useState } from 'react';
import { Search, Sparkles, CheckCircle2, ArrowLeft, Play, Award } from 'lucide-react';
import { Lesson } from '../types';
import { LESSONS } from '../data/lessonsData';
import { sound } from '../utils/audio';

interface LessonsMapProps {
  completedActivities: Record<number, number[]>;
  onSelectLesson: (lessonId: number) => void;
  lastLessonId: number;
  lastActivityId: number;
  onResume: () => void;
}

export const LessonsMap: React.FC<LessonsMapProps> = ({
  completedActivities,
  onSelectLesson,
  lastLessonId,
  lastActivityId,
  onResume,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLessons = LESSONS.filter(
    (l) =>
      l.title.includes(searchTerm) ||
      l.theme.includes(searchTerm) ||
      l.focusLetters.some((fl) => fl.includes(searchTerm)) ||
      l.words.some((w) => w.word.includes(searchTerm))
  );

  const lastLesson = LESSONS.find((l) => l.id === lastLessonId) || LESSONS[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Resume Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 -left-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-right">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-4xl shadow-inner shrink-0 border border-white/30">
              {lastLesson.icon}
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>استئناف رحلة القراءة</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                الدرس {lastLesson.id}: {lastLesson.title}
              </h2>
              <p className="text-sm text-amber-100 mt-0.5">
                النشاط {lastActivityId} من أصل ١٧ نشاطاً • {lastLesson.theme}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              onResume();
            }}
            className="w-full md:w-auto px-6 py-3.5 bg-white text-amber-800 hover:bg-amber-50 rounded-2xl font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-amber-700 text-amber-700" />
            <span>متابعة التعلم الآن</span>
          </button>
        </div>
      </div>

      {/* Title & Search bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 p-4 rounded-2xl border border-amber-200/80 shadow-2xs">
        <div>
          <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <span>خريطة دروس قراءتي</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
              جميع الدروس ٣٢ مفتوحة ومتاحة
            </span>
          </h3>
          <p className="text-xs text-amber-800/80 mt-0.5">
            اختر أي درس لبدء مسار الأنشطة الـ ١٧ المخصصة له
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="ابحث عن درس أو حرف أو كلمة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-amber-50/70 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white text-amber-950 placeholder-amber-700/50"
          />
          <Search className="w-4 h-4 text-amber-600 absolute right-3.5 top-3" />
        </div>
      </div>

      {/* Grid of 32 Lessons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredLessons.map((lesson) => {
          const completedCount = (completedActivities[lesson.id] || []).length;
          const isCompleted = completedCount >= 17;
          const progressPercent = Math.min(100, Math.round((completedCount / 17) * 100));

          return (
            <div
              key={lesson.id}
              onClick={() => {
                sound.playTap();
                onSelectLesson(lesson.id);
              }}
              className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between ${
                isCompleted
                  ? 'border-emerald-300 bg-gradient-to-b from-white to-emerald-50/30'
                  : 'border-amber-200 hover:border-amber-400'
              }`}
            >
              {/* Header inside card */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 group-hover:scale-105 transition-transform flex items-center justify-center text-2xl shadow-2xs border border-amber-200/80">
                    {lesson.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      درس {lesson.id}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>مكتمل</span>
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-xl font-extrabold text-amber-950 mb-1 group-hover:text-amber-700 transition-colors">
                  {lesson.title}
                </h4>
                <p className="text-xs text-amber-800 line-clamp-1 mb-2 font-medium">
                  {lesson.theme}
                </p>

                {/* Sample Key Words Preview */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {lesson.words.slice(0, 3).map((w, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-100 font-semibold"
                    >
                      {w.word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Footer */}
              <div className="pt-3 border-t border-amber-100">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1.5">
                  <span>الأنشطة المنجزة:</span>
                  <span>{completedCount} / ١٧</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-900">
                  <span className="flex items-center gap-1">
                    {isCompleted ? <Award className="w-3.5 h-3.5 text-emerald-600" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{completedCount === 0 ? 'ابدأ المسار' : 'تابع الأنشطة'}</span>
                  </span>
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
