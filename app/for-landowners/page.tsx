import type { Metadata } from "next";
import CounterpartyPage from "@/components/CounterpartyPage";
import { getCounterparty } from "@/lib/counterparties";

const c = getCounterparty("for-landowners")!;

export const metadata: Metadata = {
  title: c.navLabel,
  description: c.deck
};

export default function ForLandownersPage() {
  return <CounterpartyPage c={c} />;
}
