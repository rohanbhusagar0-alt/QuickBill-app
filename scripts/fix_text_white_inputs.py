import os, re

components_dir = 'src/components'
files = [f for f in os.listdir(components_dir) if f.endswith('.tsx')]

for fname in files:
    fpath = os.path.join(components_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # 1. Inputs, textareas, selects with text-white
    content = re.sub(r'(\bclassName=\"[^\"]*?\bbg-white\b[^\"]*?)\btext-white\b', r'\1text-on-surface', content)
    content = re.sub(r'(\bclassName=\"[^\"]*?\btext-white\b[^\"]*?\bbg-white\b)', lambda m: m.group(1).replace('text-white', 'text-on-surface'), content)
    content = content.replace('className="bg-surface-container-lowest text-white"', 'className="bg-surface-container-lowest text-on-surface"')
    content = content.replace('text-white font-mono', 'text-on-surface font-mono')
    content = content.replace('font-mono text-white', 'font-mono text-on-surface')
    content = content.replace('<b className="text-white">', '<b className="text-on-surface">')
    content = content.replace("? 'text-amber-400' : 'text-white'", "? 'text-amber-600' : 'text-on-surface'")
    content = content.replace('bg-surface-container-high hover:bg-surface-container text-white', 'bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 text-on-surface')

    with open(fpath, 'w', encoding='utf-8') as fp:
        fp.write(content)

print("All input text-white cleaned up!")
