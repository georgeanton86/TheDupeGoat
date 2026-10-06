---
name: Browser payment isolation
description: Safety boundary for changing-stock checkout browser regressions
---

Keep changing-stock browser regressions isolated from live payment services and the application backend. Mock payment preparation and stop before Stripe Elements initializes.

**Why:** The user explicitly required mocked payment creation and no live Stripe calls. These tests verify client stock decisions and retry identity, not payment processing or server reservation reconciliation.

**How to apply:** Preserve the frontend-only server, deny external network access, and fail unknown API calls. Use separate tests for payment completion, ownership, or expired-hold reconciliation rather than expanding these fixtures into a simulated payment system.
