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

- I looked through all repo docs. There are only two: [README.md](</c:/parris-compass/README.md>) and [docs/feature-ideas.md](</c:/parris-compass/docs/feature-ideas.md>). The working tree is clean.

The big picture: the 20 documented feature ideas all have at least a first-pass implementation surface now. What’s left is mostly making those features deeper, better connected, and more production-ready.

**Highest Priority Left**
1. **Fix Local Save & History restore**
   The snapshot stores `statusLog` and `events`, but restore only brings back hub, anchor, trail, and trail history. It should also restore status lines, downtime events, and probably workflow/reminder state.

2. **Unify the standalone workflow builder**
   The main app uses `waypoint:downtime-workflow`, but `/downtime/builder` uses `waypoint:customDowntimeLoop`. They should share the same saved workflow state so the standalone builder affects the real downtime loop.

3. **Upgrade Smart Reminders**
   Currently reminders are in-app only. The docs explicitly call out browser notification permission handling as the next step.

4. **Deepen Daily Rhythm / Pattern Insights**
   Current version is useful counts and simple bars. Left: better weekly trends, missed break detection, best focus times, repeated blockers, and maybe real charts.

5. **Improve End-of-Day / Manager Reports**
   Reports exist, but the documented “unresolved items” and “skills practised” could be more explicit. Add structured fields instead of inferring everything from logs.

6. **Make Status Templates smarter**
   Static templates are implemented. Left: recent custom templates saved from what the user actually writes.

7. **Expand task content**
   Task library and questlines exist, but they’re still static and small. Add more tracks, tags, filters, difficulty, and custom user tasks.

8. **Make sharing more real**
   Current sharing is copy/download/email draft. Left: print view, PDF, shareable encoded state, or account-backed sync if you want collaboration.

9. **Update the README**
   README is still mostly default Next.js boilerplate. It should describe Waypoint, features, local-first storage, routes, scripts, deployment, and product intent.

10. **Add tests**
   No documented test plan yet. Best targets: report generation, local storage restore, downtime event logging, and workflow timer behavior.


I opened the “Waypoint” web‑app and explored all available sections to assess the design, functionality and content.  The app has three main areas — **Growth Hub**, **Downtime Controls** and **Waypoint** — accessible via a top navigation bar; there is also a bottom nav that lets the user jump between the Home, Anchor and Trail screens when inside the Waypoint section.  Below is a structured QA report summarising what works well and what needs improvement.

---

## UI & Design

**Strengths**

* Clean, modern design and consistent colour palette.  The cards and sections are well‑spaced and the interface is easy to scan.
* Navigation is intuitive.  Tabs for Growth Hub, Downtime and Waypoint are always visible on desktop, and the bottom nav (Home / Anchor / Trail) within Waypoint makes switching between daily states straightforward.
* Key information is surfaced in a dashboard‑like panel.  For example, the Growth Hub page includes a “Today at a glance” card summarising the current anchor and trail selections; the Waypoint home screen summarises anchor state, trail terrain, focus‑block readiness and counts of evidence and trail markers.

**Areas for improvement**

* Some elements are not obvious to new users.  The Focus‑block timer features play/reset buttons that are hidden until you scroll down; there is no explanatory text telling users to scroll to start the timer.
* Colour‑only cues (e.g., selection states on the terrain cards and pace‑check answers) may be hard to perceive for colour‑blind users.  Adding icons or text labels for selected/unselected states would improve accessibility.
* Long sections of unbroken text (on the Downtime Controls page and in the occupational health briefing) could be collapsed behind accordions or separated into shorter paragraphs; this would aid readability, especially on smaller screens.

---

## Growth Hub

**What works**

* The Growth Hub has a helpful “Today at a glance” card summarising the day’s anchor and trail selections, and it links to the full occupational health briefing.
* Four text boxes allow the user to set a “Growth focus,” a “Wellbeing guardrail,” a “Learning move” and a “Connection move.”  These inputs persist across page reloads using local storage, which gives a sense of progress.

**What needs work**

* The broader professional‑development features described in the specification (e.g., micro‑learning modules, skill‑tracker, scenario practice, weekly planning and evidence pack) are absent.  As a result, the Growth Hub currently functions only as a set of static input fields rather than a comprehensive growth engine.
* There is no guidance on what counts as a useful “growth focus” or “learning move.”  Tooltips or example entries would help users.
* Inputs can’t be edited after entry except by overwriting the text; there are no delete/reset controls.

---

## Downtime Controls

**What works**

* The Downtime page implements the 30‑minute readiness loop for Level 1 IT roles.  The loop is broken into five cards (check channels, record status line, do a short task, take a visual break, and move) which you can tick off.  A progress bar shows how far through the loop you are.
* There is a status‑line field that logs what you were doing at a given time; each entry is timestamped and persists across refreshes.  This encourages accountability.
* The right side summarises guideline‑driven controls (posture variation, visual breaks, monitor positioning, etc.) in concise bullet points, which distils the longer occupational‑health briefing into actionable advice.

