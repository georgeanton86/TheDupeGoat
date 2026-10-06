---
name: Checkout availability checks
description: Why checkout stock preflight differs from the public inventory display
---

Checkout stock preflight must allow the same purchase to use its own unexpired pending hold. Public inventory must still subtract every hold, and preflight must never reclaim another purchase's hold, expired holds awaiting reconciliation, or paid stock.

**Why:** A plain public-inventory check on a retry or reload can falsely block a shopper who reserved the last available decant. The payment may already have been prepared even if the browser never received its response.

**How to apply:** When refreshing inventory before payment preparation, tie advisory availability to the existing purchase attempt. Keep the locked server-side stock checks authoritative and stop for review whenever quantities change.
