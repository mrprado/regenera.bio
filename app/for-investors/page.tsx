import type { Metadata } from "next";
import CounterpartyPage from "@/components/CounterpartyPage";
import { getCounterparty } from "@/lib/counterparties";

const c = getCounterparty("for-investors")!;

export const metadata: Metadata = {
  title: c.navLabel,
  description: c.deck
};

export default function ForInvestorsPage() {
  return <CounterpartyPage c={c} />;
}
