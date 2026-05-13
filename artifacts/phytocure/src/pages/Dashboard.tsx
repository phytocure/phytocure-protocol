import { AppLayout } from "@/components/layout/AppLayout";
import { useGetDashboardStats, useGetRecentActivity } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Beaker, Pill, ShieldCheck, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();

  return (
    <AppLayout>
      <div className="space-y-16">
        {/* Header */}
        <div className="border-b border-white/[0.16] pb-8">
          <div className="section-label mb-4">PLATFORM OVERVIEW</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white" data-testid="text-dashboard-title">
            Network Dashboard
          </h1>
        </div>

        {/* Stats grid */}
        <div>
          <div className="section-label mb-8">LIVE METRICS</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
            {[
              { label: "Total Volume", value: stats ? `$${stats.totalTransactionVolume.toLocaleString()}` : null, icon: TrendingUp, href: "/transactions" },
              { label: "Products Listed", value: stats?.totalProducts, icon: Pill, href: "/products" },
              { label: "Active Researchers", value: stats?.activeResearchers, icon: Beaker, href: "/research" },
              { label: "Verified Distributors", value: stats?.verifiedDistributors, icon: ShieldCheck, href: "/distributors" },
            ].map((stat) => (
              <Link key={stat.label} href={stat.href} data-testid={`stat-${stat.label.toLowerCase().replace(/ /g, '-')}`}>
                <div className="group bg-black hover:bg-white/[0.02] transition-colors p-8 cursor-pointer">
                  <div className="flex items-start justify-between mb-6">
                    <stat.icon className="w-4 h-4 text-white/20 group-hover:text-primary/50 transition-colors" />
                    <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-primary/40 transition-colors" />
                  </div>
                  {statsLoading ? (
                    <Skeleton className="h-10 w-24 bg-white/[0.08]" />
                  ) : (
                    <div className="text-3xl md:text-4xl font-bold font-mono text-white tracking-tight leading-none mb-2">
                      {stat.value ?? 0}
                    </div>
                  )}
                  <div className="section-label text-[10px] mt-3">{stat.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-3 gap-px bg-white/[0.06]">
          {[
            { label: "Total Prescriptions", value: stats?.totalPrescriptions },
            { label: "Pending Prescriptions", value: stats?.pendingPrescriptions },
            { label: "Total Research Projects", value: stats?.totalResearch },
          ].map((stat) => (
            <div key={stat.label} className="bg-black p-8" data-testid={`stat-secondary-${stat.label.toLowerCase().replace(/ /g, '-')}`}>
              {statsLoading ? (
                <Skeleton className="h-8 w-16 bg-white/[0.08] mb-2" />
              ) : (
                <div className="text-2xl font-bold font-mono text-white/70 mb-2">{stat.value ?? 0}</div>
              )}
              <div className="section-label text-[10px]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Activity feed */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="section-label">NETWORK ACTIVITY</div>
          </div>
          
          {activityLoading ? (
            <div className="space-y-px bg-white/[0.07]">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-black p-6">
                  <Skeleton className="h-5 w-3/4 bg-white/[0.08]" />
                </div>
              ))}
            </div>
          ) : activity?.length ? (
            <div className="space-y-px bg-white/[0.08]">
              {activity.map((item, i) => (
                <div key={item.id}
                  className="group bg-black hover:bg-white/[0.02] transition-colors p-6 flex items-center justify-between"
                  data-testid={`row-activity-${item.id}`}
                >
                  <div className="flex items-start gap-6">
                    <span className="index-num w-8 flex-shrink-0 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        item.type === 'transaction' ? 'bg-emerald-500' :
                        item.type === 'prescription' ? 'bg-blue-400' :
                        item.type === 'research' ? 'bg-purple-400' :
                        'bg-primary'
                      }`} />
                      <div>
                        <p className="text-sm text-white/70 font-medium">{item.title}</p>
                        <p className="text-xs text-white/30 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-white/20 flex-shrink-0 ml-4">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-white/[0.16] p-16 text-center">
              <Activity className="w-8 h-8 text-white/10 mx-auto mb-4" />
              <p className="text-white/25 text-sm">No recent activity</p>
            </div>
          )}
        </div>

        {/* System health */}
        {stats && (
          <div>
            <div className="section-label mb-8">SYSTEM HEALTH</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.08]">
              {[
                {
                  label: "Prescriptions Pending",
                  value: stats.pendingPrescriptions,
                  total: stats.totalPrescriptions,
                  color: "bg-amber-500",
                },
                {
                  label: "Distributors Verified",
                  value: stats.verifiedDistributors,
                  total: stats.totalDistributors,
                  color: "bg-primary",
                },
                {
                  label: "Research Active",
                  value: stats.activeResearchers,
                  total: stats.totalResearch,
                  color: "bg-blue-400",
                },
              ].map((bar) => {
                const pct = Math.round((bar.value / (bar.total || 1)) * 100);
                return (
                  <div key={bar.label} className="bg-black p-8" data-testid={`health-${bar.label.toLowerCase().replace(/ /g, '-')}`}>
                    <div className="flex justify-between items-end mb-4">
                      <div className="section-label text-[10px]">{bar.label}</div>
                      <span className="font-mono text-white/60 text-sm">{bar.value} / {bar.total}</span>
                    </div>
                    <div className="h-px bg-white/[0.06] w-full rounded-full overflow-hidden">
                      <div className={`h-full ${bar.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
