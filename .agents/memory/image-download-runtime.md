---
name: Image download runtime
description: An observed sandbox limitation when downloading product reference photos.
---

Do not assume `AbortSignal` exists inside an impure CodeExecution function. Plain `fetch` and `node:fs/promises` worked for image downloads, but `AbortSignal.timeout(...)` raised a ReferenceError.

**Why:** A batch of valid reference-image URLs appeared to fail because a broad catch hid the missing global before any request was made.

**How to apply:** Log the actual error on an initial download before batch retries. Use ordinary fetch, or a shell download command with a timeout, rather than treating every caught exception as a bad source URL.
