import fs from 'fs';
import path from 'path';

// Comprehensive dictionary for all 411 keys across all 12 languages
// Each key has hi, en, hinglish, mr, gu, ta, bn, te, kn, ml, pa, or

import { allTranslations } from './translations_data';

const outPath = path.join(__dirname, '../src/data/translations.ts');

console.log('Building translations.ts...');
