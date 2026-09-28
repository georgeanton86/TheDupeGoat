---
name: Checkout draft privacy
description: Why resumable checkout buyer details are tab-scoped and tied to a pending purchase
---

Keep buyer contact and delivery drafts in tab-scoped storage, associated with the pending checkout attempt. A new purchase must not automatically inherit them, and completed orders must clear them.

**Why:** Refresh recovery needs short-lived continuity, but persisting delivery details across unrelated purchases increases privacy risk and can silently send orders to an outdated address.

**How to apply:** When modifying checkout persistence or adding another checkout route, restore buyer details only for the same attempt and clear them on confirmation or an explicitly new purchase.