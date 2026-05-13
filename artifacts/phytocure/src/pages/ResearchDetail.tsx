import { AppLayout } from "@/components/layout/AppLayout";
import { useGetResearch, getGetResearchQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

function statusClass(status: string) {
  switch (status) {
    case 'published': return 'border-emerald-500/30 text-emerald-500/70';
    case 'peer-review': return 'border-blue-500/30 text-blue-500/70';
    case 'in-progress': return 'border-amber-500/30 text-amber-500/70';
    default: return 'border-white/[0.20] text-white/30';
  }
}

export default function ResearchDetail() {
  const { id } = useParams<{ id: string }>();
  const researchId = parseInt(id || "0", 10);
  const { data: research, isLoading } = useGetResearch(researchId, { query: { enabled: !!researchId, queryKey: getGetResearchQueryKey(researchId) } });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <Skeleton className="h-5 w-28 bg-white/[0.07]" />
          <Skeleton className="h-14 w-3/4 bg-white/[0.07]" />
          <div className="grid md:grid-cols-3 gap-px bg-white/[0.07]">
            <div className="md:col-span-2 bg-black p-10"><Skeleton className="h-64 w-full bg-white/[0.03]" /></div>
            <div className="bg-black p-10"><Skeleton className="h-48 w-full bg-white/[0.03]" /></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!research) return <AppLayout><div className="text-white/30 pt-20 text-center">Research not found.</div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-12">
        <Link href="/research">
          <span className="inline-flex items-center gap-2 text-xs font-mono text-white/25 hover:text-white/50 transition-colors cursor-pointer">
            <ArrowLeft className="w-3 h-3" /> Back to Research Hub
          </span>
        </Link>

        {/* Header */}
        <div className="border-b border-white/[0.16] pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`text-[10px] font-mono border px-2 py-0.5 rounded-sm ${statusClass(research.status)}`}>
              {research.status.replace('-', ' ').toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-white/25 border border-white/[0.16] px-2 py-0.5 rounded-sm">
              {research.category.toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-6" data-testid="text-research-title">
            {research.title}
          </h1>
          <div className="flex flex-wrap gap-8 text-xs font-mono text-white/25">
            {research.collaborators && (
              <div>
                <div className="text-[9px] uppercase tracking-wider mb-1 text-white/15">Authors</div>
                {research.collaborators}
              </div>
            )}
            {research.publishedAt && (
              <div>
                <div className="text-[9px] uppercase tracking-wider mb-1 text-white/15">Published</div>
                {format(new Date(research.publishedAt), 'MMMM d, yyyy')}
              </div>
            )}
            <div>
              <div className="text-[9px] uppercase tracking-wider mb-1 text-white/15">Upvotes</div>
              <span className="text-primary/60">{research.upvotes || 0}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/[0.08]">
          {/* Main content */}
          <div className="md:col-span-2 bg-black p-10 space-y-10">
            {[
              { label: "ABSTRACT", content: research.abstract, highlight: false },
              { label: "METHODOLOGY", content: research.methodology, highlight: false },
              research.findings ? { label: "KEY FINDINGS", content: research.findings, highlight: true } : null,
            ].filter(Boolean).map((section) => (
              <div key={section!.label}>
                <div className="section-label mb-6">{section!.label}</div>
                <div className={`border p-6 rounded-sm ${section!.highlight ? 'border-primary/[0.12] bg-primary/[0.03]' : 'border-white/[0.16]'}`}
                  data-testid={`section-${section!.label.toLowerCase().replace(/ /g, '-')}`}
                >
                  <p className={`leading-relaxed text-sm whitespace-pre-wrap ${section!.highlight ? 'text-white/60' : 'text-white/40'}`}>
                    {section!.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="bg-black p-10 space-y-8">
            <div>
              <div className="section-label mb-6">PUBLICATION INFO</div>
              <div className="space-y-4">
                {[
                  { label: "Author ID", value: research.authorId },
                  { label: "Status", value: research.status.replace('-', ' ') },
                  { label: "Category", value: research.category },
                  { label: "Submitted", value: format(new Date(research.createdAt), 'MMM d, yyyy') },
                ].map((info) => (
                  <div key={info.label} className="border-b border-white/[0.12] pb-4">
                    <div className="text-[9px] uppercase tracking-wider text-white/15 mb-1">{info.label}</div>
                    <div className="text-xs font-mono text-white/35 truncate">{info.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="section-label mb-4">NETWORK IMPACT</div>
              <div className="border border-white/[0.16] p-5 text-center rounded-sm">
                <div className="text-3xl font-bold font-mono text-primary mb-1">{research.upvotes || 0}</div>
                <div className="section-label text-[9px]">Peer Endorsements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
