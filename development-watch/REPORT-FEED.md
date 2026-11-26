# RINGSIDE public report feed (V2 proposal)

This is a consumer-side contract and empty public archive. No reports have been published by this implementation. All test examples are synthetic.

## Trust boundary

Private RINGFORGE, Codex and RINGSIDE records stay private. The existing private editorial workflow must construct a player-facing report, verify its facts and obtain explicit public publication approval before any bytes are transferred to the public repository. Never open a public PR containing raw private material, even as a draft. Boolean review/approval fields are assertions from a trusted publishing process, not cryptographic proof. A schema cannot establish that prose is safe or accurate.

The intended flow is: private evidence -> private editorial draft -> independent review -> owner-authorized public projection -> validate and append -> approved public feed -> website/Discord. The publisher and website integration are deliberately not enabled here. Existing Discord publication state is unchanged.

## Contract

Only `reports.json` and the enumerated fields validated by `report-feed.cjs` belong in the public feed. The feed begins empty. IDs increase monotonically (RINGSIDE-000001 etc.), dates are calendar dates in the editorial timezone, coverage ends on or before publication. A report's highlights describe research, active work, internal tests, verified milestones, plans or corrections. Verified milestones must have genuine scope-specific evidence; they are never inferred from commits or test counts.

Normal publication is append-only; identical retries are no-ops. An amended claim should use a new correction report. Sensitive accidental publication requires a separate emergency withdrawal and incident response policy, not an append-only workaround.

Before any live integration: independent review of V1 and this contract, private publisher implementation and authorization, approval receipt binding to exact public payload, secret-free allowlisted projection, atomic publication/idempotency, rollback/withdrawal plan, and host/browser qualification. Never represent a report as published before the public feed write is confirmed. No extra AI call is required for the schema validator.

Run `node --test development-watch/report-feed.test.cjs` in the repository. The test fixtures are synthetic and are never loaded by the website.
