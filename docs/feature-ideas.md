# Waypoint Feature Ideas

This document captures 10 feature ideas for Waypoint and gives practical implementation notes for a vibe coder. The goal is to keep each idea buildable in small steps, using the app's current Next.js structure, existing card UI, local state patterns, and the downtime guidance already in `src/app/downtimeContent.ts`.

## 1. Downtime Loop Timer

**Cool feature**
- A guided 30-minute cycle that steps through channel check, status line, learning task, visual break, and movement.

**How a vibe coder can practically implement it**
- Start inside the existing `DowntimeLoopPlanner` in `src/app/page.tsx`.
- Add a local `currentStepIndex` state and a `secondsLeft` state.
- Reuse the existing `monitoringLoop` data from `src/app/downtimeContent.ts` so the timer follows the briefing-backed sequence.
- Add Start, Pause, Reset, and Skip buttons with lucide icons.
- When a step finishes, automatically mark the matching checklist item complete and advance to the next step.
- Keep the first version client-only. No database is needed.

## 2. One-Click Status Log Templates

**Cool feature**
- Preset lines like "Queue checked; no assigned tickets; available for support" with quick edit before saving.

**How a vibe coder can practically implement it**
- Create a `statusTemplates` array with strings such as queue checked, ticket complete, learning block complete, and waiting on user.
- Render the templates as small buttons above the status input in `DowntimeLoopPlanner`.
- On click, set the current status input value instead of immediately saving it.
- Keep the input editable so the user can tailor the line before adding it to the log.
- Add a "recent templates" option later by storing the last few custom lines in `localStorage`.

## 3. End-of-Day Work Evidence Report

**Cool feature**
- Automatically compiles task logs, status lines, skills practised, and unresolved items into a copyable summary.

**How a vibe coder can practically implement it**
- Add a `Generate report` button near `EndOfDay` or inside the downtime section.
- Build a helper like `buildDayReport(anchor, statusLog, hub)` that returns a Markdown string.
- Include sections for one thing, protected boundary, task log, downtime status log, skill practised, useful action, and unresolved items.
- Use `navigator.clipboard.writeText(report)` for the first version.
- For a downloadable file, create a Blob and trigger a download with `URL.createObjectURL`.
- Keep manager-facing evidence separate from personal reflection fields.

## 4. Posture and Eye Break Nudges

**Cool feature**
- Gentle reminders for 20-20-20 eye breaks, posture changes, walking, ankle pumps, calf raises, and hydration.

**How a vibe coder can practically implement it**
- Create a `useNudgeTimer` hook that accepts an interval, label, and enabled flag.
- Add toggles for visual break, posture change, movement, and hydration.
- Use in-app alert cards first; browser notifications can come later because they need permission handling.
- Keep default intervals simple: 20 minutes for visual break, 30 minutes for posture change, 60 minutes for lower-limb movement.
- Store nudge preferences in `localStorage`.
- Use the briefing labels from `downtimeContent.ts` so the language stays consistent.

## 5. Learning Questlines

**Cool feature**
- Turn professional development into small tracks: Microsoft 365, React, ticket writing, cyber safety, communication scripts, and troubleshooting drills.

**How a vibe coder can practically implement it**
- Create a data file such as `src/app/learningQuestlines.ts`.
- Model each questline with `id`, `title`, `description`, `tasks`, `estimatedMinutes`, and `tags`.
- Render questlines as cards in the Downtime section or Growth Hub.
- Let the user mark each micro-task complete with a checkbox.
- Add an `Add to task log` button that creates a normal task log entry from the selected micro-task.
- Start with static data. Add persistence only after the UI feels useful.

## 6. Personal Pattern Insights

**Cool feature**
- Show weekly trends: best focus times, common low-energy periods, missed breaks, repeated blockers, and completed learning themes.

**How a vibe coder can practically implement it**
- Define a small event model: `type WaypointEvent = { id, type, timestamp, label }`.
- Log events when the user completes loops, saves status lines, records tasks, changes posture, or saves reflections.
- Store events in `localStorage` grouped by date.
- Build a simple `InsightsPanel` with counts first: loops completed, logs added, movement blocks completed, and breaks missed.
- Add lightweight charts later using CSS bars before bringing in a chart library.
- Keep insights descriptive, not diagnostic.

## 7. Interrupt-Friendly Task Board

**Cool feature**
- A small menu of approved low-switching-cost tasks that can be paused instantly when calls or tickets arrive.

**How a vibe coder can practically implement it**
- Reuse `suitableTaskCategories` from `src/app/downtimeContent.ts` as the starting list.
- Add a `TaskBoard` component with columns like Learn, Apply, Write, Check, and Reset.
- Give every task a short estimated duration and a clear "pause point".
- Add buttons for Start, Pause, Done, and Log.
- When a task is marked Done, add a task log entry automatically.
- Keep tasks small enough that interruptibility is real, not just claimed.

## 8. Wellbeing Risk Check-In

**Cool feature**
- A quick daily scan for sleep, hydration, visual discomfort, leg fatigue, stress, workload ambiguity, and recovery state.

**How a vibe coder can practically implement it**
- Create a `WellbeingRiskCheck` component with 5 to 7 slider or segmented-control questions.
- Use plain labels like Sleep, Hydration, Eyes, Legs, Stress, and Clarity.
- Map responses to low, medium, or high support needs.
- Show one practical recommendation from the existing controls: visual break, posture change, walking interval, water refill, or expectation clarification.
- Keep the result private by default and do not mix it into manager-facing reports.
- Persist only today's check-in at first.

## 9. Manager-Ready Transparency Mode

**Cool feature**
- A clean, professional view/export showing availability checks and productive downtime use without personal reflection content.

**How a vibe coder can practically implement it**
- Add a `TransparencyReport` component that only reads work-safe fields: status logs, task logs, learning tasks, completed loops, and unresolved work.
- Exclude nervous-system check-ins, Trail reflections, and personal wellbeing notes.
- Add a toggle called `Manager-ready` near the report generator.
- Build the output as Markdown with timestamps and concise headings.
- Add copy-to-clipboard first, then PDF or print view later.
- Make the privacy boundary obvious in code by keeping personal and work-report fields in separate helper functions.

## 10. Local Save and History

**Cool feature**
- Persist anchors, trail logs, downtime loops, and daily summaries locally so Waypoint becomes a real longitudinal companion instead of a single-session tool.

**How a vibe coder can practically implement it**
- Create a hook like `useLocalStorageState<T>(key, initialValue)`.
- Replace selected `useState` calls for `hub`, `anchor`, `trail`, and downtime status logs with the local-storage hook.
- Version the saved object with a field like `schemaVersion: 1` so future migrations are possible.
- Store entries by date, using a key such as `waypoint:days`.
- Add a small History page or panel that lists previous days and lets the user reopen summaries.
- Keep everything local-first before adding accounts, sync, or a database.

## Suggested Build Order

1. One-click status log templates.
2. Downtime loop timer.
3. End-of-day work evidence report.
4. Local save and history.
5. Interrupt-friendly task board.
6. Posture and eye break nudges.
7. Learning questlines.
8. Manager-ready transparency mode.
9. Wellbeing risk check-in.
10. Personal pattern insights.

This order gives the app more usefulness quickly while keeping technical risk low.
