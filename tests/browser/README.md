# Changing-stock browser regressions

Run `npm ci`, `npx playwright install chromium`, then `npm run test:browser`.
On Replit, use the installed browser:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="$(which chromium)" npm run test:browser
```

The suite starts its own frontend-only Vite server on port 5174. Do not point it
at a deployed shop. No database, Express server, payment credentials, or live
Stripe calls are needed. Every API request is intercepted, unknown API routes
fail the test, and all external browser traffic is blocked. Service workers
are disabled so they cannot bypass interception.

Fixtures expose mutable public stock and checkout availability independently.
The reservation fixture adds the current attempt's unexpired hold to availability
only when its key matches. This tests the client's key propagation and retry
behavior, not the server's reservation reconciliation or payment ownership rules.
Those remain separate backend tests/tasks.

Payment creation returns a synthetic response; the mocked Stripe config returns
503 deliberately, keeping the buyer form available for retries without mounting
Stripe Elements. Assertions verify the submitted quantities, buyer details,
acknowledgments, request order, and stable checkout key. This is pre-payment
regression coverage, not card-payment or order-completion coverage.

Tests use fresh browser contexts and exercise the real shop and checkout pages:
repeated additions, mixed sets/individuals, sidebar/header/mobile selectors,
stock reductions on Proceed and Continue, explicit shortage adjustment,
failed availability/reload recovery, and same-reservation retries.

Failure traces are saved to ignored `test-results/`; inspect with
`npx playwright show-trace <trace.zip>`.
