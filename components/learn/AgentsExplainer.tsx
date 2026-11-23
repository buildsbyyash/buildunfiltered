"use client";
import { useEffect, useMemo, useRef, useState } from "react";

/* How AI agents work: ten stops, each with one thing to play with.
   Teaching page for the agentic AI masterclass. Plain words, no code.
   Every number that comes from the real world carries its source and date
   (see SOURCES at the bottom); illustrations are labelled as illustrations. */

const STOPS = [
  { id: "llm", n: "01", label: "The brain" },
  { id: "tokens", n: "02", label: "Tokens" },
  { id: "context", n: "03", label: "Context window" },
  { id: "agent", n: "04", label: "What is an AI agent" },
  { id: "memory", n: "05", label: "Memory" },
  { id: "tools", n: "06", label: "Tools" },
  { id: "autonomy", n: "07", label: "Autonomy" },
  { id: "workflow", n: "08", label: "Workflow or agent" },
  { id: "build", n: "09", label: "Today's build" },
  { id: "cost", n: "10", label: "What it costs" },
];

export default function AgentsExplainer() {
  const [presenting, setPresenting] = useState(false);

  useEffect(() => {
    if (!presenting) return;
    const ids = ["top", ...STOPS.map((s) => s.id)];
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "Escape") { setPresenting(false); return; }
      const fwd = ["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key);
      const back = ["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key);
      if (!fwd && !back) return;
      e.preventDefault();
      const mid = window.innerHeight * 0.35;
      let cur = 0;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mid) cur = i;
      });
      const next = Math.max(0, Math.min(ids.length - 1, cur + (fwd ? 1 : -1)));
      document.getElementById(ids[next])?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presenting]);

  return (
    <div className={`lx${presenting ? " presenting" : ""}`}>
      <section id="top" className="lx-hero wrap">
        <p className="eyebrow">Learn · 01</p>
        <h1 className="finder-title">How AI agents work</h1>
        <p className="finder-lede">
          From a model that guesses the next word to an agent that finds you jobs every morning.
          Ten stops, no code. Each stop has something to press.
        </p>
        <ol className="lx-index">
          {STOPS.map((s) => (
            <li key={s.id}><a href={`#${s.id}`}><span className="mono">{s.n}</span>{s.label}</a></li>
          ))}
        </ol>
        <div className="lx-present">
          <button className="lx-btn" onClick={() => setPresenting((p) => !p)} aria-pressed={presenting}>
            {presenting ? "Exit present mode" : "Present mode"}
          </button>
          <span className="lx-note">{presenting ? "Arrow keys move between stops. Esc to exit." : "Bigger text, one stop per screen, arrow keys to move."}</span>
        </div>
      </section>

      <Stop id="llm" n="01" kicker="The brain" title="An LLM guesses the next word"
        lede="ChatGPT, Claude and Gemini are all large language models (LLMs). Each one has read a huge amount of text and learnt one skill: given some words, guess what comes next. Do that very fast, over and over, and you get whole answers."
        take="On its own, an LLM only writes text. It cannot open a file, search the web or send an email. And it sounds just as sure of itself when it is wrong.">
        <NextWord />
      </Stop>

      <Stop id="tokens" n="02" kicker="The units" title="It reads in tokens, not words"
        lede="The model cuts text into small pieces called tokens. A token can be a whole word, part of a word, or a space plus a word. Everything is counted in tokens: what you pay, and how much the model can read at once."
        take="Rough rule for English: one token is about four characters, or three quarters of a word. Hindi and many other languages need more tokens for the same meaning, so they cost more.">
        <Tokens />
      </Stop>

      <Stop id="context" n="03" kicker="Working space" title="The context window is its desk"
        lede="The model can only see what is on its desk right now: your messages, its replies, any files you gave it. The desk has a fixed size. When it is full, the oldest pages fall off, and the model simply cannot see them any more."
        take="A bigger desk remembers more of the chat. But everything on the desk is sent again with every message, so a bigger desk also means more tokens and more cost.">
        <Desk />
      </Stop>

      <Stop id="agent" n="04" kicker="Putting it together" title="What is an AI agent?"
        lede="An LLM on its own can only talk. An AI agent is an LLM that can get things done: you give it a goal, and it works step by step, using tools and memory, until the job is finished."
        take="Agent = LLM + memory + tools + autonomy. The LLM is the brain you have already met. The next three stops take the other parts one at a time.">
        <AgentIntro />
      </Stop>

      <Stop id="memory" n="05" kicker="Remembering" title="Two kinds of memory"
        lede="Short-term memory is the desk: this conversation only. Long-term memory is a filing cabinet: notes saved somewhere permanent, like a sheet or a database, that the agent can look up later, even in a brand new chat."
        take="The model itself does not remember you. Memory is always something we build around it: what we put on the desk, and what we save and fetch later.">
        <Memory />
      </Stop>

      <Stop id="tools" n="06" kicker="The hands" title="Tools are its hands"
        lede="A tool is an ability you hand the model: search jobs, read a file, save a row, send a message. You describe each tool in plain words. The model reads those descriptions and decides on its own which tool to use, and when."
        take="Nobody wrote “if there are too few jobs, search again”. The model decided that from what came back. That loop (decide, use a tool, look at the result, repeat) is what makes it an agent.">
        <ToolRun />
      </Stop>

      <Stop id="autonomy" n="07" kicker="Who decides" title="Autonomy: who picks the next step?"
        lede="Not every AI system should make its own decisions. Slide through the levels, using the same job search each time."
        take="More autonomy means it can handle more, and you can predict less. Use the lowest level that does the job, and keep a human check before anything that cannot be undone.">
        <Autonomy />
      </Stop>

      <Stop id="workflow" n="08" kicker="The test" title="Workflow or agent?"
        lede="One question decides it: can you draw the flowchart before it runs? If yes, it is a workflow, and you should build it as one, because it is cheaper, faster and easier to fix. Use an agent only where the next step depends on what it finds."
        take="Good systems mix the two: a workflow on the outside, and an agent only for the step that needs judgement.">
        <Versus />
      </Stop>

      <Stop id="build" n="09" kicker="The demo" title="Today's build: a job hunter that runs every morning"
        lede="Three small n8n workflows. Each one starts in a different way, and each one shows an idea from this page. Tap a box to see what it does."
        take="Three ways a workflow can start: on a schedule, when another workflow calls it, or when something happens (like you tapping a button).">
        <Build />
      </Stop>

      <Stop id="cost" n="10" kicker="The bill" title="What it costs"
        lede="You pay for tokens in and tokens out. Agents use more than people expect, because every step sends the whole conversation so far again."
        take="For one person, one run a day costs very little. The bill grows with more steps, longer pages on the desk, bigger models and more runs. Always put a limit on the number of steps.">
        <Cost />
      </Stop>

      <section className="wrap lx-sources">
        <h2>Sources</h2>
        <ul>
          <li>GPT-5 mini price ($0.25 per million input tokens, $2.00 per million output tokens): <a href="https://developers.openai.com/api/docs/models/gpt-5-mini" rel="noopener">OpenAI model page</a>, checked 22 Nov 2026.</li>
          <li>Token splits on stop 02: <a href="https://github.com/niieani/gpt-tokenizer" rel="noopener">gpt-tokenizer</a>, using o200k_base, the tokeniser OpenAI uses for GPT-5 mini.</li>
          <li>Everything marked “illustration” is made up to show an idea, not measured.</li>
        </ul>
      </section>
    </div>
  );
}

