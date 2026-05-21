"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Anchor,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CircleCheck,
  ClipboardList,
  Clock,
  CloudFog,
  Compass,
  Copy,
  Flag,
  HeartPulse,
  House,
  LayoutDashboard,
  Leaf,
  Map as MapIcon,
  Mountain,
  NotebookPen,
  Pause,
  Play,
  Plus,
  RefreshCcw,
  Route,
  Save,
  Shield,
  Sprout,
  Sun,
  Timer,
} from "lucide-react";

type AppSection = "hub" | "waypoint";
type WaypointView = "home" | "anchor" | "trail";
type AnchorStep = "checkin" | "oneThing" | "protect";
type TimerMode = "work" | "break";
type DidOneThing = "Yes" | "Partly" | "No";
type PaceChoice = "yes" | "pushing" | "drifting";
type TerrainKey = "open" | "rocky" | "exposed" | "foggy";

type NervousOption = {
  label: string;
  tint: string;
  border: string;
  color: string;
};

type TaskEntry = {
  id: number;
  time: string;
  text: string;
};

type EndOfDay = {
  didOneThing: DidOneThing;
  wentWell: string;
  leaveBehind: string;
};

type AnchorData = {
  locked: boolean;
  nervous?: string;
  oneThing: string;
  protect: string;
  taskLog: TaskEntry[];
  end?: EndOfDay;
};

type TimerState = {
  mode: TimerMode;
  running: boolean;
  secondsLeft: number;
  workMinutes: number;
  breakMinutes: number;
};

type TerrainOption = {
  key: TerrainKey;
  label: string;
  description: string;
  suggestion: string;
  accent: string;
  Icon: LucideIcon;
};

type Examen = {
  alive: string;
  drained: string;
  carry: string;
};

type TrailToday = {
  terrain?: TerrainKey;
  pace?: PaceChoice;
  examen?: Examen;
};

type TrailEntry = {
  id: string;
  dateLabel: string;
  terrain: TerrainKey;
  word: string;
  examen: Examen;
};

type HubState = {
  capacity: "Light" | "Steady" | "Full";
  growthFocus: string;
  wellbeingGuardrail: string;
  learningMove: string;
  connectionMove: string;
};

const nervousOptions: NervousOption[] = [
  {
    label: "Flooded",
    tint: "#fff1f0",
    border: "#e7b5b0",
    color: "#9d3732",
  },
  {
    label: "Tense",
    tint: "#fff5ed",
    border: "#edc1a7",
    color: "#b45f2f",
  },
  {
    label: "Okay",
    tint: "#fff9e8",
    border: "#ead79e",
    color: "#8a6b24",
  },
  {
    label: "Settled",
    tint: "#edf8fa",
    border: "#a9d7de",
    color: "#2a7d8e",
  },
  {
    label: "Grounded",
    tint: "#eff8f2",
    border: "#a8d5b8",
    color: "#2f7a50",
  },
];

const terrainMap: Record<TerrainKey, TerrainOption> = {
  open: {
    key: "open",
    label: "Open ground",
    description: "Clear, energy good, ready to move.",
    suggestion: "Use the open space for one meaningful move.",
    accent: "#2a7d8e",
    Icon: Sun,
  },
  rocky: {
    key: "rocky",
    label: "Rocky",
    description: "Manageable, but needs care and attention.",
    suggestion: "Move deliberately. Leave room for uneven footing.",
    accent: "#e07b39",
    Icon: Mountain,
  },
  exposed: {
    key: "exposed",
    label: "Exposed",
    description: "Difficult conditions, just keep walking.",
    suggestion: "Reduce the load. Keep only what protects the next step.",
    accent: "#9d5338",
    Icon: Shield,
  },
  foggy: {
    key: "foggy",
    label: "Foggy",
    description: "Low visibility, uncertain, one step at a time.",
    suggestion: "You don't need to see far. Just the next step.",
    accent: "#5f748d",
    Icon: CloudFog,
  },
};

const terrainOptions = Object.values(terrainMap);

const didOneThingCopy: Record<DidOneThing, string> = {
  Yes: "Let that be enough for today.",
  Partly: "Partial progress still belongs to the day.",
  No: "Some days ask more than they give. Note it without a verdict.",
};

const paceCopy: Record<PaceChoice, string> = {
  yes: "",
  pushing: "Put one thing down before you take on the next.",
  drifting: "Choose the next small visible step.",
};

const sampleTrailHistory: TrailEntry[] = [
  {
    id: "sample-1",
    dateLabel: "Earlier this week",
    terrain: "rocky",
    word: "patience",
    examen: {
      alive: "A clear conversation that made the next decision simpler.",
      drained: "Too many open loops competing for attention.",
      carry: "Patience with the work that needs more than one pass.",
    },
  },
  {
    id: "sample-2",
    dateLabel: "Last waypoint",
    terrain: "foggy",
    word: "clarity",
    examen: {
      alive: "Solving one stubborn thing instead of scattering energy.",
      drained: "Starting before the shape of the day was visible.",
      carry: "Clarity comes after movement, not always before it.",
    },
  },
  {
    id: "sample-3",
    dateLabel: "A few days back",
    terrain: "open",
    word: "steady",
    examen: {
      alive: "An hour of work with no switching.",
      drained: "Trying to hold every detail in mind at once.",
      carry: "A steadier morning rhythm.",
    },
  },
];

