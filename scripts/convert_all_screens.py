import os, re

components_dir = 'src/components'
files = [
    'WelcomeScreen.tsx',
    'FeatureShowcaseScreen.tsx',
    'MerchantLoginScreen.tsx',
    'OtpVerificationScreen.tsx',
    'CreateBillScreen.tsx',
    'VoiceBillingScreen.tsx',
    'BarcodeScannerScreen.tsx',
    'InwardBillScannerScreen.tsx',
    'KhataBookScreen.tsx',
    'CustomerLedgerDetail.tsx',
    'UdhaarAiRecoveryScreen.tsx',
    'InventoryStockScreen.tsx',
    'InventoryExpiryScreen.tsx',
    'ExpiryClearanceOfferScreen.tsx',
    'GallaHisabScreen.tsx',
    'SmartSoundboxScreen.tsx',
    'DigitalDukanScreen.tsx',
    'ThermalPrinterDesignerScreen.tsx',
    'ReportsGstScreen.tsx',
    'MandiRatesScreen.tsx',
    'SupplierKhataScreen.tsx',
    'GodownTransferScreen.tsx',
    'StaffManagementScreen.tsx',
    'LoyaltyRewardsScreen.tsx',
    'ProSubscriptionScreen.tsx'
]

def transform(text: str, filename: str) -> str:
    # 1. Base screen wrapper & gradients
    text = re.sub(r'bg-gradient-to-b from-emerald-800 via-emerald-900 to-slate-950 text-white', 'bg-surface text-on-surface', text)
    text = re.sub(r'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white', 'bg-surface text-on-surface', text)
    text = text.replace('min-h-full bg-slate-950 text-slate-100 flex flex-col justify-between', 'min-h-full bg-surface text-on-surface flex flex-col justify-between')
    text = text.replace('min-h-screen bg-slate-950 text-slate-100', 'min-h-screen bg-surface text-on-surface')
    text = text.replace('min-h-screen bg-slate-950 text-white', 'min-h-screen bg-surface text-on-surface')
    text = text.replace('min-h-full flex flex-col justify-between bg-slate-950 text-white', 'min-h-full flex flex-col justify-between bg-surface text-on-surface')
    text = text.replace('min-h-full bg-slate-950 text-white', 'min-h-full bg-surface text-on-surface')
    text = text.replace('min-h-screen bg-slate-950', 'min-h-screen bg-surface')
    text = text.replace('min-h-full bg-slate-950', 'min-h-full bg-surface')
    text = text.replace('bg-slate-950 text-slate-100', 'bg-surface text-on-surface')
    text = text.replace('bg-slate-950 text-white', 'bg-surface text-on-surface')
    text = text.replace('bg-slate-950 text-slate-200', 'bg-surface text-on-surface')
    text = text.replace('bg-slate-900 text-slate-100', 'bg-surface-container-lowest text-on-surface')

    # 2. Sticky Headers
    text = text.replace('bg-slate-900 border-b border-slate-800', 'bg-surface-container-lowest border-b border-outline-variant/30 shadow-2xs')
    text = text.replace('bg-slate-900/90 border-b border-slate-800', 'bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 shadow-2xs')
    text = text.replace('bg-slate-900/80 border-b border-slate-800', 'bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30 shadow-2xs')
    text = text.replace('bg-slate-900/60 border-b border-slate-800', 'bg-surface-container-lowest/60 backdrop-blur-md border-b border-outline-variant/30 shadow-2xs')

    # 3. Cards & Panels
    text = text.replace('bg-slate-900 border border-slate-800', 'bg-surface-container-lowest border border-outline-variant/30 shadow-2xs')
    text = text.replace('bg-slate-900/80 border border-slate-800', 'bg-surface-container-lowest border border-outline-variant/30 shadow-2xs')
    text = text.replace('bg-slate-900/50 border border-slate-800', 'bg-surface-container-lowest border border-outline-variant/30 shadow-2xs')
    text = text.replace('bg-slate-900/40 border border-slate-800', 'bg-surface-container-lowest border border-outline-variant/30 shadow-2xs')
    text = text.replace('bg-slate-900 border border-slate-700', 'bg-surface-container-lowest border border-outline-variant/30 shadow-2xs')
    
    # Nested secondary card containers
    text = text.replace('bg-slate-800/80 border border-slate-700', 'bg-surface-container-low border border-outline-variant/30')
    text = text.replace('bg-slate-800/60 border border-slate-700', 'bg-surface-container-low border border-outline-variant/30')
    text = text.replace('bg-slate-800/50 border border-slate-700', 'bg-surface-container-low border border-outline-variant/30')
    text = text.replace('bg-slate-800 border border-slate-700', 'bg-surface-container-low border border-outline-variant/30')
    text = text.replace('bg-slate-800/80', 'bg-surface-container-low')
    text = text.replace('bg-slate-800/60', 'bg-surface-container-low')
    text = text.replace('bg-slate-800/50', 'bg-surface-container-low')
    text = text.replace('bg-slate-800/40', 'bg-surface-container-low')
    text = text.replace('bg-slate-800/30', 'bg-surface-container-low')
    
    # Generic bg-slate-900 & bg-slate-800
    text = text.replace('bg-slate-900 rounded', 'bg-surface-container-lowest rounded')
    text = text.replace('bg-slate-900 p-', 'bg-surface-container-lowest p-')
    text = text.replace('bg-slate-800 rounded', 'bg-surface-container-high rounded')
    text = text.replace('bg-slate-800 p-', 'bg-surface-container-high p-')
    text = text.replace('bg-slate-800 flex', 'bg-surface-container-high flex')

    # Nested items inside cards (that were bg-slate-950)
    text = text.replace('bg-slate-950 border border-slate-800', 'bg-surface border border-outline-variant/30')
    text = text.replace('bg-slate-950 border border-slate-700', 'bg-white border border-outline-variant/30')
    text = text.replace('bg-slate-950 rounded', 'bg-surface rounded')
    text = text.replace('bg-slate-950 p-', 'bg-surface p-')
    text = text.replace('bg-slate-950/80', 'bg-surface/80')
    text = text.replace('bg-slate-950/60', 'bg-surface/60')
    text = text.replace('bg-slate-950/50', 'bg-surface/50')
    text = text.replace('bg-slate-950', 'bg-surface')

    # 4. Interactive hover states
    text = text.replace('hover:bg-slate-800', 'hover:bg-surface-container')
    text = text.replace('hover:bg-slate-700', 'hover:bg-surface-container')

    # 5. Form inputs & selectors
    text = re.sub(r'bg-slate-900\s+border\s+border-slate-700\s+text-white', 'bg-white border border-outline-variant/40 text-on-surface focus:border-primary', text)
    text = re.sub(r'bg-slate-800\s+border\s+border-slate-700\s+text-white', 'bg-white border border-outline-variant/40 text-on-surface focus:border-primary', text)
    text = text.replace('placeholder-slate-500', 'placeholder-outline')
    text = text.replace('placeholder:text-slate-500', 'placeholder:text-outline')

    # 6. Borders & Dividers
    text = text.replace('border-slate-800', 'border-outline-variant/30')
    text = text.replace('border-slate-700', 'border-outline-variant/40')
    text = text.replace('divide-slate-800', 'divide-outline-variant/20')
    text = text.replace('divide-slate-700', 'divide-outline-variant/20')

    # 7. Text colors (muted/labels)
    text = text.replace('text-slate-400', 'text-on-surface-variant')
    text = text.replace('text-slate-300', 'text-on-surface-variant')
    text = text.replace('text-slate-200', 'text-on-surface')
    text = text.replace('text-slate-100', 'text-on-surface')

    # 8. Modals / overlays
    text = text.replace('bg-black/70 backdrop-blur-sm', 'bg-inverse-surface/60 backdrop-blur-sm')
    text = text.replace('bg-black/80 backdrop-blur-sm', 'bg-inverse-surface/60 backdrop-blur-sm')
    text = text.replace('bg-black/60 backdrop-blur-sm', 'bg-inverse-surface/60 backdrop-blur-sm')
    text = text.replace('bg-black/50 backdrop-blur-sm', 'bg-inverse-surface/60 backdrop-blur-sm')
    text = text.replace('bg-black/70', 'bg-inverse-surface/60')
    text = text.replace('bg-black/60', 'bg-inverse-surface/60')
    text = text.replace('bg-black/50', 'bg-inverse-surface/50')
    text = text.replace('bg-black/40', 'bg-inverse-surface/40')
    text = text.replace('bg-black/30', 'bg-inverse-surface/30')

    # 9. Emerald & Green buttons & badges
    text = text.replace('bg-emerald-500 text-slate-950 font-black', 'bg-primary text-white font-black shadow-xs')
    text = text.replace('bg-emerald-500 text-slate-950 font-bold', 'bg-primary text-white font-bold shadow-xs')
    text = text.replace('bg-emerald-600 hover:bg-emerald-500 text-white', 'bg-primary hover:bg-primary-container text-white')
    text = text.replace('bg-emerald-600 hover:bg-emerald-700 text-white', 'bg-primary hover:bg-primary-container text-white')
    text = text.replace('bg-emerald-500 hover:bg-emerald-600 text-slate-950', 'bg-primary hover:bg-primary-container text-white')
    text = text.replace('bg-emerald-500 hover:bg-emerald-600 text-white', 'bg-primary hover:bg-primary-container text-white')
    text = text.replace('text-emerald-400', 'text-primary')
    text = text.replace('text-emerald-500', 'text-primary')
    text = text.replace('border-emerald-500/30', 'border-primary/30')
    text = text.replace('border-emerald-500/20', 'border-primary/20')
    text = text.replace('border-emerald-400/40', 'border-primary/40')
    text = text.replace('bg-emerald-500/20', 'bg-primary/10')
    text = text.replace('bg-emerald-500/10', 'bg-primary/10')

    # 10. Headings with text-white
    text = re.sub(r'(\btext-(?:xs|sm|base|lg|xl|2xl|3xl)\s+font-(?:bold|extrabold|black)\s+)text-white\b', r'\1text-on-surface', text)
    text = re.sub(r'(\bfont-(?:bold|extrabold|black)\s+)text-white\b', r'\1text-on-surface', text)

    # Clean up any leftover bg-slate-900 or bg-slate-800
    text = text.replace('bg-slate-900', 'bg-surface-container-lowest')
    text = text.replace('bg-slate-800', 'bg-surface-container-high')

    return text

for fname in files:
    fpath = os.path.join(components_dir, fname)
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = transform(content, fname)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {fname}")

print("All screens converted to White & Green theme!")
