/* Illustration scenes are editorial adaptations of the supplied reading words. */
const ALIF_SCENES=Object.freeze([
 {image:'assets/scenes/house.webp',alt:'الطفلان يفتحان باب الدار من الداخل',caption:'دار',theme:'house'},
 {image:'assets/world.webp',alt:'الطفلان يشاهدان غزالًا في الحديقة',caption:'غزال',theme:'gazelle'},
 {image:'assets/scenes/sweets.webp',alt:'الطفلان يتشاركان الحلوى في فناء الدار',caption:'حلوى',theme:'sweets'},
 {image:'assets/scenes/goal.webp',alt:'الطفلان يلعبان بالكرة عند المرمى',caption:'مرمى',theme:'goal'},
 {image:'assets/scenes/cane.webp',alt:'الطفلان يساعدان الجد ويناولانه العصا',caption:'عصا',theme:'cane'},
 {image:'assets/scenes/fire.webp',alt:'الطفلان مع أبيهما يشاهدون النار في نزهة',caption:'نار',theme:'fire'}
]);
const WAW_CROPS=[[640,285,190,190],[440,285,190,190],[255,285,190,190],[45,285,190,190]];
const WAW_SCENES=Object.freeze([
 {image:'assets/scenes/sheep.webp',alt:'الطفلان يطعمان الخروف في المزرعة',caption:'خروف',theme:'sheep'},
 {crop:1,alt:'حوت من صورة كتاب القراءة',caption:'حوت',theme:'book'},
 {crop:2,alt:'صوص من صورة كتاب القراءة',caption:'صوص',theme:'book'},
 {crop:3,alt:'ليمون من صورة كتاب القراءة',caption:'ليمون',theme:'book'}
]);
let WORD_SCENES=ALIF_SCENES;
let WORKBOOK_WORDS=LESSON.workbook;