const initialAnchor: AnchorData = {
  locked: false,
  oneThing: "",
  protect: "",
  taskLog: [],
};

const initialTimer: TimerState = {
  mode: "work",
  running: false,
  secondsLeft: 25 * 60,
  workMinutes: 25,
  breakMinutes: 5,
};

export default function Home() {
  const [section, setSection] = useState<AppSection>("hub");
  const [waypointView, setWaypointView] = useState<WaypointView>("home");
  const [hub, setHub] = useState<HubState>({
    capacity: "Steady",
    growthFocus: "",
    wellbeingGuardrail: "",
    learningMove: "",
    connectionMove: "",
  });
  const [anchor, setAnchor] = useState<AnchorData>(initialAnchor);
  const [trail, setTrail] = useState<TrailToday>({});
  const [trailHistory, setTrailHistory] =
    useState<TrailEntry[]>(sampleTrailHistory);

  function openWaypoint(view: WaypointView) {
    setSection("waypoint");
    setWaypointView(view);
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-[#1a2e4a]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <AppHeader
          section={section}
          setSection={setSection}
          setWaypointView={setWaypointView}
        />

        <div className="flex-1">
          {section === "hub" ? (
            <HubSection
              hub={hub}
              setHub={setHub}
              anchor={anchor}
              trail={trail}
              openWaypoint={openWaypoint}
            />
          ) : (
            <WaypointSection
              view={waypointView}
              setView={setWaypointView}
              anchor={anchor}
              setAnchor={setAnchor}
              trail={trail}
              setTrail={setTrail}
              trailHistory={trailHistory}
              setTrailHistory={setTrailHistory}
            />
          )}
        </div>
      </div>

      {section === "waypoint" ? (
        <WaypointBottomNav view={waypointView} setView={setWaypointView} />
      ) : null}
    </main>
  );
}

function AppHeader({
  section,
  setSection,
  setWaypointView,
}: {
  section: AppSection;
  setSection: (section: AppSection) => void;
  setWaypointView: (view: WaypointView) => void;
}) {
  function chooseSection(next: AppSection) {
    setSection(next);
    if (next === "waypoint") {
      setWaypointView("home");
    }
  }

  return (
    <header className="mb-5 flex flex-col gap-4 border-b border-[#dbe3e0] pb-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2a7d8e]">
          Professional Growth & Wellbeing Hub
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#1a2e4a] md:text-4xl">
          Waypoint
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-1 rounded-lg border border-[#dbe3e0] bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => chooseSection("hub")}
          className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
            section === "hub"
              ? "bg-[#1a2e4a] text-white"
              : "text-[#38506b] hover:bg-[#eef4f3]"
          }`}
        >
          <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
          Growth Hub
        </button>
        <button
          type="button"
          onClick={() => chooseSection("waypoint")}
          className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
            section === "waypoint"
              ? "bg-[#1a2e4a] text-white"
              : "text-[#38506b] hover:bg-[#eef4f3]"
          }`}
        >
          <Compass className="h-4 w-4" aria-hidden="true" />
          Waypoint
        </button>
      </div>
    </header>
  );
}

