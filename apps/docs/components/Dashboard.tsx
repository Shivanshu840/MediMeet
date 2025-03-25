import { Header } from "./Header";
import { SummaryCards } from "./SummaryCard";
import VirtualVisit from "./VirtualVisit";
import { CheckReport } from "./checkReport";
import { Messenger } from "./Messanger";

export default function Dashboard() {
  return (
    <div className="flex flex-col flex-1 bg-slate-900 text-white">
      <Header />

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <SummaryCards />

        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <VirtualVisit />
          </div>
          <div className="space-y-6">
            <CheckReport />
            <Messenger />
          </div>
        </div>
      </main>
    </div>
  );
}