function Stop(props: { id: string; n: string; kicker: string; title: string; lede: string; take: string; children: React.ReactNode }) {
  return (
    <section id={props.id} className="lx-stop wrap">
      <p className="eyebrow">Stop {props.n} · {props.kicker}</p>
      <h2 className="lx-title">{props.title}</h2>
      <p className="lx-lede">{props.lede}</p>
      <div className="lx-panel">{props.children}</div>
      <p className="lx-take"><b>Remember.</b> {props.take}</p>
    </section>
  );
}

/* ---------------- 01: next word ---------------- */
const NEXT: { cands: [string, number][] }[] = [
  { cands: [["short", 41], ["clear", 27], ["honest", 18], ["one", 9]] },
  { cands: [["and", 44], [",", 29], ["enough", 13], ["but", 8]] },
  { cands: [["specific", 36], ["clear", 30], ["easy", 19], ["simple", 9]] },
  { cands: [[".", 62], ["to", 21], ["about", 11], ["!", 3]] },
];
function NextWord() {
  const [step, setStep] = useState(0);
  const words = ["A", "good", "CV", "should", "be", ...NEXT.slice(0, step).map((s) => s.cands[0][0])];
  const text = words.join(" ").replace(/ ([.,!])/g, "$1");
  const done = step >= NEXT.length;
  const cands = done ? null : NEXT[step].cands;
  return (
    <div>
      <p className="lx-sentence">{text}{!done && <span className="lx-caret" />}</p>
      {cands && (
        <div className="lx-cands" aria-label="Candidate next words">
          {cands.map(([w, p], i) => (
            <div key={w} className={`lx-cand${i === 0 ? " top" : ""}`}>
              <span className="w">{w}</span>
              <span className="bar"><span style={{ width: `${p}%` }} /></span>
              <span className="mono p">{p}%</span>
            </div>
          ))}
        </div>
      )}
      {done && <p className="lx-note">Done. Five guesses in a row made a sentence. That is all a reply is: one guess at a time.</p>}
      <div className="lx-row">
        <button className="lx-btn" onClick={() => setStep((s) => s + 1)} disabled={done}>Guess the next word</button>
        <button className="lx-btn ghost" onClick={() => setStep(0)}>Start over</button>
      </div>
      <p className="lx-note">Illustration. The words and percentages are made up to show the idea. A real model scores tens of thousands of options at every step.</p>
    </div>
  );
}

