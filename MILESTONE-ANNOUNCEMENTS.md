# 📣 How RINGBOUND's Development Tracker Works

The RINGBOUND Sentinel development tracker is designed to keep major progress updates together in
one Reddit discussion thread.

**The rules are simple:** internal progress isn't an announcement, and a
milestone isn't called complete until it has actually passed its checks.

## The public milestone feed

The machine-readable [milestones.json](milestones.json) provides Sentinel
with the list of approved milestone announcements.

The feed starts **empty**. This is intentional. It does not imply that
development hasn't happened; it means no numbered milestone completion has
yet been explicitly approved for the tracker.

When a RINGBOUND version is ready for public discussion, an editor adds a
record with:

- Its stable ID (e.g. `0.2.10`) and version number
- A player-friendly milestone title
- `state: "complete"` after actual engineering qualification
- `public_release_approved: true` only after editorial sign-off
- The real completion date, a clear description, and why players should care
- A link to the already-public development journal or roadmap

A completed and approved item can then appear as **one comment** beneath
the tracker thread. Editing an already-reported milestone does not create
a flood of duplicates.

## What this does *not* mean

- A private pull request or experimental build is **not a shipped release**.
- A development milestone doesn't imply public testing has started.
- A forecast is not a guaranteed date.
- Tester applications stay closed until explicitly announced elsewhere.

## Example of an unapproved milestone entry

This example is **not a completion announcement** and cannot trigger a milestone comment:

```json
{
  "id": "0.2.10",
  "version": "0.2.10",
  "name": "Beyond the Ropes",
  "state": "in_progress",
  "public_release_approved": false
}
```

Only switch a record to `state: "complete"` and
`public_release_approved: true` once completion is qualified and the
player-friendly summary, player impact, completion date, and public source
link are included.

Until then, follow the [Ringside Report](DEVLOG.md) for development stories
and the [Roadmap](ROADMAP.md) for where we're heading.

**Every Match Matters. Every Decision Echoes. Every Legacy Is Earned.**
