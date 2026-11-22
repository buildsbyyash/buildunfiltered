import type { Metadata } from "next";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Learn",
  description: "AI ideas you can see and press, not just read. Built for the classes I teach.",
  alternates: { canonical: "/learn/" },
  openGraph: { title: `Learn · ${site.name}`, url: "/learn/" },
};

const PAGES = [
  {
    href: "/learn/ai-agents/",
    n: "01",
    title: "How AI agents work",
    dek: "From a model that guesses the next word to an agent that finds you jobs every morning. Nine stops, no code.",
  },
];

export default function LearnPage() {
  return (
    <div className="wrap finder">
      <p className="eyebrow">Learn</p>
      <h1 className="finder-title">See it, press it</h1>
      <p className="finder-lede">AI ideas you can play with instead of just read about. Each page is built for a class I teach, and stays up after it.</p>
      <ul className="lx-list">
        {PAGES.map((p) => (
          <li key={p.href}>
            <a href={p.href}>
              <span className="mono">{p.n}</span>
              <span>
                <span className="lx-list-title">{p.title}</span>
                <span className="lx-list-dek">{p.dek}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