/* ---------------- 02: tokens ---------------- */
const TOKEN_EXAMPLES: [string, string][] = [
  ["English", "I want a React developer job in Bangalore"],
  ["Hindi", "मुझे बेंगलुरु में रिएक्ट डेवलपर की नौकरी चाहिए"],
  ["Code", "def add(a, b): return a + b"],
  ["One long word", "Antidisestablishmentarianism"],
];
type Enc = { encode: (s: string) => number[]; decode: (t: number[]) => string };
function Tokens() {
  const [text, setText] = useState(TOKEN_EXAMPLES[0][1]);
  const [enc, setEnc] = useState<Enc | null>(null);
  useEffect(() => {
    let live = true;
    import("gpt-tokenizer/encoding/o200k_base").then((m) => { if (live) setEnc(m as unknown as Enc); });
    return () => { live = false; };
  }, []);
  // Some tokens are only part of a letter (common in Hindi). Shown alone they
  // decode to a broken character, so join them with the next token until the
  // text is whole, and mark the box with how many tokens it holds.
  const { pieces, count } = useMemo(() => {
    if (!enc) return { pieces: [] as { t: string; n: number }[], count: 0 };
    const ids = enc.encode(text);
    const out: { t: string; n: number }[] = [];
    let buf: number[] = [];
    for (const id of ids) {
      buf.push(id);
      const t = enc.decode(buf);
      if (!t.includes("\uFFFD")) { out.push({ t, n: buf.length }); buf = []; }
    }
    if (buf.length) out.push({ t: enc.decode(buf), n: buf.length });
    return { pieces: out, count: ids.length };
  }, [enc, text]);
  const chars = [...text].length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div>
      <div className="lx-row">
        {TOKEN_EXAMPLES.map(([k, v]) => (
          <button key={k} className={`chip`} aria-pressed={text === v} onClick={() => setText(v)}>{k}</button>
        ))}
      </div>
      <textarea className="lx-input" value={text} onChange={(e) => setText(e.target.value)} rows={2} aria-label="Type anything" />
      <div className="lx-tokens" aria-live="polite">
        {!enc && <span className="lx-note">Loading the tokeniser…</span>}
        {pieces.map((p, i) => (
          <span key={i} className={`lx-tok t${i % 4}`}>{p.t.replace(/ /g, "·")}{p.n > 1 && <sup className="mono">×{p.n}</sup>}</span>
        ))}
      </div>
      <div className="lx-stats">
        <div><b className="mono">{enc ? count : "…"}</b><span>tokens</span></div>
        <div><b className="mono">{chars}</b><span>characters</span></div>
        <div><b className="mono">{words}</b><span>words</span></div>
      </div>
      <p className="lx-note">A real split, not a guess. The dot (·) marks a space that belongs to the token. A box marked ×2 holds two tokens that only make sense together. Try English, then Hindi: same meaning, roughly twice the tokens.</p>
    </div>
  );
}

