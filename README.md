# Waypoint

Waypoint is a local-first professional growth, wellbeing, and reflection hub built with Next.js. It supports daily anchoring, focused work evidence, downtime readiness loops for Level 1 IT support, occupational-health controls, and lightweight reflection history.

## App Areas

- **Growth Hub**: daily capacity, growth focus, wellbeing guardrail, learning move, connection move, connected apps, and contextual next action.
- **Downtime Controls**: readiness workflow timer, status-line journal, reminders, rhythm dashboard, microlearning tasks, interrupt-friendly task board, ergonomics checklist, learning questlines, wellbeing coach, reports, local history, and expandable evidence details.
- **Waypoint**: daily home dashboard, Anchor flow, Focus Block timer, task log, End of Day card, Trail terrain, pace check, Examen, and Trail Log.

## Recent QA Improvements

The latest implementation pass focused on the QA report in `docs/qa-improvement-log.md`:

- Added edit/delete controls for status lines and task log entries.
- Added anchor edit/reset controls.
- Added Full Day card edit/clear controls.
- Added clearer Focus Block Timer guidance and labeled controls.
- Added non-colour selected indicators and explanatory text for Trail terrain and pace choices.
- Added clear/delete controls for saved trail reflections.
- Collapsed long Downtime evidence content behind an expandable details section.
- Expanded local snapshot restore to include more downtime and wellbeing state.
- Added print/PDF export for manager-ready and full-day reports.
- Documented remaining work in the QA improvement log.

## Documentation

- [Feature ideas and implementation guidance](./docs/feature-ideas.md)
- [QA improvement log](./docs/qa-improvement-log.md)

## Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Validation

```bash
pnpm lint
pnpm build
```

## Storage Model

Waypoint currently stores user data in browser `localStorage`. This is intentional for a private, local-first prototype, but it means data is tied to the current browser profile unless export or sync is added later.
