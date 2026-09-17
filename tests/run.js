// Test suite for Qiraati 32 lessons & 17 activities
import { LESSONS } from '../src/data/lessonsData.ts';
import { ACTIVITIES } from '../src/data/activities.ts';

console.log('--- بدء اختبارات مشروع قراءتي (الصف الأول الابتدائي) ---');

// Test 1: Verify all 32 lessons exist
if (LESSONS.length !== 32) {
  console.error(`خطأ: عدد الدروس المتوقع 32، الموجود: ${LESSONS.length}`);
  process.exit(1);
}
console.log('✓ التحقق من اكتمال الـ 32 درساً: ناجح');

// Test 2: Verify all 17 activities exist
if (ACTIVITIES.length !== 17) {
  console.error(`خطأ: عدد الأنشطة المتوقع 17، الموجود: ${ACTIVITIES.length}`);
  process.exit(1);
}
console.log('✓ التحقق من اكتمال الـ 17 نشاطاً لكل مسار: ناجح');

// Test 3: Verify each lesson has valid data structure
let validLessons = 0;
LESSONS.forEach((lesson) => {
  if (lesson.id && lesson.title && lesson.passage && lesson.words.length > 0) {
    validLessons++;
  }
});

if (validLessons === 32) {
  console.log('✓ التحقق من بنية وبيانات ومفردات جميع الدروس: ناجح (32/32)');
} else {
  console.error(`خطأ: بعض الدروس تحتوي بيانات غير مكتملة: ${validLessons}/32`);
  process.exit(1);
}

console.log('--- اكتملت جميع الفحوصات بنجاح تام! ---');