**What needs work**

* The tasks must be checked manually; there is no timer or countdown to enforce the 30‑minute rhythm.  The user could forget to reset the loop or might keep clicking without the cycle actually aligning to time.
* The page duplicates large amounts of text from the briefing; this can make the page feel cluttered.  Consider hiding the full briefing behind an “Expand details” link.
* There is no way to edit or delete status‑line entries.  A simple remove button or edit icon would improve accuracy.

---

## Waypoint – Anchor (daily focus)

**What works**

* The anchor flow guides the user through three steps: choosing a nervous‑system state, naming a single important task, and deciding what personal boundary to protect (e.g., a lunch break).  The progress is linear, so it’s easy to follow.
* Once set, the anchor is summarised in a card showing your state (“Settled” in my test), the one thing you’ll do and what you will protect.
* Under the anchor card, the **Focus Block timer** (25/5 Pomodoro style) and **Task log** encourage structured work and evidence logging.  When tasks are added to the log, each entry is timestamped.
* An **End of Day** section asks whether you completed the one thing, what went well and what you want to leave behind; saving this produces a “Full day card” summarising nervous‑system state, the one thing, what you protected, what went well and what you left behind.  This card appears below the timer as an evidence entry.

**What needs work**

* The Focus‑block timer did not count down; clicking the play icon kept the timer at 25:00.  This suggests the timer is not wired up, which undermines the concept of a focus block.
* The anchor cannot be revised once set.  If a user mis‑clicks or their day changes, there is no “Edit anchor” or “Reset anchor” option.
* The Task log has no edit or delete function.  Adding these would avoid accumulating incorrect entries.
* A “copy to clipboard” or “export log” button would be useful for transferring evidence into a weekly report or résumé.

---

## Waypoint – Trail (reflection)

**What works**

* The Trail page uses the metaphor of terrain and pace to help the user reflect on how the day feels.  The user chooses a terrain type (Open ground, Rocky, Exposed or Foggy) and then answers a pace‑check question (“Are you moving at a sustainable pace?”).
* A midday Examen section asks where the user felt most alive, where they felt most drained and what they want to carry forward.  Saving the reflection creates a new log entry.  A **Trail Log** lists recent markers (e.g., Rocky, Foggy, Open ground) with short notes; selecting a marker reveals the full reflection.
* The morning, midday and end‑of‑day reflections are distinct, providing structure without being too prescriptive.

**What needs work**

* There is no explanation of why one should select a terrain or pace, and the significance of each terrain is not clear.  A help icon or brief description near the selection could clarify the metaphor.
* Once saved, reflections cannot be edited or deleted.  An edit function is desirable.
* The Examen form resets after saving; however, the field for “carry forward” remains blank, causing the log to display “Not noted.”  It should either retain the answer or label it clearly as optional.

---

## General observations

* The app is **only partially implemented**.  Many of the promised features (micro‑learning modules, skill tracking, scenario practice, weekly plan and evidence pack export) are missing.  This limits its value as a “professional growth hub.”
* All data is stored in local storage; there is no sign‑in or cloud sync.  This is acceptable for a personal tool, but evidence will be lost if the browser storage is cleared.
* Performance is good on desktop.  The site loads quickly and interactions are smooth.  On smaller screens, some text boxes and cards could benefit from more responsive adjustments.
* Accessibility (ARIA roles, keyboard navigation, and contrast) wasn’t evaluated fully.  At first glance, interactive elements appear navigable, but the heavy reliance on colour and the absence of tooltips could be improved.

---

## Summary of Key Improvements

1. **Implement missing features**: Add the micro‑learning modules, skill tracker, scenario practice, weekly planner and evidence‑export functions described in the specification to fulfil the promise of a complete professional‑development hub.
2. **Fix functional bugs**: Make the Focus‑block timer start/stop properly and allow editing or deleting of task log and reflection entries.
3. **Enhance user control**: Provide ways to edit or reset anchors, reflections and daily cards, and allow exporting logs to external documents.
4. **Improve accessibility**: Use icons or text in addition to colour to indicate state, and add tooltips/help text explaining novel metaphors (terrain types, pace checks).
5. **Streamline content**: Hide lengthy sections of the occupational‑health briefing behind collapsible panels or summary cards so that users can access details on demand without being overwhelmed.
6. **Guide the user**: Offer examples or prompts for each input field and add onboarding or context‑sensitive help so users know how to make the most of the app.

Overall, the current version of Waypoint demonstrates a thoughtful design and some functional daily‑reflection tools.  To become the comprehensive professional‑development and wellbeing hub envisioned in the prompt, the app needs more complete feature implementation, bug fixes and additional guidance for users.
