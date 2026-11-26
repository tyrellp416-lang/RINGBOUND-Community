# RINGSIDE Development Watch

Public website preview for RINGBOUND. Serve this folder using any static host or locally with `python3 -m http.server 8000` from the repository root, then visit `http://localhost:8000/development-watch/`.

## Data and safety
- Reads only the public main-branch `status.json` and `milestones.json`; starts with an embedded projection of the approved snapshot.
- Filters milestones to completed, explicitly public-approved entries and distinguishes historical records. Older or malformed feeds retain the last accepted snapshot. Refresh on load, on request, and every 15 minutes while visible.
- No engine credentials, private repository access, internal logs, API spending or writes from the browser.
- Dates refer to publication, not development recency. Counts represent public milestone records, not completion percentages.
- Timeline intentionally accepts the current provisional planning schema only; an announced release or open applications requires review before the preview will accept it.
- All remote text uses DOM text nodes; community and source links are fixed.

## Qualification
Run `node --test development-watch/validation.test.cjs` with Node 18+ from the root. The tests exercise the projection function directly from the actual HTML. Browser testing (desktop and narrow mobile, keyboard accessibility, live fetch and failure handling), hosting configuration, independent review and owner publication approval are separate gates. This preview is not a release announcement.

## Later stages
1. Define a reviewed milestone taxonomy and evidence gates before introducing any progress percentages.
2. Connect RINGSIDE Report via a separate approved public report feed, never raw internal logs or private GitHub credentials.
3. Add historical snapshots and verified analytics only after public editorial approval.
4. Select hosting, enable deployment after review, and verify the live URL. Keep the private engine and current weekly reporting workflows unchanged until separate integration approval.
