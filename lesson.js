/* Content source: supplied new reading PDF, printed pp. 11–12 (PDF pp.12–13).
 * All words are kept unvowelled here until the recordings/diacritics are reviewed.
 */
const ALIF_LESSON = Object.freeze({
  version: 1, id:'alif', title:'الألف والألف المقصورة', targets:['ا','ى'], answers:['ا','ى'], targetIndices:[0,2,4], traceGlyphs:['ا','ى'], readingPage:12, workbookPage:5, workbook:['ملك','مال','هدى','هادي'],
  tracePaths:['M220 45 L220 265','M275 85 C225 35 190 95 235 120 C295 160 270 230 185 242 C105 255 55 205 85 158'],
  words: [
    {id:'house', word:'دار', glyph:'ا', cell:0},
    {id:'gazelle', word:'غزال', glyph:'ا', cell:1},
    {id:'sweets', word:'حلوى', glyph:'ى', cell:2},
    {id:'goal', word:'مرمى', glyph:'ى', cell:3},
    {id:'cane', word:'عصا', glyph:'ا', cell:4}
  ],
  letters: ['ا','ي','ا','ل','ى','ط'],
  fill: [
    {word:'نار', before:'نـ', after:'ر', answer:'ا', cell:5},
    {word:'مرمى', before:'مرمـ', after:'', answer:'ى', cell:3},
    {word:'دار', before:'د', after:'ر', answer:'ا', cell:0},
    {word:'حلوى', before:'حلو', after:'', answer:'ى', cell:2},
    {word:'عصا', before:'عصـ', after:'', answer:'ا', cell:4}
  ]
});
const WAW_LESSON=Object.freeze({
 version:1,id:'waw',title:'حرف الواو',targets:['و'],answers:['و','ر'],targetIndices:[1,3],traceGlyphs:['و'],readingPage:14,workbookPage:6,workbook:['زيتون','دبوس','دب','صابون'],
 tracePaths:['M245 95 C225 50 170 55 175 100 C180 140 238 140 247 105 C257 170 207 230 135 232 C115 234 92 226 82 217'],
 words:[{id:'sheep',word:'خروف',glyph:'و',cell:0},{id:'whale',word:'حوت',glyph:'و',cell:1},{id:'chick',word:'صوص',glyph:'و',cell:2},{id:'lemon',word:'ليمون',glyph:'و',cell:3}],
 letters:['م','و','ر','و','ف','ز'],
 fill:[{word:'خروف',before:'خر',after:'ف',answer:'و',cell:0},{word:'حوت',before:'حـ',after:'ت',answer:'و',cell:1},{word:'صوص',before:'صـ',after:'ص',answer:'و',cell:2},{word:'ليمون',before:'ليمـ',after:'ن',answer:'و',cell:3}]
});
const LESSONS=Object.freeze({alif:ALIF_LESSON,waw:WAW_LESSON});
let LESSON=ALIF_LESSON;
if(typeof module!=='undefined')module.exports={...ALIF_LESSON,catalog:LESSONS};