function HubSection({
  hub,
  setHub,
  anchor,
  trail,
  openWaypoint,
}: {
  hub: HubState;
  setHub: (hub: HubState) => void;
  anchor: AnchorData;
  trail: TrailToday;
  openWaypoint: (view: WaypointView) => void;
}) {
  const terrain = trail.terrain ? terrainMap[trail.terrain] : null;
  const nervous = anchor.nervous
    ? nervousOptions.find((option) => option.label === anchor.nervous)
    : null;

  function updateHub(field: keyof HubState, value: string) {
    setHub({ ...hub, [field]: value });
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-[#edf8fa] p-2 text-[#2a7d8e]">
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Professional Growth & Wellbeing Hub
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#5d6f82]">
                Keep the work meaningful, sustainable, and specific enough to
                act on today.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {(["Light", "Steady", "Full"] as HubState["capacity"][]).map(
              (capacity) => (
                <button
                  key={capacity}
                  type="button"
                  onClick={() => setHub({ ...hub, capacity })}
                  className={`rounded-lg border p-4 text-left transition ${
                    hub.capacity === capacity
                      ? "border-[#2a7d8e] bg-[#edf8fa]"
                      : "border-[#dbe3e0] bg-[#fbfcfb] hover:border-[#9fcbd2]"
                  }`}
                >
                  <p className="text-sm font-semibold">{capacity}</p>
                  <p className="mt-1 text-xs leading-5 text-[#607286]">
                    {capacity === "Light"
                      ? "Protect margin."
                      : capacity === "Steady"
                        ? "Move with rhythm."
                        : "Choose the load carefully."}
                  </p>
                </button>
              ),
            )}
          </div>
        </div>

        <div className="rounded-lg border border-[#dbe3e0] bg-[#1a2e4a] p-5 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-white/10 p-2">
              <HeartPulse className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold">Today at a glance</h2>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => openWaypoint("anchor")}
              className="rounded-lg border border-white/15 bg-white/[0.08] p-3 text-left hover:bg-white/[0.12]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                Anchor
              </p>
              <p className="mt-2 text-sm font-semibold">
                {anchor.locked ? anchor.oneThing : "Not set"}
              </p>
              {nervous ? (
                <span
                  className="mt-3 inline-flex rounded-md px-2 py-1 text-xs font-semibold"
                  style={{ backgroundColor: nervous.tint, color: nervous.color }}
                >
                  {nervous.label}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => openWaypoint("trail")}
              className="rounded-lg border border-white/15 bg-white/[0.08] p-3 text-left hover:bg-white/[0.12]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                Trail
              </p>
              <p className="mt-2 text-sm font-semibold">
                {terrain ? terrain.label : "No terrain"}
              </p>
              {terrain ? (
                <p className="mt-3 text-xs leading-5 text-white/70">
                  {terrain.suggestion}
                </p>
              ) : null}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <HubPrompt
          icon={Sprout}
          title="Growth focus"
          value={hub.growthFocus}
          placeholder="A skill, decision, or craft edge to work on"
          onChange={(value) => updateHub("growthFocus", value)}
        />
        <HubPrompt
          icon={Shield}
          title="Wellbeing guardrail"
          value={hub.wellbeingGuardrail}
          placeholder="A boundary, recovery move, or constraint to honour"
          onChange={(value) => updateHub("wellbeingGuardrail", value)}
        />
        <HubPrompt
          icon={BookOpen}
          title="Learning move"
          value={hub.learningMove}
          placeholder="One article, practice rep, course note, or question"
          onChange={(value) => updateHub("learningMove", value)}
        />
        <HubPrompt
          icon={Route}
          title="Connection move"
          value={hub.connectionMove}
          placeholder="One person, conversation, or repair worth making"
          onChange={(value) => updateHub("connectionMove", value)}
        />
      </div>

      <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#2a7d8e]">Waypoint</p>
            <h2 className="mt-1 text-xl font-semibold">
              Daily grounding, focus, and reflection
            </h2>
          </div>
          <button
            type="button"
            onClick={() => openWaypoint("home")}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#e07b39] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#c9672e]"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            Open Waypoint
          </button>
        </div>
      </div>
    </section>
  );
}

function HubPrompt({
  icon: Icon,
  title,
  value,
  placeholder,
  onChange,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-lg border border-[#dbe3e0] bg-white p-4 shadow-sm">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-[#2a7d8e]" aria-hidden="true" />
        {title}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-3 w-full resize-none rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-[#8a9aaa] focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
      />
    </label>
  );
}

function WaypointSection({
  view,
  setView,
  anchor,
  setAnchor,
  trail,
  setTrail,
  trailHistory,
  setTrailHistory,
}: {
  view: WaypointView;
  setView: (view: WaypointView) => void;
  anchor: AnchorData;
  setAnchor: (anchor: AnchorData) => void;
  trail: TrailToday;
  setTrail: (trail: TrailToday) => void;
  trailHistory: TrailEntry[];
  setTrailHistory: (history: TrailEntry[]) => void;
}) {
  if (view === "anchor") {
    return <AnchorModule anchor={anchor} setAnchor={setAnchor} />;
  }

  if (view === "trail") {
    return (
      <TrailModule
        trail={trail}
        setTrail={setTrail}
        trailHistory={trailHistory}
        setTrailHistory={setTrailHistory}
      />
    );
  }

  return (
    <WaypointHome
      anchor={anchor}
      trail={trail}
      setView={setView}
      trailHistory={trailHistory}
    />
  );
}

function WaypointHome({
  anchor,
  trail,
  setView,
  trailHistory,
}: {
  anchor: AnchorData;
  trail: TrailToday;
  setView: (view: WaypointView) => void;
  trailHistory: TrailEntry[];
}) {
  const terrain = trail.terrain ? terrainMap[trail.terrain] : null;
  const nervous = anchor.nervous
    ? nervousOptions.find((option) => option.label === anchor.nervous)
    : null;

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-[#edf8fa] p-2 text-[#2a7d8e]">
            <Compass className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2a7d8e]">Waypoint Home</p>
            <h2 className="mt-1 text-2xl font-semibold">
              Today&apos;s status across Anchor and Trail
            </h2>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setView("anchor")}
            className="rounded-lg border border-[#dbe3e0] bg-[#fbfcfb] p-4 text-left transition hover:border-[#9fcbd2]"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Anchor className="h-4 w-4 text-[#2a7d8e]" aria-hidden="true" />
              Anchor
            </div>
            {anchor.locked ? (
              <div className="mt-4 space-y-3">
                {nervous ? (
                  <span
                    className="inline-flex rounded-md border px-2 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: nervous.tint,
                      borderColor: nervous.border,
                      color: nervous.color,
                    }}
                  >
                    {nervous.label}
                  </span>
                ) : null}
                <p className="text-base font-semibold leading-6">
                  {anchor.oneThing}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-[#607286]">
                Set the morning anchor.
              </p>
            )}
          </button>

          <button
            type="button"
            onClick={() => setView("trail")}
            className="rounded-lg border border-[#dbe3e0] bg-[#fbfcfb] p-4 text-left transition hover:border-[#9fcbd2]"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapIcon className="h-4 w-4 text-[#e07b39]" aria-hidden="true" />
              Trail
            </div>
            {terrain ? (
              <div className="mt-4 space-y-3">
                <span
                  className="inline-flex rounded-md border px-2 py-1 text-xs font-semibold"
                  style={{
                    borderColor: terrain.accent,
                    color: terrain.accent,
                    backgroundColor: "#fffaf5",
                  }}
                >
                  {terrain.label}
                </span>
                <p className="text-sm leading-6 text-[#607286]">
                  {terrain.suggestion}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-[#607286]">
                Choose today&apos;s terrain.
              </p>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <HomeMetric
          icon={Timer}
          label="Focus block"
          value={anchor.locked ? "Ready" : "Anchor first"}
        />
        <HomeMetric
          icon={ClipboardList}
          label="Evidence logged"
          value={`${anchor.taskLog.length} ${anchor.taskLog.length === 1 ? "entry" : "entries"}`}
        />
        <HomeMetric
          icon={Flag}
          label="Trail markers"
          value={`${trailHistory.length + (trail.examen ? 1 : 0)} saved`}
        />
      </div>
    </section>
  );
}

function HomeMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#607286]">
        <Icon className="h-4 w-4 text-[#2a7d8e]" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-3 text-2xl font-semibold text-[#1a2e4a]">{value}</p>
    </div>
  );
}

function AnchorModule({
  anchor,
  setAnchor,
}: {
  anchor: AnchorData;
  setAnchor: (anchor: AnchorData) => void;
}) {
  const [step, setStep] = useState<AnchorStep>("checkin");
  const [draft, setDraft] = useState({
    nervous: "",
    oneThing: "",
    protect: "",
  });

  if (!anchor.locked) {
    return (
      <AnchorSequence
        step={step}
        setStep={setStep}
        draft={draft}
        setDraft={setDraft}
        onLock={() =>
          setAnchor({
            ...anchor,
            locked: true,
            nervous: draft.nervous,
            oneThing: draft.oneThing.trim(),
            protect: draft.protect.trim(),
          })
        }
      />
    );
  }

  return (
    <section className="space-y-5">
      <SectionHeading
        icon={Anchor}
        label="Anchor"
        title="The anchor is set"
        text="Structure for the work, room for the nervous system."
      />

      <AnchorSummaryCard anchor={anchor} />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <FocusTimer oneThing={anchor.oneThing} />
        <TaskLog anchor={anchor} setAnchor={setAnchor} />
      </div>

      <EndOfDay anchor={anchor} setAnchor={setAnchor} />
    </section>
  );
}

function AnchorSequence({
  step,
  setStep,
  draft,
  setDraft,
  onLock,
}: {
  step: AnchorStep;
  setStep: (step: AnchorStep) => void;
  draft: { nervous: string; oneThing: string; protect: string };
  setDraft: (draft: { nervous: string; oneThing: string; protect: string }) => void;
  onLock: () => void;
}) {
  if (step === "checkin") {
    return (
      <section className="mx-auto flex min-h-[58vh] max-w-2xl flex-col justify-center">
        <p className="text-sm font-semibold text-[#2a7d8e]">Anchor</p>
        <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
          How&apos;s your nervous system right now?
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          {nervousOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                setDraft({ ...draft, nervous: option.label });
                setStep("oneThing");
              }}
              className="rounded-lg border px-4 py-4 text-center text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                backgroundColor: option.tint,
                borderColor: option.border,
                color: option.color,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (step === "oneThing") {
    return (
      <section className="mx-auto flex min-h-[58vh] max-w-2xl flex-col justify-center">
        <button
          type="button"
          onClick={() => setStep("checkin")}
          className="mb-6 self-start rounded-md border border-[#dbe3e0] px-3 py-2 text-sm font-semibold text-[#607286] hover:bg-white"
        >
          Back
        </button>
        <label>
          <span className="block text-2xl font-semibold md:text-3xl">
            What&apos;s the one thing that matters most today?
          </span>
          <input
            value={draft.oneThing}
            onChange={(event) =>
              setDraft({ ...draft, oneThing: event.target.value })
            }
            autoFocus
            className="mt-6 w-full rounded-lg border border-[#dbe3e0] bg-white px-4 py-5 text-2xl font-semibold leading-tight outline-none transition placeholder:text-[#a0adba] focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
            placeholder="One meaningful thing"
          />
        </label>
        <button
          type="button"
          disabled={!draft.oneThing.trim()}
          onClick={() => setStep("protect")}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-[#9aa8b6]"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          Continue
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[58vh] max-w-2xl flex-col justify-center">
      <button
        type="button"
        onClick={() => setStep("oneThing")}
        className="mb-6 self-start rounded-md border border-[#dbe3e0] px-3 py-2 text-sm font-semibold text-[#607286] hover:bg-white"
      >
        Back
      </button>
      <label>
        <span className="block text-2xl font-semibold md:text-3xl">
          What do you need to protect today?
        </span>
        <textarea
          value={draft.protect}
          onChange={(event) =>
            setDraft({ ...draft, protect: event.target.value })
          }
          rows={4}
          className="mt-6 w-full resize-none rounded-lg border border-[#dbe3e0] bg-white px-4 py-4 text-lg leading-7 outline-none transition placeholder:text-[#a0adba] focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
          placeholder="A lunch break, one quiet hour, a walk"
        />
      </label>
      <button
        type="button"
        disabled={!draft.protect.trim()}
        onClick={onLock}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-[#e07b39] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c9672e] disabled:cursor-not-allowed disabled:bg-[#d1a48b]"
      >
        <Anchor className="h-4 w-4" aria-hidden="true" />
        Set anchor
      </button>
    </section>
  );
}

function AnchorSummaryCard({ anchor }: { anchor: AnchorData }) {
  const nervous = anchor.nervous
    ? nervousOptions.find((option) => option.label === anchor.nervous)
    : null;

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#607286]">One thing</p>
          <h3 className="mt-1 text-2xl font-semibold leading-tight">
            {anchor.oneThing}
          </h3>
        </div>
        {nervous ? (
          <span
            className="inline-flex self-start rounded-md border px-3 py-2 text-sm font-semibold"
            style={{
              backgroundColor: nervous.tint,
              borderColor: nervous.border,
              color: nervous.color,
            }}
          >
            {nervous.label}
          </span>
        ) : null}
      </div>
      <div className="mt-5 border-t border-[#e4ebe8] pt-4">
        <p className="text-sm font-semibold text-[#607286]">Protected today</p>
        <p className="mt-1 text-base leading-7">{anchor.protect}</p>
      </div>
    </div>
  );
}

function FocusTimer({ oneThing }: { oneThing: string }) {
  const [timer, setTimer] = useState<TimerState>(initialTimer);

  useEffect(() => {
    if (!timer.running) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimer((current) => {
        if (current.secondsLeft <= 1) {
          const nextMode: TimerMode = current.mode === "work" ? "break" : "work";
          const nextSeconds =
            nextMode === "work"
              ? current.workMinutes * 60
              : current.breakMinutes * 60;

          return {
            ...current,
            mode: nextMode,
            running: false,
            secondsLeft: nextSeconds,
          };
        }

        return { ...current, secondsLeft: current.secondsLeft - 1 };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timer.running]);

  function setMinutes(kind: "workMinutes" | "breakMinutes", value: string) {
    const parsed = Number(value);
    const minutes = Number.isFinite(parsed)
      ? Math.min(Math.max(Math.round(parsed), 1), 90)
      : 1;

    setTimer((current) => {
      const isCurrentMode =
        (kind === "workMinutes" && current.mode === "work") ||
        (kind === "breakMinutes" && current.mode === "break");

      return {
        ...current,
        [kind]: minutes,
        secondsLeft:
          !current.running && isCurrentMode ? minutes * 60 : current.secondsLeft,
      };
    });
  }

  function resetTimer() {
    setTimer((current) => ({
      ...current,
      running: false,
      secondsLeft:
        current.mode === "work"
          ? current.workMinutes * 60
          : current.breakMinutes * 60,
    }));
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Focus Block Timer</h3>
        </div>
        <span className="rounded-md bg-[#eef4f3] px-2 py-1 text-xs font-semibold text-[#607286]">
          {timer.mode === "work" ? "25/5" : "Break"}
        </span>
      </div>

      <div className="mt-5 flex min-h-[270px] items-center justify-center rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-5 text-center">
        {timer.mode === "work" ? (
          <div>
            <p className="mx-auto max-w-md text-2xl font-semibold leading-tight md:text-3xl">
              {oneThing}
            </p>
            <p className="mt-6 font-mono text-4xl font-semibold text-[#2a7d8e]">
              {formatTimer(timer.secondsLeft)}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5" aria-label="Box breathing">
            <div className="breath-frame">
              <div className="breath-dot" />
              <span className="breath-count">4</span>
            </div>
            <div className="grid grid-cols-4 gap-2 font-mono text-sm font-semibold text-[#2a7d8e]">
              <span>4</span>
              <span>4</span>
              <span>4</span>
              <span>4</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() =>
            setTimer((current) => ({ ...current, running: !current.running }))
          }
          aria-label={timer.running ? "Pause timer" : "Start timer"}
          title={timer.running ? "Pause" : "Start"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#1a2e4a] text-white transition hover:bg-[#243f63]"
        >
          {timer.running ? (
            <Pause className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Play className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          aria-label="Reset timer"
          title="Reset"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#dbe3e0] bg-white text-[#607286] transition hover:bg-[#eef4f3]"
        >
          <RefreshCcw className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {!timer.running ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold text-[#607286]">
            Work
            <input
              type="number"
              min={1}
              max={90}
              value={timer.workMinutes}
              onChange={(event) => setMinutes("workMinutes", event.target.value)}
              className="mt-2 w-full rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-2 text-[#1a2e4a] outline-none focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
            />
          </label>
          <label className="text-sm font-semibold text-[#607286]">
            Break
            <input
              type="number"
              min={1}
              max={30}
              value={timer.breakMinutes}
              onChange={(event) => setMinutes("breakMinutes", event.target.value)}
              className="mt-2 w-full rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-2 text-[#1a2e4a] outline-none focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}

function TaskLog({
  anchor,
  setAnchor,
}: {
  anchor: AnchorData;
  setAnchor: (anchor: AnchorData) => void;
}) {
  const [entry, setEntry] = useState("");
  const [copied, setCopied] = useState(false);

  function addEntry() {
    const text = entry.trim();
    if (!text) {
      return;
    }

    setAnchor({
      ...anchor,
      taskLog: [
        { id: Date.now(), time: formatTimeOfDay(new Date()), text },
        ...anchor.taskLog,
      ],
    });
    setEntry("");
  }

  async function copyLog() {
    const text = anchor.taskLog
      .slice()
      .reverse()
      .map((item) => `${item.time} - ${item.text}`)
      .join("\n");

    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Task Log</h3>
        </div>
        <button
          type="button"
          onClick={copyLog}
          disabled={anchor.taskLog.length === 0}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#dbe3e0] text-[#607286] transition hover:bg-[#eef4f3] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Copy task log"
          title={copied ? "Copied" : "Copy"}
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 flex gap-2">
        <input
          value={entry}
          onChange={(event) => setEntry(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addEntry();
            }
          }}
          placeholder="Log what you actually did"
          className="min-w-0 flex-1 rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-3 text-sm outline-none placeholder:text-[#8a9aaa] focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
        />
        <button
          type="button"
          onClick={addEntry}
          aria-label="Add task log entry"
          className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[#2a7d8e] text-white transition hover:bg-[#246b79]"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 max-h-72 space-y-3 overflow-y-auto pr-1">
        {anchor.taskLog.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#dbe3e0] bg-[#fbfcfb] p-4 text-sm leading-6 text-[#607286]">
            Evidence of work will appear here as the day unfolds.
          </p>
        ) : (
          anchor.taskLog.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[4.75rem_1fr] gap-3 rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-3 text-sm"
            >
              <span className="font-mono text-xs font-semibold text-[#8a9aaa]">
                {item.time}
              </span>
              <span className="leading-5">{item.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EndOfDay({
  anchor,
  setAnchor,
}: {
  anchor: AnchorData;
  setAnchor: (anchor: AnchorData) => void;
}) {
  const [draft, setDraft] = useState<EndOfDay>({
    didOneThing: "Partly",
    wentWell: "",
    leaveBehind: "",
  });

  if (anchor.end) {
    return <FullDayCard anchor={anchor} />;
  }

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">End of Day</h3>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <p className="text-sm font-semibold">Did you do the one thing?</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {(["Yes", "Partly", "No"] as DidOneThing[]).map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => setDraft({ ...draft, didOneThing: choice })}
                className={`rounded-lg border p-3 text-left transition ${
                  draft.didOneThing === choice
                    ? "border-[#2a7d8e] bg-[#edf8fa]"
                    : "border-[#dbe3e0] bg-[#fbfcfb] hover:border-[#9fcbd2]"
                }`}
              >
                <span className="text-sm font-semibold">{choice}</span>
                <span className="mt-1 block text-xs leading-5 text-[#607286]">
                  {didOneThingCopy[choice]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <ReflectionTextarea
          label={"What's one thing that went well?"}
          value={draft.wentWell}
          onChange={(value) => setDraft({ ...draft, wentWell: value })}
        />
        <ReflectionTextarea
          label="What do you want to leave here?"
          value={draft.leaveBehind}
          onChange={(value) => setDraft({ ...draft, leaveBehind: value })}
        />

        <button
          type="button"
          disabled={!draft.wentWell.trim() || !draft.leaveBehind.trim()}
          onClick={() => setAnchor({ ...anchor, end: draft })}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#243f63] disabled:cursor-not-allowed disabled:bg-[#9aa8b6]"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save day card
        </button>
      </div>
    </div>
  );
}

function FullDayCard({ anchor }: { anchor: AnchorData }) {
  const nervous = anchor.nervous
    ? nervousOptions.find((option) => option.label === anchor.nervous)
    : null;

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <NotebookPen className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Full day card</h3>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <DayCardItem label="Nervous system" value={anchor.nervous || "Not set"}>
          {nervous ? (
            <span
              className="mt-2 inline-flex rounded-md border px-2 py-1 text-xs font-semibold"
              style={{
                backgroundColor: nervous.tint,
                borderColor: nervous.border,
                color: nervous.color,
              }}
            >
              {nervous.label}
            </span>
          ) : null}
        </DayCardItem>
        <DayCardItem label="The one thing" value={anchor.oneThing} />
        <DayCardItem label="Protected" value={anchor.protect} />
        <DayCardItem
          label="Did the one thing"
          value={anchor.end?.didOneThing || "Not noted"}
        />
        <DayCardItem
          label="Went well"
          value={anchor.end?.wentWell || "Not noted"}
        />
        <DayCardItem
          label="Left behind"
          value={anchor.end?.leaveBehind || "Not noted"}
        />
      </div>
    </div>
  );
}

function DayCardItem({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9aaa]">
        {label}
      </p>
      {children || <p className="mt-2 text-sm leading-6">{value}</p>}
    </div>
  );
}

function TrailModule({
  trail,
  setTrail,
  trailHistory,
  setTrailHistory,
}: {
  trail: TrailToday;
  setTrail: (trail: TrailToday) => void;
  trailHistory: TrailEntry[];
  setTrailHistory: (history: TrailEntry[]) => void;
}) {
  const [examenDraft, setExamenDraft] = useState<Examen>({
    alive: trail.examen?.alive || "",
    drained: trail.examen?.drained || "",
    carry: trail.examen?.carry || "",
  });
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);

  const todayEntry = useMemo<TrailEntry | null>(() => {
    if (!trail.examen || !trail.terrain) {
      return null;
    }

    return {
      id: "today",
      dateLabel: "Today",
      terrain: trail.terrain,
      word: extractOneWord(trail.examen),
      examen: trail.examen,
    };
  }, [trail.examen, trail.terrain]);

  const trailEntries = useMemo(
    () => (todayEntry ? [todayEntry, ...trailHistory] : trailHistory),
    [todayEntry, trailHistory],
  );

  const selectedEntry =
    trailEntries.find((entry) => entry.id === selectedTrailId) || null;

  function saveExamen() {
    if (!trail.terrain) {
      return;
    }

    const saved = {
      alive: examenDraft.alive.trim(),
      drained: examenDraft.drained.trim(),
      carry: examenDraft.carry.trim(),
    };

    if (!saved.alive && !saved.drained && !saved.carry) {
      return;
    }

    setTrail({ ...trail, examen: saved });
    setTrailHistory(trailHistory.filter((entry) => entry.id !== "today"));
    setSelectedTrailId("today");
  }

  return (
    <section className="space-y-5">
      <SectionHeading
        icon={MapIcon}
        label="Trail"
        title="Reflection, pace, and purpose"
        text="A map of terrain, rest, direction, and what the day taught you."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <MorningWaypoint trail={trail} setTrail={setTrail} />
        <PaceCheck trail={trail} setTrail={setTrail} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <ExamenCard
          trail={trail}
          draft={examenDraft}
          setDraft={setExamenDraft}
          saveExamen={saveExamen}
        />
        <TrailLog
          entries={trailEntries}
          selectedEntry={selectedEntry}
          setSelectedTrailId={setSelectedTrailId}
        />
      </div>
    </section>
  );
}

function MorningWaypoint({
  trail,
  setTrail,
}: {
  trail: TrailToday;
  setTrail: (trail: TrailToday) => void;
}) {
  const selected = trail.terrain ? terrainMap[trail.terrain] : null;

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Compass className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Morning Waypoint</h3>
      </div>
      <p className="mt-4 text-xl font-semibold">
        What kind of terrain are you walking today?
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {terrainOptions.map((option) => {
          const Icon = option.Icon;
          const isSelected = trail.terrain === option.key;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setTrail({ ...trail, terrain: option.key })}
              className={`rounded-lg border p-4 text-left transition ${
                isSelected
                  ? "border-[#2a7d8e] bg-[#edf8fa]"
                  : "border-[#dbe3e0] bg-[#fbfcfb] hover:border-[#9fcbd2]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className="h-5 w-5"
                  aria-hidden="true"
                  style={{ color: option.accent }}
                />
                <span className="font-semibold">{option.label}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#607286]">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {selected ? (
        <p className="mt-5 rounded-lg border border-[#e4ebe8] bg-[#fffaf5] p-4 text-sm font-medium leading-6 text-[#5d6f82]">
          {selected.suggestion}
        </p>
      ) : null}
    </div>
  );
}

function PaceCheck({
  trail,
  setTrail,
}: {
  trail: TrailToday;
  setTrail: (trail: TrailToday) => void;
}) {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Leaf className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Pace Check</h3>
      </div>
      <p className="mt-4 text-xl font-semibold">
        Are you moving at a sustainable pace?
      </p>
      <div className="mt-5 grid gap-2">
        {[
          { key: "yes", label: "Yes" },
          { key: "pushing", label: "Pushing too hard" },
          { key: "drifting", label: "Drifting" },
        ].map((choice) => (
          <button
            key={choice.key}
            type="button"
            onClick={() =>
              setTrail({ ...trail, pace: choice.key as PaceChoice })
            }
            className={`rounded-lg border p-3 text-left text-sm font-semibold transition ${
              trail.pace === choice.key
                ? "border-[#2a7d8e] bg-[#edf8fa]"
                : "border-[#dbe3e0] bg-[#fbfcfb] hover:border-[#9fcbd2]"
            }`}
          >
            {choice.label}
          </button>
        ))}
      </div>

      {trail.pace ? (
        <div className="mt-5 rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4 text-center">
          {trail.pace === "yes" ? (
            <CircleCheck
              className="mx-auto h-10 w-10 text-[#2a7d8e]"
              aria-label="Thumbs up"
            />
          ) : (
            <p className="text-sm font-medium leading-6 text-[#607286]">
              {paceCopy[trail.pace]}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ExamenCard({
  trail,
  draft,
  setDraft,
  saveExamen,
}: {
  trail: TrailToday;
  draft: Examen;
  setDraft: (draft: Examen) => void;
  saveExamen: () => void;
}) {
  const hasText = draft.alive.trim() || draft.drained.trim() || draft.carry.trim();

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <NotebookPen className="h-5 w-5 text-[#2a7d8e]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Examen</h3>
      </div>
      <div className="mt-5 space-y-4">
        <ReflectionTextarea
          label="Where did you feel most alive today?"
          value={draft.alive}
          onChange={(value) => setDraft({ ...draft, alive: value })}
        />
        <ReflectionTextarea
          label="Where did you feel most drained?"
          value={draft.drained}
          onChange={(value) => setDraft({ ...draft, drained: value })}
        />
        <ReflectionTextarea
          label="What do you want to carry forward into tomorrow?"
          value={draft.carry}
          onChange={(value) => setDraft({ ...draft, carry: value })}
        />

        <button
          type="button"
          onClick={saveExamen}
          disabled={!trail.terrain || !hasText}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#243f63] disabled:cursor-not-allowed disabled:bg-[#9aa8b6]"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save reflection
        </button>
      </div>
    </div>
  );
}

function TrailLog({
  entries,
  selectedEntry,
  setSelectedTrailId,
}: {
  entries: TrailEntry[];
  selectedEntry: TrailEntry | null;
  setSelectedTrailId: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Flag className="h-5 w-5 text-[#e07b39]" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Trail Log</h3>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[0.85fr_1fr]">
        <div className="relative max-h-[440px] overflow-y-auto pl-5 pr-1">
          <div className="absolute bottom-3 left-[0.68rem] top-3 w-px bg-[#dbe3e0]" />
          <div className="space-y-3">
            {entries.map((entry) => {
              const terrain = terrainMap[entry.terrain];

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedTrailId(entry.id)}
                  className={`relative w-full rounded-lg border bg-[#fbfcfb] p-3 text-left transition hover:border-[#9fcbd2] ${
                    selectedEntry?.id === entry.id
                      ? "border-[#2a7d8e]"
                      : "border-[#e4ebe8]"
                  }`}
                >
                  <span
                    className="absolute -left-[1.1rem] top-4 h-3 w-3 rounded-sm border-2 border-white"
                    style={{ backgroundColor: terrain.accent }}
                  />
                  <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9aaa]">
                    {entry.dateLabel}
                  </span>
                  <span className="mt-1 block text-sm font-semibold">
                    {terrain.label}
                  </span>
                  <span className="mt-1 block text-sm text-[#607286]">
                    {entry.word}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-[#e4ebe8] bg-[#fbfcfb] p-4">
          {selectedEntry ? (
            <TrailEntryDetail entry={selectedEntry} />
          ) : (
            <p className="text-sm leading-6 text-[#607286]">
              Select a marker to open the reflection.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function TrailEntryDetail({ entry }: { entry: TrailEntry }) {
  const terrain = terrainMap[entry.terrain];
  const Icon = terrain.Icon;

  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon
          className="h-5 w-5"
          aria-hidden="true"
          style={{ color: terrain.accent }}
        />
        <div>
          <p className="text-sm font-semibold">{terrain.label}</p>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9aaa]">
            {entry.dateLabel}
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <ReadOnlyReflection
          label="Most alive"
          value={entry.examen.alive || "Not noted"}
        />
        <ReadOnlyReflection
          label="Most drained"
          value={entry.examen.drained || "Not noted"}
        />
        <ReadOnlyReflection
          label="Carry forward"
          value={entry.examen.carry || "Not noted"}
        />
      </div>
    </div>
  );
}

function ReadOnlyReflection({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9aaa]">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-[#1a2e4a]">{value}</p>
    </div>
  );
}

function ReflectionTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="mt-2 w-full resize-none rounded-md border border-[#dbe3e0] bg-[#fbfcfb] px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-[#8a9aaa] focus:border-[#2a7d8e] focus:ring-2 focus:ring-[#2a7d8e]/15"
      />
    </label>
  );
}

function SectionHeading({
  icon: Icon,
  label,
  title,
  text,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-[#edf8fa] p-2 text-[#2a7d8e]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#2a7d8e]">{label}</p>
          <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-[#607286]">{text}</p>
        </div>
      </div>
    </div>
  );
}

function WaypointBottomNav({
  view,
  setView,
}: {
  view: WaypointView;
  setView: (view: WaypointView) => void;
}) {
  const items: { view: WaypointView; label: string; Icon: LucideIcon }[] = [
    { view: "home", label: "Home", Icon: House },
    { view: "anchor", label: "Anchor", Icon: Anchor },
    { view: "trail", label: "Trail", Icon: MapIcon },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#dbe3e0] bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(26,46,74,0.08)] backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {items.map(({ view: itemView, label, Icon }) => (
          <button
            key={itemView}
            type="button"
            onClick={() => setView(itemView)}
            className={`flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-semibold transition ${
              view === itemView
                ? "bg-[#1a2e4a] text-white"
                : "text-[#607286] hover:bg-[#eef4f3]"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function formatTimeOfDay(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function extractOneWord(examen: Examen) {
  const stopWords = new Set([
    "about",
    "after",
    "again",
    "being",
    "from",
    "into",
    "more",
    "most",
    "that",
    "the",
    "this",
    "today",
    "with",
    "work",
    "your",
  ]);
  const words = `${examen.carry} ${examen.alive} ${examen.drained}`
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  return words[0] || "noted";
}
