import re

def transform_screen_code(code: str, filename: str) -> str:
    # 1. Base screen wrapper
    code = re.sub(r'bg-gradient-to-b from-emerald-800 via-emerald-900 to-slate-950 text-white', 'bg-surface text-on-surface', code)
    code = re.sub(r'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white', 'bg-surface text-on-surface', code)
    code = re.sub(r'bg-slate-950 text-slate-100', 'bg-surface text-on-surface', code)
    code = re.sub(r'bg-slate-950 text-white', 'bg-surface text-on-surface', code)
    code = re.sub(r'bg-slate-950 text-slate-200', 'bg-surface text-on-surface', code)
    
    # 2. Outer min-h wrappers
    code = code.replace('min-h-screen bg-slate-950', 'min-h-screen bg-surface')
    code = code.replace('min-h-full bg-slate-950', 'min-h-full bg-surface')
    
    # 3. Headers and sticky navigation bars
    code = code.replace('bg-slate-900 border-b border-slate-800', 'bg-surface-container-lowest border-b border-outline-variant/30 shadow-2xs')
    code = code.replace('bg-slate-900/90 border-b border-slate-800', 'bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 shadow-2xs')
    code = code.replace('bg-slate-900/80 border-b border-slate-800', 'bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30 shadow-2xs')
    code = code.replace('bg-slate-900/60 border border-emerald-500/20', 'bg-surface-container-lowest border border-outline-variant/30 shadow-xs')
    
    # 4. Cards & panels
    code = code.replace('bg-slate-900 border border-slate-800', 'bg-surface-container-lowest border border-outline-variant/30 shadow-2xs')
    code = code.replace('bg-slate-900/80 border border-slate-800', 'bg-surface-container-lowest border border-outline-variant/30 shadow-2xs')
    code = code.replace('bg-slate-900/50 border border-slate-800', 'bg-surface-container-lowest border border-outline-variant/30 shadow-2xs')
    code = code.replace('bg-slate-900/40 border border-slate-800', 'bg-surface-container-lowest border border-outline-variant/30 shadow-2xs')
    code = code.replace('bg-slate-900 p-', 'bg-surface-container-lowest p-')
    code = code.replace('bg-slate-900 rounded', 'bg-surface-container-lowest rounded')
    code = code.replace('bg-slate-800/80', 'bg-surface-container-low')
    code = code.replace('bg-slate-800/60', 'bg-surface-container-low')
    code = code.replace('bg-slate-800/50', 'bg-surface-container-low')
    code = code.replace('bg-slate-800/40', 'bg-surface-container-low')
    code = code.replace('bg-slate-800 border-slate-700', 'bg-surface-container-low border-outline-variant/30')
    code = code.replace('bg-slate-800 text-slate-300', 'bg-surface-container-high text-on-surface')
    code = code.replace('bg-slate-800 text-slate-400', 'bg-surface-container-high text-on-surface-variant')
    code = code.replace('bg-slate-800 text-white', 'bg-primary text-white')
    code = code.replace('bg-slate-800 hover:bg-slate-700', 'bg-surface hover:bg-surface-container text-on-surface')
    code = code.replace('hover:bg-slate-800', 'hover:bg-surface-container')
    
    # 5. Inner nested dark boxes
    code = code.replace('bg-slate-950 border border-slate-800', 'bg-surface border border-outline-variant/30')
    code = code.replace('bg-slate-950 border border-slate-700', 'bg-white border border-outline-variant/40')
    code = code.replace('bg-slate-950 p-', 'bg-surface p-')
    code = code.replace('bg-slate-950 rounded', 'bg-surface rounded')
    code = code.replace('bg-slate-950/80', 'bg-surface/80')
    code = code.replace('bg-slate-950/60', 'bg-surface/60')
    code = code.replace('bg-slate-950/50', 'bg-surface/50')
    code = code.replace('bg-slate-950', 'bg-surface')
    
    # 6. Inputs & search bars
    code = code.replace('bg-slate-900 border border-slate-700 text-white', 'bg-white border border-outline-variant/40 text-on-surface')
    code = code.replace('bg-slate-800 border border-slate-700 text-white', 'bg-white border border-outline-variant/40 text-on-surface')
    
    # 7. Borders
    code = code.replace('border-slate-800', 'border-outline-variant/30')
    code = code.replace('border-slate-700', 'border-outline-variant/40')
    code = code.replace('divide-slate-800', 'divide-outline-variant/20')
    code = code.replace('divide-slate-700', 'divide-outline-variant/20')
    
    # 8. Modals overlay
    code = code.replace('bg-black/70 backdrop-blur-sm', 'bg-inverse-surface/60 backdrop-blur-sm')
    code = code.replace('bg-black/80 backdrop-blur-sm', 'bg-inverse-surface/60 backdrop-blur-sm')
    code = code.replace('bg-black/60 backdrop-blur-sm', 'bg-inverse-surface/60 backdrop-blur-sm')
    code = code.replace('bg-black/70', 'bg-inverse-surface/60')
    code = code.replace('bg-black/60', 'bg-inverse-surface/60')
    code = code.replace('bg-black/50', 'bg-inverse-surface/60')
    code = code.replace('bg-black/40', 'bg-inverse-surface/40')

    # 9. Text readability on light background
    # Note: text-white inside buttons with bg-primary / bg-emerald-600 / bg-error should stay text-white!
    # But general text-slate-400 -> text-on-surface-variant
    # text-slate-300 -> text-on-surface-variant
    # text-slate-200 -> text-on-surface
    # text-slate-100 -> text-on-surface
    code = code.replace('text-slate-400', 'text-on-surface-variant')
    code = code.replace('text-slate-300', 'text-on-surface-variant')
    code = code.replace('text-slate-200', 'text-on-surface')
    code = code.replace('text-slate-100', 'text-on-surface')

    # 10. Replace standalone text-white when in headings or labels on surface
    # Let's be smart: if it's font-bold text-white or text-base text-white or text-lg text-white, on light background it must be text-on-surface
    code = re.sub(r'(\btext-(?:xs|sm|base|lg|xl|2xl|3xl)\s+font-(?:bold|extrabold|black)\s+)text-white\b', r'\1text-on-surface', code)
    code = re.sub(r'(\bfont-(?:bold|extrabold|black)\s+)text-white\b', r'\1text-on-surface', code)

    # 11. Emerald primary branding
    code = code.replace('bg-emerald-500 text-slate-950 font-black', 'bg-primary text-white font-black')
    code = code.replace('bg-emerald-600 hover:bg-emerald-500 text-white', 'bg-primary hover:bg-primary-container text-white')
    code = code.replace('bg-emerald-600 hover:bg-emerald-700 text-white', 'bg-primary hover:bg-primary-container text-white')
    code = code.replace('text-emerald-400', 'text-primary')
    code = code.replace('text-emerald-500', 'text-primary')
    code = code.replace('border-emerald-500/30', 'border-primary/30')
    code = code.replace('border-emerald-500/20', 'border-primary/20')
    code = code.replace('border-emerald-400/40', 'border-primary/40')
    code = code.replace('bg-emerald-500/20', 'bg-primary/10')
    code = code.replace('bg-emerald-500/10', 'bg-primary/10')

    return code

print("Transformation logic defined.")
