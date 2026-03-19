# Bug Fixes TODO

## Plan Implementation Steps (Approved)

**Step 1: [COMPLETED] Fix app/page.tsx**
- Photo fallback with '/store-1.jpg'
- Fix NaN regex (4 places: replace(/\\D/g, '') → replace(/\D/g, ''))
- Replace chat texts/emojis with WA SVG icons (grid, modal, floating)
- Reduce font sizes (headings 3xl/4xl→2xl/3xl, prices 3xl→2xl, services h3 lg→base, etc.)

**Step 2: [COMPLETED] Fix app/admin/page.tsx**
- Add discount formatting (formatDiscountInput, update handleInputChange, type=text + Rp prefix)

**Step 3: [COMPLETED] Test & Verify**
- Add product in admin with photo/discount
- Check product page: photos show, no NaN prices, smaller fonts, WA icons
- Responsive check

**Step 4: [COMPLETED] All bugs fixed: product photos fallback, WA logos, no NaN prices, smaller fonts saving space, admin discount formats with dots.**

Updated after each step.
