import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Star,
  RotateCcw,
  BookOpen,
  Volume2,
  Award,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Lesson, ActivityDefinition } from '../types';
import { ACTIVITIES } from '../data/activities';
import { sound } from '../utils/audio';

interface JourneyViewProps {
  lesson: Lesson;
  activityId: number;
  setActivityId: (id: number) => void;
  completedActivities: Record<number, number[]>;
  onCompleteActivity: (lessonId: number, actId: number) => void;
  onBackToMap: () => void;
  onSelectNextLesson: () => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({
  lesson,
  activityId,
  setActivityId,
  completedActivities,
  onCompleteActivity,
  onBackToMap,
  onSelectNextLesson,
}) => {
  const currentActivity = ACTIVITIES.find((a) => a.id === activityId) || ACTIVITIES[0];
  const lessonDoneList = completedActivities[lesson.id] || [];
  const isCurrentDone = lessonDoneList.includes(activityId);

  // States for interactive mini-games
  const [matchSelected, setMatchSelected] = useState<string | null>(null);
  const [matchCorrect, setMatchCorrect] = useState<boolean | null>(null);

  const [unscrambleLetters, setUnscrambleLetters] = useState<string[]>([]);
  const [assembledLetters, setAssembledLetters] = useState<string[]>([]);

  const [missingSelected, setMissingSelected] = useState<string | null>(null);
  const [oddSelected, setOddSelected] = useState<string | null>(null);
  const [huntedWords, setHuntedWords] = useState<string[]>([]);

  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [builtSentence, setBuiltSentence] = useState<string[]>([]);

  const [memoryCards, setMemoryCards] = useState<{ id: number; text: string; matched: boolean; flipped: boolean }[]>([]);
  const [flippedIdxs, setFlippedIdxs] = useState<number[]>([]);

  const [speedTimer, setSpeedTimer] = useState<number>(15);
  const [speedActive, setSpeedActive] = useState<boolean>(false);
  const [speedScore, setSpeedScore] = useState<number>(0);

  const targetWord = lesson.words[0] || { word: 'دَادَا', emoji: '👶', breakdown: ['دَا', 'دَا'] };

  // Reset interactive games on activity change
  useEffect(() => {
    setMatchSelected(null);
    setMatchCorrect(null);

    // Unscramble setup
    const cleanLetters = targetWord.word.replace(/[\u064B-\u065F]/g, '').split('');
    const shuffled = [...cleanLetters].sort(() => 0.5 - Math.random());
    setUnscrambleLetters(shuffled);
    setAssembledLetters([]);

    // Missing syllable setup
    setMissingSelected(null);
    setOddSelected(null);
    setHuntedWords([]);

    // Sentence builder setup
    const sentence = lesson.passage[0] || lesson.words.map(w => w.word).join(' ');
    const parts = sentence.split(' ').sort(() => 0.5 - Math.random());
    setSentenceWords(parts);
    setBuiltSentence([]);

    // Memory cards setup (4 pairs)
    const pairs = lesson.words.slice(0, 4);
    const cardList: { id: number; text: string; matched: boolean; flipped: boolean }[] = [];
    pairs.forEach((w, idx) => {
      cardList.push({ id: idx * 2, text: w.word, matched: false, flipped: false });
      cardList.push({ id: idx * 2 + 1, text: `${w.emoji} ${w.word}`, matched: false, flipped: false });
    });
    setMemoryCards(cardList.sort(() => 0.5 - Math.random()));
    setFlippedIdxs([]);

    setSpeedActive(false);
    setSpeedTimer(15);
    setSpeedScore(0);
  }, [activityId, lesson.id]);

  const triggerVictory = () => {
    sound.playSuccess();
    onCompleteActivity(lesson.id, activityId);
  };

  const handleNextActivity = () => {
    sound.playTap();
    if (activityId < 17) {
      setActivityId(activityId + 1);
    } else {
      onSelectNextLesson();
    }
  };

  const handlePrevActivity = () => {
    sound.playTap();
    if (activityId > 1) {
      setActivityId(activityId - 1);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between gap-4 bg-white/80 p-4 rounded-2xl border border-amber-200 shadow-2xs">
        <button
          onClick={() => {
            sound.playTap();
            onBackToMap();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لخريطة الدروس</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-2xl">{lesson.icon}</span>
          <div className="text-right">
            <h2 className="text-lg font-bold text-amber-950">
              الدرس {lesson.id}: {lesson.title}
            </h2>
            <p className="text-xs text-amber-800">{lesson.theme}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevActivity}
            disabled={activityId <= 1}
            className="p-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 disabled:opacity-30 disabled:pointer-events-none text-amber-900 transition-all cursor-pointer"
            title="النشاط السابق"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-amber-900 px-2">
            {activityId} / ١٧
          </span>
          <button
            onClick={handleNextActivity}
            className="p-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-amber-900 transition-all cursor-pointer"
            title="النشاط التالي"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 17 Activities Step Scroller */}
      <div className="bg-white/70 rounded-2xl p-3 border border-amber-200 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {ACTIVITIES.map((act) => {
            const isDone = lessonDoneList.includes(act.id);
            const isCurrent = act.id === activityId;

            return (
              <button
                key={act.id}
                onClick={() => {
                  sound.playTap();
                  setActivityId(act.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500 text-white shadow-xs scale-105'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-50 text-amber-900/80 hover:bg-amber-100 border border-amber-200/60'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-amber-200/80 text-amber-900 flex items-center justify-center text-[10px]">
                    {act.id}
                  </span>
                )}
                <span>{act.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Activity Canvas Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md">
        {/* Activity Header */}
        <div className="flex items-center justify-between pb-6 border-b border-amber-100 mb-6">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 mb-1">
              <span>النشاط {currentActivity.id} من ١٧</span>
            </div>
            <h3 className="text-2xl font-bold text-amber-950">
              {currentActivity.title}
            </h3>
            <p className="text-sm text-amber-800/80 mt-0.5">
              {currentActivity.description}
            </p>
          </div>

          {isCurrentDone && (
            <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>أكملت هذا النشاط</span>
            </div>
          )}
        </div>

        {/* Dynamic Activity Content */}
        <div className="min-h-[360px] flex flex-col justify-center">
          {/* ACTIVITY 1: READING PASSAGE */}
          {activityId === 1 && (
            <div className="space-y-6 text-center">
              <div className="inline-block p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-4xl">{lesson.icon}</span>
              </div>
              <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 max-w-xl mx-auto space-y-4">
                {lesson.passage.map((line, idx) => (
                  <p
                    key={idx}
                    className="text-3xl sm:text-4xl font-bold text-amber-950 text-tashkeel tracking-wide hover:text-amber-600 transition-colors cursor-pointer"
                    onClick={() => sound.playTap()}
                  >
                    {line}
                  </p>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {lesson.words.map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => sound.playTap()}
                    className="px-4 py-2 bg-white border border-amber-200 hover:border-amber-400 rounded-xl shadow-2xs font-bold text-amber-900 flex items-center gap-2 text-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{w.emoji}</span>
                    <span className="text-tashkeel">{w.word}</span>
                  </button>
                ))}
              </div>
              <div className="pt-4">
                <button
                  onClick={triggerVictory}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  قرأت الدرس بتأنٍ ودقة ✨
                </button>
              </div>
            </div>
          )}

          {/* ACTIVITY 2: FLASHCARDS */}
          {activityId === 2 && (
            <div className="space-y-6 text-center">
              <p className="text-sm text-amber-800">
                انقر على البطاقة لتقليبها واستكشاف المعنى والمقاطع:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {lesson.words.map((w, idx) => (
                  <div
                    key={idx}
                    onClick={() => sound.playTap()}
                    className="group bg-gradient-to-b from-amber-50 to-white rounded-2xl p-6 border border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 min-h-[190px]"
                  >
                    <span className="text-5xl group-hover:scale-110 transition-transform">{w.emoji}</span>
                    <span className="text-3xl font-extrabold text-amber-950 text-tashkeel">{w.word}</span>
                    <div className="flex gap-1">
                      {w.breakdown.map((b, bIdx) => (
                        <span key={bIdx} className="text-xs px-2 py-0.5 bg-amber-200/80 rounded-md font-bold text-amber-900">
                          {b}
                        </span>
                      ))}
                    </div>
                    {w.hint && <p className="text-xs text-amber-700 font-medium">{w.hint}</p>}
                  </div>
                ))}
              </div>
              <button
                onClick={triggerVictory}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                راجعت جميع البطاقات بنجاح ⭐
              </button>
            </div>
          )}

          {/* ACTIVITY 3: SYLLABLES BREAKDOWN */}
          {activityId === 3 && (
            <div className="space-y-8 text-center max-w-xl mx-auto">
              <p className="text-sm text-amber-800">
                استمع إلى نغمة كل مقطع صوتي وانقر عليه لتركيب الكلمة:
              </p>
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 space-y-6">
                <div className="text-6xl">{targetWord.emoji}</div>
                <div className="text-4xl font-extrabold text-amber-950 text-tashkeel">
                  {targetWord.word}
                </div>
                <div className="flex justify-center gap-3">
                  {targetWord.breakdown.map((syl, idx) => (
                    <button
                      key={idx}
                      onClick={() => sound.playSuccess()}
                      className="px-6 py-4 bg-white border-2 border-amber-300 hover:border-amber-500 rounded-2xl text-2xl font-bold text-amber-950 shadow-sm active:scale-90 transition-all cursor-pointer"
                    >
                      <span className="text-tashkeel">{syl}</span>
                      <span className="block text-[11px] text-amber-600 mt-1">مقطع {idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={triggerVictory}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                أتقنت تفكيك المقاطع الصوتية 🎯
              </button>
            </div>
          )}

          {/* ACTIVITY 4: MATCH GAME */}
          {activityId === 4 && (
            <div className="space-y-6 text-center max-w-lg mx-auto">
              <p className="text-sm text-amber-800">
                ما هي الكلمة الصحيحة المعبرة عن هذه الصورة؟
              </p>
              <div className="w-28 h-28 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-6xl shadow-inner">
                {targetWord.emoji}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {lesson.words.map((w, idx) => {
                  const isSelected = matchSelected === w.word;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setMatchSelected(w.word);
                        if (w.word === targetWord.word) {
                          setMatchCorrect(true);
                          sound.playSuccess();
                          triggerVictory();
                        } else {
                          setMatchCorrect(false);
                          sound.playError();
                        }
                      }}
                      className={`p-4 rounded-2xl text-2xl font-extrabold text-tashkeel border transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? matchCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                            : 'bg-rose-100 border-rose-500 text-rose-900'
                          : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-950'
                      }`}
                    >
                      {w.word}
                    </button>
                  );
                })}
              </div>
              {matchCorrect === true && (
                <p className="text-sm font-bold text-emerald-600 animate-bounce">
                  أحسنت! إجابة صحيحة ومطابقة ممتازة 👏
                </p>
              )}
              {matchCorrect === false && (
                <p className="text-sm font-bold text-rose-600">
                  حاول مرة أخرى يا بطل!
                </p>
              )}
            </div>
          )}

          {/* ACTIVITY 5: LETTER UNSCRAMBLE */}
          {activityId === 5 && (
            <div className="space-y-6 text-center max-w-lg mx-auto">
              <div className="text-5xl">{targetWord.emoji}</div>
              <p className="text-sm text-amber-800">
                انقر على الحروف بالترتيب الصحيح لتكوين كلمة: <strong>{targetWord.word}</strong>
              </p>

              {/* Assembled area */}
              <div className="min-h-[70px] bg-amber-50 rounded-2xl border-2 border-dashed border-amber-300 flex items-center justify-center gap-3 p-3">
                {assembledLetters.length === 0 ? (
                  <span className="text-sm text-amber-600 font-medium">
                    انقر على الحروف أدناه لترتيبها هنا
                  </span>
                ) : (
                  assembledLetters.map((letter, idx) => (
                    <span
                      key={idx}
                      className="w-12 h-12 bg-white rounded-xl border border-amber-300 text-2xl font-bold flex items-center justify-center text-amber-950 shadow-2xs"
                    >
                      {letter}
                    </span>
                  ))
                )}
              </div>

              {/* Letter pool */}
              <div className="flex justify-center gap-3">
                {unscrambleLetters.map((char, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playTap();
                      const next = [...assembledLetters, char];
                      setAssembledLetters(next);
                      const remaining = [...unscrambleLetters];
                      remaining.splice(idx, 1);
                      setUnscrambleLetters(remaining);

                      const cleanTarget = targetWord.word.replace(/[\u064B-\u065F]/g, '');
                      if (next.join('') === cleanTarget) {
                        triggerVictory();
                      }
                    }}
                    className="w-14 h-14 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 rounded-2xl text-2xl font-extrabold text-amber-950 shadow-sm active:scale-90 transition-all cursor-pointer"
                  >
                    {char}
                  </button>
                ))}
              </div>

              {assembledLetters.length > 0 && (
                <button
                  onClick={() => {
                    sound.playTap();
                    const cleanLetters = targetWord.word.replace(/[\u064B-\u065F]/g, '').split('');
                    setUnscrambleLetters(cleanLetters.sort(() => 0.5 - Math.random()));
                    setAssembledLetters([]);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة المحاولة</span>
                </button>
              )}
            </div>
          )}

          {/* ACTIVITY 6: MISSING SYLLABLE */}
          {activityId === 6 && (
            <div className="space-y-6 text-center max-w-lg mx-auto">
              <div className="text-5xl">{targetWord.emoji}</div>
              <p className="text-sm text-amber-800">
                ما هو المقطع المكمل لهذه الكلمة؟
              </p>
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-3xl font-extrabold text-amber-950">
                <span>{targetWord.breakdown[0]}</span>
                <span className="mx-2 px-4 py-1 bg-amber-200/80 rounded-xl text-amber-800 border border-amber-300">
                  {missingSelected || '... ؟ ...'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[targetWord.breakdown[1] || 'بَا', 'رِي', 'دُو'].sort().map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMissingSelected(opt);
                      if (opt === (targetWord.breakdown[1] || 'بَا')) {
                        sound.playSuccess();
                        triggerVictory();
                      } else {
                        sound.playError();
                      }
                    }}
                    className="p-4 rounded-2xl text-xl font-bold bg-white hover:bg-amber-100 border border-amber-200 text-amber-900 shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVITY 7: ODD ONE OUT */}
          {activityId === 7 && (
            <div className="space-y-6 text-center max-w-lg mx-auto">
              <p className="text-sm text-amber-800">
                أيٌّ من هذه الكلمات <strong>لا تنتمي</strong> إلى درس اليوم ({lesson.title})؟
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[lesson.words[0]?.word, lesson.words[1]?.word, 'صَارُوخٌ', lesson.words[2]?.word].filter(Boolean).map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setOddSelected(word);
                      if (word === 'صَارُوخٌ') {
                        sound.playSuccess();
                        triggerVictory();
                      } else {
                        sound.playError();
                      }
                    }}
                    className={`p-5 rounded-2xl text-2xl font-bold text-tashkeel border transition-all cursor-pointer active:scale-95 ${
                      oddSelected === word
                        ? word === 'صَارُوخٌ'
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                          : 'bg-rose-100 border-rose-500 text-rose-900'
                        : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-950'
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
              {oddSelected === 'صَارُوخٌ' && (
                <p className="text-sm font-bold text-emerald-600">
                  أصبت! كلمة &quot;صَارُوخ&quot; ليست من كلمات هذا الدرس 🌟
                </p>
              )}
            </div>
          )}

          {/* ACTIVITY 8: WORD HUNT */}
          {activityId === 8 && (
            <div className="space-y-6 text-center max-w-lg mx-auto">
              <p className="text-sm text-amber-800">
                اصطد جميع كلمات هذا الدرس بالنقر عليها (المتبقي:{' '}
                {lesson.words.length - huntedWords.length}):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...lesson.words, { word: 'قَمَر', emoji: '🌙' }, { word: 'شَمْس', emoji: '☀️' }]
                  .sort(() => 0.5 - Math.random())
                  .map((item, idx) => {
                    const isTarget = lesson.words.some((lw) => lw.word === item.word);
                    const isCollected = huntedWords.includes(item.word);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (isTarget && !isCollected) {
                            sound.playSuccess();
                            const next = [...huntedWords, item.word];
                            setHuntedWords(next);
                            if (next.length >= lesson.words.length) {
                              triggerVictory();
                            }
                          } else if (!isTarget) {
                            sound.playError();
                          }
                        }}
                        className={`p-4 rounded-2xl text-xl font-bold border transition-all cursor-pointer active:scale-95 ${
                          isCollected
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200'
                        }`}
                      >
                        <span className="block text-2xl mb-1">{item.emoji}</span>
                        <span className="text-tashkeel">{item.word}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ACTIVITY 9: SENTENCE BUILDER */}
          {activityId === 9 && (
            <div className="space-y-6 text-center max-w-lg mx-auto">
              <p className="text-sm text-amber-800">
                رتب الكلمات بالترتيب لتكوين الجملة المفيدة:
              </p>
              <div className="min-h-[70px] bg-amber-50 rounded-2xl border-2 border-dashed border-amber-300 flex items-center justify-center gap-2 p-3">
                {builtSentence.length === 0 ? (
                  <span className="text-sm text-amber-600 font-medium">
                    انقر على الكلمات بالترتيب الصحيح
                  </span>
                ) : (
                  builtSentence.map((word, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-white rounded-xl border border-amber-300 text-xl font-bold text-amber-950 shadow-2xs text-tashkeel"
                    >
                      {word}
                    </span>
                  ))
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {sentenceWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playTap();
                      const next = [...builtSentence, word];
                      setBuiltSentence(next);
                      const rem = [...sentenceWords];
                      rem.splice(idx, 1);
                      setSentenceWords(rem);

                      if (rem.length === 0) {
                        triggerVictory();
                      }
                    }}
                    className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-xl text-lg font-bold shadow-2xs active:scale-95 transition-all cursor-pointer text-tashkeel"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVITY 10: MEMORY CARDS */}
          {activityId === 10 && (
            <div className="space-y-6 text-center max-w-md mx-auto">
              <p className="text-sm text-amber-800">
                اقلب البطاقات وطابق كل كلمة بالصورة المشابهة لها:
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {memoryCards.map((card, idx) => {
                  const isVisible = card.matched || flippedIdxs.includes(idx);
                  return (
                    <button
                      key={card.id}
                      onClick={() => {
                        if (isVisible || flippedIdxs.length >= 2) return;
                        sound.playTap();
                        const nextFlipped = [...flippedIdxs, idx];
                        setFlippedIdxs(nextFlipped);

                        if (nextFlipped.length === 2) {
                          const [firstIdx, secondIdx] = nextFlipped;
                          const card1 = memoryCards[firstIdx];
                          const card2 = memoryCards[secondIdx];
                          const pair1 = Math.floor(card1.id / 2);
                          const pair2 = Math.floor(card2.id / 2);

                          if (pair1 === pair2) {
                            sound.playSuccess();
                            setTimeout(() => {
                              const updated = memoryCards.map((c, cIdx) =>
                                cIdx === firstIdx || cIdx === secondIdx
                                  ? { ...c, matched: true }
                                  : c
                              );
                              setMemoryCards(updated);
                              setFlippedIdxs([]);
                              if (updated.every((c) => c.matched)) {
                                triggerVictory();
                              }
                            }, 500);
                          } else {
                            sound.playError();
                            setTimeout(() => {
                              setFlippedIdxs([]);
                            }, 900);
                          }
                        }
                      }}
                      className={`h-20 rounded-2xl flex items-center justify-center p-2 text-center font-bold text-sm border transition-all cursor-pointer ${
                        isVisible
                          ? 'bg-amber-100 border-amber-300 text-amber-950 shadow-xs'
                          : 'bg-amber-400 border-amber-500 text-white shadow-2xs hover:bg-amber-500'
                      }`}
                    >
                      {isVisible ? (
                        <span className="text-xs sm:text-sm font-extrabold">{card.text}</span>
                      ) : (
                        <Sparkles className="w-5 h-5 opacity-70" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACTIVITY 11: SHORT VOWEL MARKS */}
          {activityId === 11 && (
            <div className="space-y-6 text-center max-w-lg mx-auto">
              <p className="text-sm text-amber-800">
                تدرّب على نطق الحرف مع الحركات الثلاث (الفتحة، الضمة، الكسرة):
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { mark: 'الْفَتْحَة (ـَ)', char: `${lesson.focusLetters[0] || 'دَ'}َ`, soundLabel: 'صوت مفتوح لطيف' },
                  { mark: 'الضَّمَّة (ـُ)', char: `${lesson.focusLetters[0] || 'دُ'}ُ`, soundLabel: 'صوت مضموم خفيف' },
                  { mark: 'الْكَسْرَة (ـِ)', char: `${lesson.focusLetters[0] || 'دِ'}ِ`, soundLabel: 'صوت مكسور رقيق' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => sound.playTap()}
                    className="bg-amber-50 hover:bg-amber-100 p-6 rounded-2xl border-2 border-amber-200 text-center space-y-2 transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <span className="text-5xl font-extrabold text-amber-950 text-tashkeel block">
                      {item.char}
                    </span>
                    <span className="font-bold text-sm text-amber-900 block">{item.mark}</span>
                    <span className="text-[11px] text-amber-700 block">{item.soundLabel}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={triggerVictory}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                ميزت أصوات الحركات القصيرة ⭐
              </button>
            </div>
          )}

          {/* ACTIVITY 12: LONG VOWELS */}
          {activityId === 12 && (
            <div className="space-y-6 text-center max-w-lg mx-auto">
              <p className="text-sm text-amber-800">
                حروف المد الطويلة: الألف (ا)، الواو (و)، الياء (ي):
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { vowel: 'المد بالألف', syl: `${lesson.focusLetters[0] || 'د'}ـا`, example: 'دَادَا' },
                  { vowel: 'المد بالواو', syl: `${lesson.focusLetters[0] || 'د'}ـو`, example: 'دُور' },
                  { vowel: 'المد بالياء', syl: `${lesson.focusLetters[0] || 'د'}ـي`, example: 'دِين' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => sound.playSuccess()}
                    className="bg-sky-50 hover:bg-sky-100 p-6 rounded-2xl border-2 border-sky-200 text-center space-y-2 transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <span className="text-4xl font-extrabold text-sky-950 text-tashkeel block">
                      {item.syl}
                    </span>
                    <span className="font-bold text-xs text-sky-900 block">{item.vowel}</span>
                    <span className="text-xs bg-sky-200/80 text-sky-950 px-2 py-0.5 rounded-full inline-block font-semibold">
                      {item.example}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={triggerVictory}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                أتقنت المدود الصوتية الطويلة ✨
              </button>
            </div>
          )}

          {/* ACTIVITY 13: SPEED READING */}
          {activityId === 13 && (
            <div className="space-y-6 text-center max-w-md mx-auto">
              <p className="text-sm text-amber-800">
                تحدي القراءة السريعة والودية: انقر لقراءة أكبر قدر من الكلمات!
              </p>
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 space-y-4">
                <div className="text-4xl font-extrabold text-amber-950 text-tashkeel">
                  {lesson.words[speedScore % lesson.words.length]?.word || lesson.title}
                </div>
                <div className="text-sm font-bold text-amber-800">
                  النقاط: {speedScore} كلمات مقروءة
                </div>
                <button
                  onClick={() => {
                    sound.playTap();
                    setSpeedScore((prev) => prev + 1);
                    if (speedScore + 1 >= 5) {
                      triggerVictory();
                    }
                  }}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white text-xl font-bold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  قرأت الكلمة بنجاح! 🚀
                </button>
              </div>
            </div>
          )}

          {/* ACTIVITY 14: RIDDLE */}
          {activityId === 14 && (
            <div className="space-y-6 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 mx-auto flex items-center justify-center text-amber-900">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                <p className="text-lg font-bold text-amber-950">
                  فزورة الدرس: {targetWord.hint || 'كلمة من كلمات الدرس تعبر عن شيء جميل'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {lesson.words.map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (w.word === targetWord.word) {
                        sound.playSuccess();
                        triggerVictory();
                      } else {
                        sound.playError();
                      }
                    }}
                    className="p-4 rounded-2xl bg-white hover:bg-amber-100 border border-amber-200 text-xl font-bold text-amber-950 text-tashkeel shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    {w.emoji} {w.word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVITY 15: PHONETIC SPELLING */}
          {activityId === 15 && (
            <div className="space-y-6 text-center max-w-lg mx-auto">
              <div className="text-5xl">{targetWord.emoji}</div>
              <p className="text-sm text-amber-800">
                تهجئة الحروف حرفاً حرفاً بالترتيب:
              </p>
              <div className="flex justify-center gap-3">
                {targetWord.word.replace(/[\u064B-\u065F]/g, '').split('').map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => sound.playSuccess()}
                    className="w-16 h-16 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-3xl font-extrabold text-amber-950 flex items-center justify-center shadow-xs active:scale-90 transition-all cursor-pointer"
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button
                onClick={triggerVictory}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                تهجيت الكلمة بدقة وإتقان 👏
              </button>
            </div>
          )}

          {/* ACTIVITY 16: WORD FAMILY BANK */}
          {activityId === 16 && (
            <div className="space-y-6 text-center max-w-lg mx-auto">
              <p className="text-sm text-amber-800">
                بنك الكلمات المتشابهة في الوزن والجرس الصوتي:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {lesson.words.map((w, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs text-center space-y-1"
                  >
                    <span className="text-3xl">{w.emoji}</span>
                    <span className="text-2xl font-bold text-amber-950 text-tashkeel block">
                      {w.word}
                    </span>
                    <span className="text-xs text-amber-700 font-medium block">
                      المقطع: {w.breakdown.join(' - ')}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={triggerVictory}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                حفظت بنك الكلمات المتشابهة ⭐
              </button>
            </div>
          )}

          {/* ACTIVITY 17: COMPLETION AWARD */}
          {activityId === 17 && (
            <div className="space-y-6 text-center max-w-lg mx-auto">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-5xl shadow-lg animate-bounce">
                🏆
              </div>
              <h4 className="text-3xl font-extrabold text-amber-950">
                مبارك! أكملت مسار الدرس {lesson.id} ({lesson.title})
              </h4>
              <p className="text-sm text-amber-800">
                أنهيت جميع الأنشطة الـ ١٧ بنجاح ونلت وسام إكمال المسار والنجمة الذهبية!
              </p>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold">
                علامة الإكمال تصف إنهاء المسار التعليمي للدرس بنجاح واجتياز كافة التدريبات.
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    sound.playFanfare();
                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 },
                    });
                    triggerVictory();
                  }}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-5 h-5" />
                  <span>احتفل ونل الوسام 🎊</span>
                </button>
                <button
                  onClick={onSelectNextLesson}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>الانتقال للدرس التالي</span>
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer for the Activity */}
        <div className="mt-8 pt-6 border-t border-amber-100 flex items-center justify-between">
          <button
            onClick={handlePrevActivity}
            disabled={activityId <= 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            <span>النشاط السابق</span>
          </button>

          <button
            onClick={handleNextActivity}
            className="flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>{activityId >= 17 ? 'الدرس التالي' : 'النشاط التالي'}</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
