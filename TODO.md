# ✅ Fix BullMQ User Model Registration Error - 90% COMPLETE

## Terminal Structure (REQUIRED):
```
Terminal 1: cd server && node infrastructure/workers/email.worker.js
Terminal 2: npm run dev
Terminal 3: redis-server (if not running)
```

## Steps:

✅ **1. Diagnosed** - `order.worker.js` broken (undefined functions, no DB connect)

✅ **2. Created** `server/invoices/` for PDF storage

**3. Delete broken file** `[NEXT]`
```bash
# Run this in any terminal
rm server/infrastructure/workers/order.worker.js
```

**4. Kill broken workers** `[USER]`
```
Ctrl+C ALL terminals running node workers/order.worker.js
```

**5. Start clean** `[USER]`
```bash
# Terminal 1 - EMAIL WORKER ONLY (handles User model correctly)
cd server && node infrastructure/workers/email.worker.js

# Terminal 2 - MAIN SERVER  
npm run dev
```

**6. Verify Redis** `[USER]`
```bash
redis-cli ping  # → PONG
```

**7. Test** `[USER]`
- http://localhost:5173 → Login → Create test order
- Terminal 1: See `📨 Job received`, `📄 PDF generated`, `✅ Email sent`
- Check `server/invoices/` for PDF files

## Why this fixes it:
- `email.worker.js` ✅ imports User model + connects DB + handles real jobs
- `order.worker.js` ❌ orphaned, calls undefined functions → delete it
- No code uses orderQueue anymore

## Expected Result:
❌ **NO MORE** `Job failed: Schema hasn't been registered for model "User"`

## Progress: Delete order.worker.js → Restart → Test 🚀
