import os, re

components_dir = 'src/components'
files = sorted([os.path.join(components_dir, f) for f in os.listdir(components_dir) if f.endswith('.tsx')])
files.append('src/App.tsx')

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    hindi_lines = []
    for idx, line in enumerate(lines, 1):
        if re.search(r'[\u0900-\u097F]', line):
            # remove comments
            stripped = re.sub(r'//.*', '', line)
            # repeatedly remove t(...)
            prev = None
            while prev != stripped:
                prev = stripped
                stripped = re.sub(r"t\([^)]*\)", '', stripped)
            
            if re.search(r'[\u0900-\u097F]', stripped):
                hindi_lines.append((idx, line.strip()))
    if hindi_lines:
        print(f'=== {fpath} ({len(hindi_lines)} lines with raw Hindi) ===')
        for idx, l in hindi_lines:
            print(f'  L{idx}: {l}')

