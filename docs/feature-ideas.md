# Waypoint Feature Ideas and Practical Implementation Guidance

This document captures the 20 requested Waypoint feature ideas in top-to-bottom order. Each item includes practical notes for a vibe coder and the first implementation surface now used in the app.

## Current Implementation Status

- The 20 listed features now have first-pass implementation surfaces in the app.
- The latest QA improvement pass added edit/delete controls, anchor revision, clearer selected states, field examples, collapsible evidence details, and broader local snapshot restore.
- See `docs/qa-improvement-log.md` for the detailed change log and remaining backlog.
- Remaining work is now mostly depth and production hardening: richer growth planning, smarter insights, browser notifications, stronger reports, recent custom templates, PDF/print export, and automated tests.

## 1. Downtime Workflow Builder

- Lets users build a custom low-demand loop from briefing steps.
- Implemented through `DowntimeLoopPlanner` in `src/app/page.tsx`.
- Status: implemented with editable cards, reorder controls, saved loops, a guided timer, and local persistence.
- Remaining: unify the standalone `/downtime/builder` route with the main downtime workflow storage.

## 2. Smart Reminder System

- Sends periodic prompts for posture changes, visual breaks, status updates, and walking intervals.
- Implemented through `SmartReminderSystem`.
- Status: implemented as configurable in-app reminders with local persistence and event logging.
- Remaining: add browser notification permission handling.

## 3. Daily Rhythm Dashboard

- Visualises posture switches, task logs, completed cycles, breaks, and movement over today or seven days.
- Implemented through `DailyRhythmDashboard`.
- Status: implemented with event counts, today/week filters, and CSS bars.
- Remaining: add missed-break detection, repeated blocker summaries, and richer weekly trend views.

## 4. Task Microlearning Library

- Offers short low-switching-cost learning tasks.
- Implemented through `TaskMicrolearningLibrary` and `src/app/data/task-library.ts`.
- Status: implemented with static task cards that add entries to the task log.
- Remaining: expand task content, tags, difficulty, filters, and custom user tasks.

## 5. Status Line Journal

- Captures availability/status lines as a work diary.
- Implemented inside `DowntimeLoopPlanner`.
- Status: implemented with timestamped entries, copy-to-clipboard, templates, edit controls, and delete controls.
- Remaining: add recent custom templates based on user-written lines.

## 6. Ergonomics Checklist

- Guides monitor height, screen distance, lighting, footwear, posture, and laptop setup.
- Implemented through `ErgonomicsChecklist`.
- Status: implemented with local checklist persistence.
- Remaining: add optional reset-by-day behavior and richer workstation notes.

## 7. Evidence & Reference Hub

- Groups briefing sources into a quick reference library.
- Implemented through `EvidenceReferenceHub`.
- Status: implemented and now collapsed inside an expandable Downtime evidence section.
- Remaining: add search/filter if the source list grows.

## 8. Personalised Wellbeing Coach

- Recommends controls based on current state and risk inputs.
- Implemented through `WellbeingCoach`.
- Status: implemented with wellbeing sliders and rules-based cue cards.
- Remaining: add better prioritisation and explain why a cue appeared.

## 9. Exportable Summary Report

- Creates a shareable day summary from anchor, task log, downtime controls, and reflections.
- Implemented through `ReportAndSharingPanel`.
- Status: implemented with Markdown preview, copy, text download, and email draft.
- Remaining: add print/PDF export and explicit unresolved-item fields.

## 10. Collaboration / Sharing Mode

- Shares a daily wellbeing plan or status update by clipboard or email draft.
- Implemented through `ReportAndSharingPanel`.
- Status: implemented as copy/download/email draft.
- Remaining: consider shareable encoded state or account-backed sync later.

## 11. Downtime Loop Timer

- Runs the custom readiness loop as a guided timer.
- Implemented in the workflow builder area of `DowntimeLoopPlanner`.
- Status: implemented with start/pause/reset/skip/complete controls and event logging.
- Remaining: improve elapsed-time analytics and make standalone builder share the same state.

## 12. One-Click Status Log Templates

- Provides preset availability/status lines with quick edit before saving.
- Implemented inside `DowntimeLoopPlanner`.
- Status: implemented with editable template insertion.
- Remaining: save recent custom templates.

## 13. End-of-Day Work Evidence Report

- Compiles task logs, status lines, skills practised, and unresolved items.
- Implemented as the manager-ready report mode in `ReportAndSharingPanel`.
- Status: implemented with manager-ready mode that excludes personal reflection.
- Remaining: add explicit skills-practised and unresolved-items fields.

## 14. Posture & Eye Break Nudges

- Adds gentle reminders for visual breaks, posture changes, walking, ankle pumps, and hydration.
- Implemented through `SmartReminderSystem`.
- Status: implemented as in-app reminders.
- Remaining: add browser notifications.

## 15. Learning Questlines

- Turns professional development into small tracks.
- Implemented through `LearningQuestlines`.
- Status: implemented with static questlines, local progress, and task-log entries.
- Remaining: add more tracks and weekly planning.

## 16. Personal Pattern Insights

- Shows trends such as missed breaks, completed loops, and learning themes.
- Implemented through `DailyRhythmDashboard`.
- Status: implemented as event counts and bars.
- Remaining: add deeper analytics and trend explanations.

## 17. Interrupt-Friendly Task Board

- Gives tasks that can be paused instantly when calls or tickets arrive.
- Implemented through `InterruptFriendlyTaskBoard`.
- Status: implemented with start/pause/done/log actions and pause points.
- Remaining: add custom board tasks and task history.

## 18. Wellbeing Risk Check-In

- Scans sleep, hydration, visual discomfort, leg fatigue, stress, and clarity.
- Implemented through the sliders inside `WellbeingCoach`.
- Status: implemented with local risk sliders.
- Remaining: add trend-aware recommendations over multiple saved days.

## 19. Manager-Ready Transparency Mode

- Exports availability and productive downtime use without personal reflection content.
- Implemented through the manager-ready toggle in `ReportAndSharingPanel`.
- Status: implemented with separate manager-ready and full report builders.
- Remaining: add field-level preview labels showing what is private vs manager-ready.

## 20. Local Save & History

- Persists anchors, trail logs, downtime loops, status lines, and day summaries locally.
- Implemented through `useLocalStorageState` and `LocalSaveHistory`.
- Status: implemented with day snapshots and broader restore coverage for hub, anchor, trail, status lines, events, workflows, reminders, ergonomics, and wellbeing risk.
- Remaining: add delete/rename snapshot controls and schema-versioned migrations.
