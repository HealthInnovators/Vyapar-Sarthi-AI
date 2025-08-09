import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { VoiceCommand } from "@/components/dashboard/voice-command";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to Vyapar Sarthi. Here's an overview of your business.
        </p>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <StatsCards />
          <RecentTransactions />
        </div>
        <div className="lg:col-span-1">
          <VoiceCommand />
        </div>
      </main>
    </div>
  );
}
