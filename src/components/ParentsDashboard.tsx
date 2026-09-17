import React from 'react';
import { Users, Award, Star, BookOpen, CheckCircle, RotateCcw, AlertCircle, Sparkles, HeartHandshake } from 'lucide-react';
import { LESSONS } from '../data/lessonsData';
import { sound } from '../utils/audio';

interface ParentsDashboardProps {
  completedActivities: Record<number, number[]>;
  totalStars: number;
  onResetProgress: () => void;
  onSelectLesson: (id: number) => void;
}

export const ParentsDashboard: React.FC<ParentsDashboardProps> = ({
  completedActivities,
  totalStars,
  onResetProgress,
  onSelectLesson,
}) => {
  // Compute analytics
  let totalFinishedActivities = 0;
  const fullyCompletedLessons: number[] = [];
  const startedLessons: number[] = [];

  LESSONS.forEach((lesson) => {
    const doneList = completedActivities[lesson.id] || [];
    totalFinishedActivities += doneList.length;
    if (doneList.length >= 17) {
      fullyCompletedLessons.push(lesson.id);
    } else if (doneList.length > 0) {
      startedLessons.push(lesson.id);
    }
  });

  const totalPossibleActivities = 32 * 17; // 544
  const overallPercentage = Math.round((totalFinishedActivities / totalPossibleActivities) * 100);

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner border border-white/30">
            <HeartHandshake className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              لوحة متابعة الأهل وأولياء الأمور
            </h2>
            <p className="text-sm text-amber-100 mt-1">
              متابعة تقدم طفلك في مسار قراءتي للصف الأول الابتدائي وحفظ الإنجازات
            </p>
          </div>
        </div>
      </div>

      {/* High-level metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-3xl font-extrabold text-amber-950 block">
            {fullyCompletedLessons.length} / ٣٢
          </span>
          <span className="text-xs text-amber-800 font-semibold block">
            دروس مكتملة المسار
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <span className="text-3xl font-extrabold text-emerald-900 block">
            {totalFinishedActivities} / ٥٤٤
          </span>
          <span className="text-xs text-emerald-800 font-semibold block">
            إجمالي الأنشطة المنجزة
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-2 font-bold">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          </div>
          <span className="text-3xl font-extrabold text-amber-950 block">
            {totalStars}
          </span>
          <span className="text-xs text-amber-800 font-semibold block">
            نجوم التميز المحصودة
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mx-auto mb-2 font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-3xl font-extrabold text-sky-900 block">
            {overallPercentage}%
          </span>
          <span className="text-xs text-sky-800 font-semibold block">
            نسبة الإنجاز العام
          </span>
        </div>
      </div>

      {/* Progress Bar of Overall Book */}
      <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-sm font-bold text-amber-950">
          <span>المسار الشامل لكتاب قراءتي (٣٢ درساً):</span>
          <span>{totalFinishedActivities} نشاطاً منجزاً ({overallPercentage}%)</span>
        </div>
        <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
        <p className="text-xs text-amber-800/80 font-medium">
          * التقدم محفوظ محلياً بالكامل على متصفح جهازك، دون الحاجة لحساب أو اتصال بالإنترنت.
        </p>
      </div>

      {/* Curriculum Breakdown & Lessons List */}
      <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-2xs space-y-4">
        <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <span>حالة إنجاز الدروس الـ ٣٢:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
          {LESSONS.map((lesson) => {
            const count = (completedActivities[lesson.id] || []).length;
            const isDone = count >= 17;
            const isStarted = count > 0 && !isDone;

            return (
              <div
                key={lesson.id}
                onClick={() => {
                  sound.playTap();
                  onSelectLesson(lesson.id);
                }}
                className={`p-3 rounded-xl border text-right cursor-pointer transition-all hover:scale-[1.02] ${
                  isDone
                    ? 'bg-emerald-50 border-emerald-300'
                    : isStarted
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-950">
                    {lesson.id}. {lesson.title}
                  </span>
                  <span className="text-sm">{lesson.icon}</span>
                </div>
                <div className="text-[11px] text-amber-800 font-semibold flex items-center justify-between">
                  <span>{count} / ١٧ نشاطاً</span>
                  {isDone && <span className="text-emerald-700 font-bold">مكتمل ✓</span>}
                  {isStarted && <span className="text-amber-700">قيد التقدم</span>}
                  {count === 0 && <span className="text-stone-500">مفتوح</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parental Educational Tips */}
      <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200/80 space-y-3">
        <h4 className="text-base font-bold text-amber-950 flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-700" />
          <span>إرشادات وتوجيهات للأهل:</span>
        </h4>
        <ul className="text-xs sm:text-sm text-amber-900/90 space-y-2 leading-relaxed list-disc list-inside">
          <li>
            <strong>التشجيع المستمر:</strong> شجع طفلك على قراءة الكلمات بصوت واضح، واحتفل بكل نجمة يجمعها في أنشطة الدرس.
          </li>
          <li>
            <strong>التكرار الممتع:</strong> تساعد ألعاب الذاكرة، وترتيب الحروف، والمقطع المفقود في تثبيت شكل الحرف ونغمته الصوتية.
          </li>
          <li>
            <strong>جلسات قصيرة:</strong> يُفضل التدرب لمدة ١٥ إلى ٢٠ دقيقة يومياً بدلاً من الجلسات الطويلة للحفاظ على تركيز الطفل وشغفه.
          </li>
          <li>
            <strong>إتاحة الدروس:</strong> جميع الدروس مفتوحة ومتاحة في أي وقت، مما يتيح مراجعة الدروس السابقة أو استباق الدروس القادمة بحسب وتيرة تعلم طفلك.
          </li>
        </ul>
      </div>

      {/* Reset Progress Section */}
      <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-stone-500 shrink-0" />
          <div>
            <h5 className="text-sm font-bold text-stone-800">إعادة ضبط تقدم الأنشطة والنجوم</h5>
            <p className="text-xs text-stone-600">
              في حال رغبت ببدء المسار من البداية لطفل آخر على هذا المتصفح.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm('هل أنت متأكد من رغبتك في مسح التقدم والبدء من جديد؟')) {
              sound.playTap();
              onResetProgress();
            }
          }}
          className="px-4 py-2 bg-stone-200 hover:bg-rose-100 hover:text-rose-700 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>تصفير التقدم</span>
        </button>
      </div>
    </div>
  );
};