/* ---------------- 03: the desk ---------------- */
const CHAT = [
  "Hi, I'm Priya.",
  "I'm a React developer with two years' experience.",
  "I live in Bangalore.",
  "I'd like remote or hybrid roles.",
  "No companies smaller than 20 people, please.",
  "Can you find me some jobs?",
  "Only full-time ones.",
  "What about Pune as well?",
];
function Desk() {
  const [size, setSize] = useState(4);
  const [count, setCount] = useState(3);
  const [asked, setAsked] = useState(false);
  const sent = CHAT.slice(0, count);
  const onDesk = sent.slice(Math.max(0, sent.length - size));
  const fallen = sent.slice(0, Math.max(0, sent.length - size));
  const knowsName = onDesk.includes(CHAT[0]);
  return (
    <div>
      <div className="lx-row lx-between">
        <label className="lx-slider">
          <span className="mono">Desk size: {size} pages</span>
          <input type="range" min={2} max={8} value={size} onChange={(e) => { setSize(+e.target.value); setAsked(false); }} />
        </label>
        <span className="mono lx-meter">{Math.min(sent.length, size)} / {size} used</span>
      </div>
      <div className="lx-desk">
        <div className="lx-desk-top">
          {onDesk.map((m) => <div key={m} className="lx-page">{m}</div>)}
          {Array.from({ length: Math.max(0, size - onDesk.length) }).map((_, i) => <div key={`e${i}`} className="lx-page empty" />)}
        </div>
        {fallen.length > 0 && (
          <div className="lx-fallen">
            <span className="mono">Fell off the desk:</span>
            {fallen.map((m) => <span key={m}>{m}</span>)}
          </div>
        )}
      </div>
      <div className="lx-row">
        <button className="lx-btn" disabled={count >= CHAT.length} onClick={() => { setCount((c) => c + 1); setAsked(false); }}>Add the next message</button>
        <button className="lx-btn ghost" onClick={() => setAsked(true)}>Ask: “What's my name?”</button>
        <button className="lx-btn ghost" onClick={() => { setCount(3); setAsked(false); }}>Reset</button>
      </div>
      {asked && (
        <p className={`lx-answer${knowsName ? "" : " bad"}`}>
          {knowsName ? "“Your name is Priya.” It can see that page on the desk." : "“Sorry, I don't know your name.” You told it, but that page fell off the desk."}
        </p>
      )}
    </div>
  );
}

