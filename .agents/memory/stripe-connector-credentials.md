---
name: Stripe connector credentials
description: An observed connector limitation when using the Stripe SDK and managed webhook sync
---

The connected Stripe proxy did not expose a `secret_key` through the connector settings endpoint in this workspace, even though the connection was active.

**Why:** Stripe's official Node SDK and managed webhook sync need an SDK secret; treating a connected proxy as proof that its settings expose that secret caused startup to fail. Existing environment-scoped Stripe keys were available instead.

**How to apply:** When implementing SDK-backed payments, verify credential availability without printing values. Keep development on test-mode keys and production on live-mode keys. Do not put credentials into files or logs.