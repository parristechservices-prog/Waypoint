# Waypoint Feature Ideas and Practical Implementation Guidance

This document captures the 20 requested Waypoint feature ideas in top-to-bottom order. Each item includes practical notes for a vibe coder and the first implementation surface now used in the app.

## 1. Downtime Workflow Builder

- Lets users build a custom low-demand loop from briefing steps.
- Implemented through `DowntimeLoopPlanner` in `src/app/page.tsx`.
- Practical build path: model steps as `{ id, label, description, duration, enabled }`, render editable cards, allow up/down reordering, and persist the loop with `localStorage`.

## 2. Smart Reminder System

- Sends periodic prompts for posture changes, visual breaks, status updates, and walking intervals.
- Implemented through `SmartReminderSystem`.
- Practical build path: keep reminder settings as local state, run `window.setInterval` for enabled reminders, and show in-app alert cards before adding browser notifications.

## 3. Daily Rhythm Dashboard

- Visualises posture switches, task logs, completed cycles, breaks, and movement over today or seven days.
- Implemented through `DailyRhythmDashboard`.
- Practical build path: store simple event objects, filter by date range, and render pure CSS bars before adding a chart library.

## 4. Task Microlearning Library

- Offers short low-switching-cost learning tasks.
- Implemented through `TaskMicrolearningLibrary` and `src/app/data/task-library.ts`.
- Practical build path: keep the first task library static, render cards, and add chosen exercises directly to the existing task log.

## 5. Status Line Journal

- Captures availability/status lines as a work diary.
- Implemented inside `DowntimeLoopPlanner`.
- Practical build path: keep a timestamped `statusLog`, render newest first, add copy-to-clipboard, and expose one-click templates.

## 6. Ergonomics Checklist

- Guides monitor height, screen distance, lighting, footwear, posture, and laptop setup.
- Implemented through `ErgonomicsChecklist`.
- Practical build path: model checklist items with `id`, `label`, and `detail`, store completion locally, and keep each item actionable.

## 7. Evidence & Reference Hub

- Groups briefing sources into a quick reference library.
- Implemented through `EvidenceReferenceHub`.
- Practical build path: reuse `sourceLinks` from `src/app/downtimeContent.ts`, group sources by use case, and open links in new tabs.

## 8. Personalised Wellbeing Coach

- Recommends controls based on current state and risk inputs.
- Implemented through `WellbeingCoach`.
- Practical build path: write a small rules engine over anchor, trail, status log, events, and wellbeing sliders; return two or three cue cards.

## 9. Exportable Summary Report

- Creates a shareable day summary from anchor, task log, downtime controls, and reflections.
- Implemented through `ReportAndSharingPanel`.
- Practical build path: generate Markdown from current state, support copy-to-clipboard, and download via `Blob` plus `URL.createObjectURL`.

## 10. Collaboration / Sharing Mode

- Shares a daily wellbeing plan or status update by clipboard or email draft.
- Implemented through `ReportAndSharingPanel`.
- Practical build path: use the same generated report text, add a `mailto:` link, and keep the first version local-first.

## 11. Downtime Loop Timer

- Runs the custom readiness loop as a guided timer.
- Implemented in the workflow builder area of `DowntimeLoopPlanner`.
- Practical build path: store `currentStepIndex`, `secondsLeft`, and `timerRunning`; auto-advance or reset after each enabled step.

## 12. One-Click Status Log Templates

- Provides preset availability/status lines with quick edit before saving.
- Implemented inside `DowntimeLoopPlanner`.
- Practical build path: keep a `statusTemplates` array, render small buttons, and set the editable status input on click.

## 13. End-of-Day Work Evidence Report

- Compiles task logs, status lines, skills practised, and unresolved items.
- Implemented as the manager-ready report mode in `ReportAndSharingPanel`.
- Practical build path: keep personal reflection separate from work evidence and build reports with dedicated helper functions.

## 14. Posture & Eye Break Nudges

- Adds gentle reminders for visual breaks, posture changes, walking, ankle pumps, and hydration.
- Implemented through `SmartReminderSystem`.
- Practical build path: ship in-app reminders first, then add browser notification permission handling later.

## 15. Learning Questlines

- Turns professional development into small tracks.
- Implemented through `LearningQuestlines`.
- Practical build path: define static questlines, store completed task IDs in `localStorage`, and add progress entries to the task log.

## 16. Personal Pattern Insights

- Shows trends such as missed breaks, completed loops, and learning themes.
- Implemented through `DailyRhythmDashboard`.
- Practical build path: append events when key actions happen, group by date, and display counts before adding deeper analytics.

## 17. Interrupt-Friendly Task Board

- Gives tasks that can be paused instantly when calls or tickets arrive.
- Implemented through `InterruptFriendlyTaskBoard`.
- Practical build path: render start, pause, and done controls, define a clear pause point, and log completed tasks.

## 18. Wellbeing Risk Check-In

- Scans sleep, hydration, visual discomfort, leg fatigue, stress, and clarity.
- Implemented through the sliders inside `WellbeingCoach`.
- Practical build path: model each risk from 1 to 5 and use high scores to choose practical recommendations.

## 19. Manager-Ready Transparency Mode

- Exports availability and productive downtime use without personal reflection content.
- Implemented through the manager-ready toggle in `ReportAndSharingPanel`.
- Practical build path: separate work-safe report fields from private reflection fields in code.

## 20. Local Save & History

- Persists anchors, trail logs, downtime loops, status lines, and day summaries locally.
- Implemented through `useLocalStorageState` and `LocalSaveHistory`.
- Practical build path: store key state slices in `localStorage`, create day snapshots, and allow restoring a saved day.
