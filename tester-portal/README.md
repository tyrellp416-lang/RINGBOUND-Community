# RINGBOUND Tester Portal | Public front end only

A public, read-only tester recruitment portal. **Applications are closed**, and no real applicant data is collected or stored.

- `index.html` shows the recruitment landing page, a **non-interactive** example form, and links to the official RINGBOUND Discord and subreddit.
- `api/status.js` returns a closed, read-only state.
- `api/applications.js` rejects all application requests with HTTP 403, without processing or saving submitted data.
- `vercel.json` adds protective headers.

This portal must **never** be switched to accepting applications by editing client-side text or JavaScript. The private, separate tester-application backend must be reviewed, deployed with protected database and secrets, and explicitly approved for testing before intake can begin. Admin endpoints and applicant data must never be hosted in this public repository.

Discord integration today means a direct, official community join link and recruitment-announcement destination. There is **no automatic Discord role assignment or Discord OAuth**, which would require a separate authorized integration and privacy/security review.