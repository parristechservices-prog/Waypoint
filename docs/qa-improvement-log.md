# Waypoint QA Improvement Log

This log records the QA-driven improvements made after reviewing the Growth Hub, Downtime Controls, and Waypoint daily reflection flows.

## Implemented in this pass

### Growth Hub guidance

- Preserved and documented the new Connected Apps area for related professional-development tools.
- Added contextual helper examples under Growth focus, Wellbeing guardrail, Learning move, and Connection move inputs.
- Kept the Next Move card as the primary guided onboarding path so new users always have one obvious action.

### Downtime readability and control

- Collapsed the long occupational-health evidence material into an expandable Briefing details and evidence library section.
- Kept the daily readiness loop, reminders, reports, history, task tools, and wellbeing coach visible before the long reference content.
- Added edit and delete controls for status-line entries so users can correct inaccurate evidence.

### Anchor and evidence controls

- Added an anchor revision flow so the daily anchor can be edited after it is set.
- Added a reset anchor action that keeps already logged task evidence while allowing the user to restart the anchor flow.
- Added clearer Focus Block Timer copy and labeled Start/Pause/Reset controls.
- Added edit and delete controls for task-log entries.
- Added edit and clear controls for the Full Day card.

### Trail accessibility and reflection control

- Added explanatory text for the terrain and pace metaphors.
- Added non-colour selected indicators to terrain and pace choices.
- Added clearer selected-state affordances in the Trail Log.
- Made today's Examen explicitly revisable by editing fields and saving again.
- Added clear/delete controls for saved trail reflections.

### Local save and restore

- Expanded saved snapshots to include downtime status lines, event history, workflow steps, saved workflows, reminders, ergonomics checklist state, and wellbeing risk state.
- Restoring a saved day now brings back the broader local state instead of only restoring hub, anchor, trail, and trail history.

## Remaining improvement backlog

- Browser notification permission handling for Smart Reminders.
- Richer weekly pattern insights, including missed-break detection and repeated blocker summaries.
- A stronger Growth Hub skill tracker with scenario practice and weekly planning.
- Report fields for explicit unresolved items and skills practised instead of inferring them from logs.
- Recent custom status templates based on lines the user actually writes.
- Richer share options beyond the implemented print/PDF report export.
- Automated tests for local storage restore, report generation, timer behavior, and log edit/delete controls.

## Validation

- Run `pnpm lint` after implementation.
- Run `pnpm build` after implementation.
