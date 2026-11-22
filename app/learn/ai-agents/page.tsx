import type { Metadata } from "next";
import { site } from "@/site.config";
import AgentsExplainer from "@/components/learn/AgentsExplainer";

export const metadata: Metadata = {
  title: "How AI agents work",
  description:
    "LLMs, tokens, the context window, memory, tools, autonomy, and workflows vs agents. Nine stops, no code, something to press at every stop.",
  alternates: { canonical: "/learn/ai-agents/" },
  openGraph: { title: `How AI agents work · ${site.name}`, url: "/learn/ai-agents/" },
};

export default function AgentsPage() {
  return <AgentsExplainer />;
}
