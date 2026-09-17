/* Content source: supplied new reading PDF, printed pp. 11–12 (PDF pp.12–13).
 * All words are kept unvowelled here until the recordings/diacritics are reviewed.
 */
const LESSON = Object.freeze({
  version: 1,
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
if (typeof module !== 'undefined') module.exports = LESSON;
