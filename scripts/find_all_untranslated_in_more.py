import json, re

with open('src/data/moreTranslations.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('moreTranslations: Record<Language, Record<string, string>> = ') + len('moreTranslations: Record<Language, Record<string, string>> = ')
end_idx = text.find(';\n\n/**\n * Universal phrase')
existing_json_str = text[start_idx:end_idx]
data = json.loads(existing_json_str)

hindi_regex = re.compile(r'[\u0900-\u097F]')

untranslated_keys = set()
for lang in ['en', 'mr', 'gu', 'ta', 'bn', 'te', 'kn', 'ml', 'pa', 'or']:
    for k, val in data[lang].items():
        if lang == 'en' and hindi_regex.search(val):
            untranslated_keys.add(k)
        elif lang in ['ta', 'te', 'kn', 'ml', 'bn', 'gu', 'pa', 'or'] and hindi_regex.search(val):
            untranslated_keys.add(k)

print(f"Total keys needing true multilingual translation: {len(untranslated_keys)}")
for k in sorted(list(untranslated_keys)):
    print(f"  '{k}': hi='{data['hi'].get(k, '')}'")