/* ---------------- 04: what is an agent ---------------- */
const AGENT_STEPS = [
  "Reads your résumé: React, 2 years, Bangalore",
  "Searches job listings for “React developer, Bangalore, this week”",
  "Drops two that ask for 6+ years",
  "Searches again with “Frontend engineer” to find a third",
];
const AGENT_JOBS = [
  "Frontend Developer (React) · Acme Pay · posted 2 days ago",
  "React Engineer · Nimbus Labs · posted 4 days ago",
  "Frontend Engineer · Kitefin · posted yesterday",
];
const PARTS = [
  { name: "LLM", role: "the brain", href: "#llm", where: "stops 01 to 03" },
  { name: "Memory", role: "what it remembers", href: "#memory", where: "stop 05" },
  { name: "Tools", role: "what it can do", href: "#tools", where: "stop 06" },
  { name: "Autonomy", role: "who decides the steps", href: "#autonomy", where: "stop 07" },
];
function AgentIntro() {
  const [mode, setMode] = useState<"llm" | "agent">("llm");
  return (
    <div>
      <p className="lx-goal"><span className="mono">You ask</span> Find me 3 React jobs in Bangalore posted this week.</p>
      <div className="lx-ticks lx-ticks-2">
        <button className={mode === "llm" ? "on" : ""} onClick={() => setMode("llm")}>LLM on its own</button>
        <button className={mode === "agent" ? "on" : ""} onClick={() => setMode("agent")}>AI agent</button>
      </div>
      {mode === "llm" ? (
        <div className="lx-box lx-reply">
          <p className="mono lx-box-h">It replies</p>
          <p>“I can't search job sites or see this week's listings. I only know what was in my training. Here are some tips: keep your profile updated, search for ‘React developer’ on job boards, and set up alerts.”</p>
          <p className="lx-note">Helpful words, but the job is not done. It cannot look anything up or act.</p>
        </div>
      ) : (
        <div className="lx-box lx-reply">
          <p className="mono lx-box-h">It works through steps</p>
          <ol className="lx-steps">{AGENT_STEPS.map((x) => <li key={x}>{x}</li>)}</ol>
          <p className="mono lx-box-h" style={{ marginTop: 14 }}>Then replies</p>
          <ul className="lx-jobs">{AGENT_JOBS.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="lx-note">Same brain underneath. The difference is everything built around it. Company names are made up.</p>
        </div>
      )}
      <p className="mono lx-box-h" style={{ marginTop: 22 }}>An agent is four parts</p>
      <div className="lx-formula">
        {PARTS.map((pt, i) => (
          <span key={pt.name} className="lx-formula-item">
            {i > 0 && <i aria-hidden>+</i>}
            <a href={pt.href} className="lx-part">
              <b>{pt.name}</b>
              <span>{pt.role}</span>
              <span className="mono">{pt.where}</span>
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- 05: memory ---------------- */
const MEM_STEPS = [
  { say: "Monday. You chat with the agent and it finds you three jobs. All of this sits on the desk.", desk: ["You: find me React jobs", "Agent: here are 3 jobs"], cab: ["Résumé: React, 2 years, Bangalore"] },
  { say: "Before the chat ends, it saves what it sent into the filing cabinet.", desk: ["You: find me React jobs", "Agent: here are 3 jobs"], cab: ["Résumé: React, 2 years, Bangalore", "Sent on Monday: Acme Pay, Nimbus Labs, Kitefin"] },
  { say: "The chat ends. The desk is wiped clean. The cabinet stays.", desk: [], cab: ["Résumé: React, 2 years, Bangalore", "Sent on Monday: Acme Pay, Nimbus Labs, Kitefin"] },
  { say: "Tuesday, brand new chat: “Don't send me the same jobs again.” The agent looks in the cabinet and puts the right note back on the desk.", desk: ["You: don't repeat yesterday's jobs", "From the cabinet: Sent on Monday: Acme Pay, Nimbus Labs, Kitefin"], cab: ["Résumé: React, 2 years, Bangalore", "Sent on Monday: Acme Pay, Nimbus Labs, Kitefin"] },
];
function Memory() {
  const [i, setI] = useState(0);
  const s = MEM_STEPS[i];
  return (
    <div>
      <div className="lx-two">
        <div className="lx-box">
          <p className="mono lx-box-h">Short-term · the desk</p>
          {s.desk.length ? s.desk.map((d) => <div key={d} className={`lx-page${d.startsWith("From the cabinet") ? " hot" : ""}`}>{d}</div>) : <p className="lx-note">Empty. New chat, clean desk.</p>}
        </div>
        <div className="lx-box">
          <p className="mono lx-box-h">Long-term · the filing cabinet</p>
          {s.cab.map((d) => <div key={d} className="lx-page">{d}</div>)}
        </div>
      </div>
      <p className="lx-say"><span className="mono">{i + 1}/{MEM_STEPS.length}</span> {s.say}</p>
      <div className="lx-row">
        <button className="lx-btn" disabled={i >= MEM_STEPS.length - 1} onClick={() => setI(i + 1)}>Next</button>
        <button className="lx-btn ghost" onClick={() => setI(0)}>Start over</button>
      </div>
      <p className="lx-note">Company names are made up.</p>
    </div>
  );
}

/* ---------------- 06: tools ---------------- */
const TOOLS = [
  { id: "resume", name: "Read résumé", desc: "Reads the person's résumé: skills, years, city." },
  { id: "search", name: "Search jobs", desc: "Searches job listings for a title and a city." },
  { id: "check", name: "Check saved jobs", desc: "Looks up jobs already sent before, so none repeat." },
  { id: "save", name: "Save job", desc: "Saves one job as a row in the tracking sheet." },
];
const RUN: { think?: string; tool?: string; input?: string; result?: string; answer?: string }[] = [
  { think: "First I need to know who this is.", tool: "resume", result: "React, TypeScript, 2 years, Bangalore" },
  { think: "Search for the obvious title first.", tool: "search", input: "React developer · Bangalore", result: "4 jobs found" },
  { think: "Have I sent any of these before?", tool: "check", result: "2 of the 4 were sent yesterday" },
  { think: "Only 2 new ones. Not enough. I'll try a wider title.", tool: "search", input: "Frontend engineer · Bangalore", result: "5 jobs found, 1 is a good fit" },
  { think: "That makes 3 good new jobs. Save them.", tool: "save", input: "3 jobs", result: "3 rows saved" },
  { answer: "Done. I found 3 new jobs that fit you and saved them to your sheet." },
];
function ToolRun() {
  const [n, setN] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!playing) return;
    if (n >= RUN.length) { setPlaying(false); return; }
    timer.current = setTimeout(() => setN((x) => x + 1), 1300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, n]);
  const active = n > 0 ? RUN[n - 1].tool : undefined;
  return (
    <div>
      <p className="lx-goal"><span className="mono">Goal</span> Find me up to 3 new jobs that fit my résumé.</p>
      <div className="lx-tools">
        <div className="lx-toolbox">
          <p className="mono lx-box-h">The tools it was given</p>
          {TOOLS.map((t) => (
            <div key={t.id} className={`lx-tool${active === t.id ? " on" : ""}`}>
              <b>{t.name}</b><span>{t.desc}</span>
            </div>
          ))}
        </div>
        <ol className="lx-trace" aria-live="polite">
          {RUN.slice(0, n).map((r, i) => (
            <li key={i}>
              {r.think && <p className="think">{r.think}</p>}
              {r.tool && <p className="call"><span className="mono">uses</span> {TOOLS.find((t) => t.id === r.tool)!.name}{r.input ? <span className="mono arg"> ({r.input})</span> : null}</p>}
              {r.result && <p className="res"><span className="mono">gets back</span> {r.result}</p>}
              {r.answer && <p className="ans">{r.answer}</p>}
            </li>
          ))}
          {n === 0 && <li className="lx-note">Press play to watch it work.</li>}
        </ol>
      </div>
      <div className="lx-row">
        <button className="lx-btn" onClick={() => { if (n >= RUN.length) setN(0); setPlaying(true); }} disabled={playing}>Play</button>
        <button className="lx-btn ghost" onClick={() => { setPlaying(false); setN((x) => Math.min(RUN.length, x + 1)); }}>One step</button>
        <button className="lx-btn ghost" onClick={() => { setPlaying(false); setN(0); }}>Reset</button>
      </div>
      <p className="lx-note">Illustration of a typical run. Steps {n}/{RUN.length}.</p>
    </div>
  );
}

/* ---------------- 07: autonomy ---------------- */
const LEVELS = [
  { name: "Chatbot", what: "You ask, it answers. It cannot do anything in the world.", job: "Gives you tips on how to look for jobs.", who: "You, every single time.", predict: "Very predictable." },
  { name: "Workflow with AI in one step", what: "You fixed the steps in advance. AI does one of them, like writing a summary.", job: "Every day at 9: search “React developer”, AI writes a summary, email it to you.", who: "You, ahead of time.", predict: "Very predictable. Same steps, same cost, every run." },
  { name: "Agent", what: "You give it a goal and some tools. It chooses the steps.", job: "Finds jobs that fit you, searches again if results are weak, skips ones you have seen.", who: "The model, while it runs.", predict: "Less predictable. Steps and cost change from run to run." },
  { name: "Agent that acts alone", what: "It also does things that cannot be undone, without asking anyone.", job: "Applies to jobs and emails recruiters for you.", who: "The model, with nobody checking.", predict: "Least predictable. Mistakes go straight out into the world." },
];
function Autonomy() {
  const [lvl, setLvl] = useState(2);
  const L = LEVELS[lvl];
  return (
    <div>
      <input className="lx-range" type="range" min={0} max={3} step={1} value={lvl} onChange={(e) => setLvl(+e.target.value)} aria-label="Autonomy level" />
      <div className="lx-ticks">
        {LEVELS.map((l, i) => (
          <button key={l.name} className={i === lvl ? "on" : ""} onClick={() => setLvl(i)}>{l.name}</button>
        ))}
      </div>
      <dl className="lx-level">
        <div><dt>What it is</dt><dd>{L.what}</dd></div>
        <div><dt>Our job search, at this level</dt><dd>{L.job}</dd></div>
        <div><dt>Who decides the next step</dt><dd>{L.who}</dd></div>
        <div><dt>How predictable</dt><dd>{L.predict}</dd></div>
      </dl>
    </div>
  );
}

/* ---------------- 08: workflow vs agent ---------------- */
function Versus() {
  const [run, setRun] = useState(false);
  const wf = ["Search “React developer”", "Save every result", "Email the list"];
  const ag = ["Read résumé", "Search “React developer”", "Check saved jobs", "Search “Frontend engineer”", "Save 3 good ones", "Email the list"];
  return (
    <div>
      <div className="lx-two">
        <div className="lx-box">
          <p className="mono lx-box-h">Workflow · steps fixed in advance</p>
          <div className="lx-flow">{wf.map((s, i) => <span key={s} className={run ? "lit" : ""} style={{ transitionDelay: `${i * 0.25}s` }}>{s}</span>)}</div>
          {run && <p className="lx-answer bad">Sent 4 jobs. 2 were repeats from yesterday, 1 wants 6+ years.</p>}
        </div>
        <div className="lx-box">
          <p className="mono lx-box-h">Agent · steps chosen while running</p>
          <div className="lx-flow">{ag.map((s, i) => <span key={s} className={run ? "lit" : ""} style={{ transitionDelay: `${i * 0.25}s` }}>{s}</span>)}</div>
          {run && <p className="lx-answer">Sent 3 new jobs that fit. Took twice the steps, so it cost more.</p>}
        </div>
      </div>
      <div className="lx-row">
        <button className="lx-btn" onClick={() => setRun(true)}>Run both</button>
        <button className="lx-btn ghost" onClick={() => setRun(false)}>Reset</button>
      </div>
      <table className="lx-table">
        <thead><tr><th /><th>Workflow</th><th>Agent</th></tr></thead>
        <tbody>
          <tr><td>Who picks the next step</td><td>You, when you build it</td><td>The model, while it runs</td></tr>
          <tr><td>Number of steps</td><td>Known in advance</td><td>Depends on what it finds</td></tr>
          <tr><td>Cost</td><td>The same every run</td><td>Changes from run to run</td></tr>
          <tr><td>When it breaks</td><td>You see which step failed</td><td>You read its trail of steps</td></tr>
          <tr><td>Good for</td><td>Sort, summarise, send, move data</td><td>Search, research, judge, fix</td></tr>
        </tbody>
      </table>
      <p className="lx-note">Illustration. Results are made up to show the difference.</p>
    </div>
  );
}

/* ---------------- 09: the build ---------------- */
const FLOWS = [
  {
    n: "1", name: "Job Hunter", trig: "Every day at 9:00", trigKind: "On a schedule",
    nodes: ["Schedule", "AI agent", "Call Verifier"],
    does: "An AI agent with four tools: read résumé, search jobs, check saved jobs, save job. Its instructions give it a goal, not steps: find up to 5 new jobs that fit, and never repeat one.",
    shows: "Tools (stop 06), long-term memory in the sheet (stop 05), autonomy (stop 07).",
  },
  {
    n: "2", name: "Verifier", trig: "Called by the Job Hunter", trigKind: "By another workflow",
    nodes: ["Called", "AI agent", "Telegram: Yes / No"],
    does: "A second agent opens each job, scores how well it fits from 1 to 10 and gives a reason. Jobs scoring 7 or more go to your Telegram with two buttons: Yes and No.",
    shows: "A second opinion on the first agent's work, and the workflow around the agent (stop 08).",
  },
  {
    n: "3", name: "Responder", trig: "You tap Yes or No", trigKind: "When something happens",
    nodes: ["Telegram tap", "Yes or No?", "Update the sheet"],
    does: "Yes marks the job approved in the sheet. No marks it rejected. This is where you would carry on: draft a cover note, add a reminder, anything.",
    shows: "A human check before anything that matters (stop 07).",
  },
];
function Build() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      <div className="lx-flows">
        {FLOWS.map((f, i) => (
          <button key={f.n} className={`lx-flowcard${open === i ? " on" : ""}`} onClick={() => setOpen(i)} aria-expanded={open === i}>
            <span className="mono lx-trig">{f.trigKind}</span>
            <b>{f.n}. {f.name}</b>
            <span className="lx-chain">{f.nodes.map((x, j) => <span key={x}>{x}{j < f.nodes.length - 1 ? <i aria-hidden> → </i> : null}</span>)}</span>
          </button>
        ))}
      </div>
      <div className="lx-detail">
        <p><span className="mono">Starts</span> {FLOWS[open].trig}</p>
        <p><span className="mono">Does</span> {FLOWS[open].does}</p>
        <p><span className="mono">Shows</span> {FLOWS[open].shows}</p>
      </div>
      <p className="lx-note">Built in n8n, a no-code automation tool. Job listings come from Adzuna's free jobs API. The n8n template and a step-by-step setup guide will be linked here.</p>
    </div>
  );
}

/* ---------------- 10: cost ---------------- */
function Cost() {
  const steps = [1500, 2400, 3300, 4300, 5200, 6100]; // illustration: each step re-sends everything before it
  const max = steps[steps.length - 1];
  const total = steps.reduce((a, b) => a + b, 0);
  const [inTok, setInTok] = useState(20000);
  const [outTok, setOutTok] = useState(2000);
  const [runs, setRuns] = useState(1);
  const [pIn, setPIn] = useState(0.25);
  const [pOut, setPOut] = useState(2.0);
  const [inr, setInr] = useState("");
  const perRun = (inTok * pIn + outTok * pOut) / 1e6;
  const perMonth = perRun * runs * 30;
  const rate = parseFloat(inr);
  const fmt = (usd: number) => `$${usd < 0.1 ? usd.toFixed(4) : usd.toFixed(2)}`;
  return (
    <div>
      <p className="mono lx-box-h">Tokens sent at each step of one run (illustration)</p>
      <div className="lx-bars">
        {steps.map((s, i) => (
          <div key={i} className="lx-bar-row">
            <span className="mono">Step {i + 1}</span>
            <span className="lx-bar"><span style={{ width: `${(s / max) * 100}%` }} /></span>
            <span className="mono">{s.toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
      <p className="lx-note">The last step alone sends {max.toLocaleString("en-IN")} tokens. The whole run sends {total.toLocaleString("en-IN")}. Twice the steps costs far more than twice as much.</p>

      <div className="lx-calc">
        <label><span className="mono">Input tokens per run</span><input type="number" min={0} value={inTok} onChange={(e) => setInTok(+e.target.value)} /></label>
        <label><span className="mono">Output tokens per run</span><input type="number" min={0} value={outTok} onChange={(e) => setOutTok(+e.target.value)} /></label>
        <label><span className="mono">Runs per day</span><input type="number" min={0} value={runs} onChange={(e) => setRuns(+e.target.value)} /></label>
        <label><span className="mono">$ per million input</span><input type="number" min={0} step={0.01} value={pIn} onChange={(e) => setPIn(+e.target.value)} /></label>
        <label><span className="mono">$ per million output</span><input type="number" min={0} step={0.01} value={pOut} onChange={(e) => setPOut(+e.target.value)} /></label>
        <label><span className="mono">₹ per $ (optional)</span><input type="number" min={0} step={0.01} placeholder="today's rate" value={inr} onChange={(e) => setInr(e.target.value)} /></label>
      </div>
      <div className="lx-stats">
        <div><b className="mono">{fmt(perRun)}</b><span>per run</span></div>
        <div><b className="mono">{fmt(perMonth)}</b><span>per month</span></div>
        {rate > 0 && <div><b className="mono">₹{(perMonth * rate).toFixed(2)}</b><span>per month</span></div>}
      </div>
      <p className="lx-note">Prices are pre-filled with GPT-5 mini's list price, checked 22 Nov 2026 (source below). The token counts are an example. Change any box.</p>
    </div>
  );
}
