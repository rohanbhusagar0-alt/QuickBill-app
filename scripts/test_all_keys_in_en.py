import subprocess

out = subprocess.check_output(['npx', 'tsx', '-e', """
import { getTranslation } from './src/data/translations';
import { translations } from './src/data/translations';
import { moreTranslations } from './src/data/moreTranslations';

const allKeys = new Set([
  ...Object.keys(translations.hi || {}),
  ...Object.keys(translations.en || {}),
  ...Object.keys(moreTranslations.hi || {}),
  ...Object.keys(moreTranslations.en || {})
]);

const hindiRegex = /[\\u0900-\\u097F]/;
const hindiInEnOutput = [];

for (const k of allKeys) {
  const res = getTranslation('en', k);
  if (hindiRegex.test(res)) {
    hindiInEnOutput.push({ key: k, value: res });
  }
}

console.log('Total keys tested:', allKeys.size);
console.log('Keys that return Hindi in en:', hindiInEnOutput.length);
for (const item of hindiInEnOutput) {
  console.log(' - ' + item.key + ' => ' + item.value);
}
"""])
print(out.decode('utf-8'))
