import json, re

with open('src/data/translations.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect translations.ts and moreTranslations.ts in node
import subprocess
out = subprocess.check_output(['npx', 'tsx', '-e', """
import { translations } from './src/data/translations';
import { moreTranslations } from './src/data/moreTranslations';

const hindiRegex = /[\\u0900-\\u097F]/;
const enTranslations = { ...translations.en, ...moreTranslations.en };

const devanagariInEn = [];
for (const [key, val] of Object.entries(enTranslations)) {
  if (hindiRegex.test(val)) {
    devanagariInEn.push({ key, val });
  }
}

console.log('Total keys in en:', Object.keys(enTranslations).length);
console.log('Keys in en with Devanagari (Hindi):', devanagariInEn.length);
for (const item of devanagariInEn) {
  console.log(' - ' + item.key + ': ' + item.val);
}
"""])
print(out.decode('utf-8'))
