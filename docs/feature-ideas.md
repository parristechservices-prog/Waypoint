# Waypoint Feature Ideas and Practical Implementation Guidance

This document captures 10 new feature ideas for the Waypoint app and includes practical implementation notes for a vibe coder who wants to build them quickly.

## 1. Downtime Workflow Builder

**What it does**
- Lets users build a custom low-demand loop from the briefing: check channels, record status, short task, visual break, movement.

**How a vibe coder can implement it**
- Create a small route or component like `src/app/downtime/builder/page.tsx`.
- Define a simple data model: an ordered array of step objects with `id`, `label`, `description`, and `duration`.
- Reuse the existing `timer` logic from `FocusTimer` or build a lightweight hook that advances to the next step.
- Use the app's card/button style to let users drag/drop or toggle steps on/off.
- Save the user's custom loop in local state or `localStorage` so it persists between sessions.

## 2. Smart Reminder System

**What it does**
- Sends periodic prompts for posture changes, visual breaks, status updates, or walking intervals.

**How a vibe coder can implement it**
- Add a settings section in the hub for reminders with toggles and interval inputs.
- Create a `useReminder` hook that uses `window.setInterval` and `Notification` (or an in-app alert card).
- Connect it to the existing `TimerState` by reusing the focus timer and adding extra alert types.
- Keep the UI light: checkboxes for `posture`, `visual break`, `status note`, `movement`.
- Store preferences in local state and optionally persist them using `localStorage`.

## 3. Daily Rhythm Dashboard

**What it does**
- Visualises how often users switched posture, logged tasks, completed cycles, and used breaks over time.

**How a vibe coder can implement it**
- Create a small dashboard page or card with summary counts and simple charts.
- Track events like `postureChange`, `taskLogEntry`, `breakTaken`, and `movementCycle` in state.
- Use a lightweight chart library or pure CSS bars to show daily totals.
- Keep the backend simple: store daily metrics in `localStorage` or in-memory state if you only need short-term data.
- Add a “today / last 7 days” toggle for quick pattern review.

## 4. Task Microlearning Library

**What it does**
- Offers a curated set of low-switching-cost learning tasks aligned with the downtime structure.

**How a vibe coder can implement it**
- Add a static list of categories and short task ideas in a new module (like `src/app/data/task-library.ts`).
- Render the list as cards in the hub or a new page.
- Include an “Add to task log” button to quickly push the chosen exercise into the existing `TaskLog`.
- Keep each item short and concrete, e.g. “Read one M365 tip”, “Write one ticket note”, “Practice one React hook.”
- Use the existing `HubPrompt` style for the library card grid.

## 5. Status Line Journal

**What it does**
- Captures quick availability/status lines as a work diary and displays them as a simple timeline.

**How a vibe coder can implement it**
- Reuse the `TaskLog` data model or create a new journal state keyed by time.
- Add a status line input and save button in the downtime section.
- Display entries in reverse chronological order with timestamp badges.
- Offer a “Copy journal” button using `navigator.clipboard.writeText`.
- Keep it lightweight by adding only one new state slice and reusing the task log UI.

## 6. Ergonomics Checklist

**What it does**
- Provides a guided workstation setup checklist for monitor position, screen distance, lighting, footwear, and posture.

**How a vibe coder can implement it**
- Create a checklist component with items and toggle switches.
- Use a section card that can be expanded/collapsed for checklist details.
- Store the completion state in local component state or `localStorage`.
- Add small microcopy for each item, e.g. “Top of monitor slightly below eye level” and “Switch posture every 30 minutes.”
- Keep the UX simple and actionable, with a clear “Done” state for each item.

## 7. Evidence & Reference Hub

**What it does**
- Turns the briefing sources into a quick reference library inside the app.

**How a vibe coder can implement it**
- Reuse the source list from `src/app/downtimeContent.ts` or create a new data array.
- Build a page or card list of references with title, summary, and link.
- Optionally group sources by category: ergonomics, standing, attention, ADHD moderators.
- Add small “Read more” links that open the reference in a new tab.
- This is a good fit for the existing app theme because it keeps evidence visible and tangible.

## 8. Personalised Wellbeing Coach

**What it does**
- Gives contextual recommendations based on current state, such as low-demand risk, static standing risk, or visual fatigue.

**How a vibe coder can implement it**
- Build a simple rules engine that looks at state values: `anchor.locked`, `taskLog.length`, `timer.mode`, `trail.pace`, and `terrain`.
- Generate one or two tip cards from rules such as “You’ve been sitting too long” or “Low ticket volume is a good time for a short learning task.”
- Keep the coach non-invasive: show it as a “Today’s wellbeing cue” panel in the hub.
- Use the existing icon/card styling to keep this feature aligned with the app UI.

## 9. Exportable Summary Report

**What it does**
- Creates a sharable day summary of anchor, task log, downtime loop, and reflections.

**How a vibe coder can implement it**
- Add a “Generate report” button in the end-of-day or task-log section.
- Build a text or markdown summary from current state objects.
- Use browser APIs to create a downloadable file with `new Blob([content], { type: 'text/plain' })` and `URL.createObjectURL`.
- Include a “Copy report” fallback using clipboard access.
- Keep the feature local-first: no backend needed, just client-side export.

## 10. Collaboration / Sharing Mode

**What it does**
- Lets users share a daily wellbeing plan or status update by link or clipboard.

**How a vibe coder can implement it**
- Add a “Share today” card with quick actions: copy summary, export note, or open `mailto:`.
- Use the existing `TaskLog` and `EndOfDay` state to create a concise summary payload.
- Optionally support a shareable query string or encoded state for easy copy/paste.
- Keep the first version simple: generate share text and allow copy-to-clipboard.
- This can be a natural extension of the existing task and reflection workflow.
