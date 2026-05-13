import { AppLayout } from "@/components/layout/AppLayout";
import { useCreateResearch, getListResearchQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const researchSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  abstract: z.string().min(20, "Abstract must be at least 20 characters"),
  category: z.string().min(1, "Select a category"),
  methodology: z.string().min(10, "Methodology is required"),
  findings: z.string().optional(),
  collaborators: z.string().optional(),
});

const inputClass = "bg-white/[0.03] border-white/[0.18] focus-visible:border-primary/40 focus-visible:ring-0 text-white placeholder:text-white/15 font-mono";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-mono text-white/35 uppercase tracking-wider mb-2">{children}</div>;
}

export default function NewResearch() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createResearch = useCreateResearch();

  const form = useForm<z.infer<typeof researchSchema>>({
    resolver: zodResolver(researchSchema),
    defaultValues: { title: "", abstract: "", category: "", methodology: "", findings: "", collaborators: "" },
  });

  const onSubmit = async (data: z.infer<typeof researchSchema>) => {
    try {
      await createResearch.mutateAsync({ data: { ...data, authorId: "RES-4x9m1" } });
      queryClient.invalidateQueries({ queryKey: getListResearchQueryKey() });
      toast({ title: "Research Submitted", description: "Your study is now pending peer-review." });
      setLocation("/research");
    } catch {
      toast({ title: "Error", description: "Failed to submit research.", variant: "destructive" });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-12">
        <Link href="/research">
          <span className="inline-flex items-center gap-2 text-xs font-mono text-white/25 hover:text-white/50 transition-colors cursor-pointer">
            <ArrowLeft className="w-3 h-3" /> Back to Research Hub
          </span>
        </Link>

        <div className="border-b border-white/[0.16] pb-8">
          <div className="section-label mb-4">DESCI: SUBMIT FINDINGS</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Submit Research</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-px bg-white/[0.07]" data-testid="form-research">
            {/* Title */}
            <div className="bg-black p-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><FieldLabel>Research Title</FieldLabel></FormLabel>
                    <FormControl>
                      <Input data-testid="input-title" placeholder="Full title of your study" {...field} className={`${inputClass} text-lg`} />
                    </FormControl>
                    <FormMessage className="text-red-400/70 text-xs mt-2" />
                  </FormItem>
                )}
              />
            </div>

            {/* Category + Collaborators */}
            <div className="bg-black p-8 grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><FieldLabel>Domain / Category</FieldLabel></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category" className={`${inputClass} h-10`}>
                          <SelectValue placeholder="Select domain..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-white/[0.20]">
                        <SelectItem value="pharmacology">Pharmacology</SelectItem>
                        <SelectItem value="clinical">Clinical Trials</SelectItem>
                        <SelectItem value="botanical">Botanical Science</SelectItem>
                        <SelectItem value="chemistry">Chemistry & Extraction</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400/70 text-xs mt-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collaborators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><FieldLabel>Co-Authors (Optional)</FieldLabel></FormLabel>
                    <FormControl>
                      <Input data-testid="input-collaborators" placeholder="Comma separated names" {...field} className={inputClass} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Abstract */}
            <div className="bg-black p-8">
              <FormField
                control={form.control}
                name="abstract"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><FieldLabel>Abstract</FieldLabel></FormLabel>
                    <FormControl>
                      <Textarea data-testid="input-abstract" placeholder="Summary of the study and key objectives..." className={`${inputClass} resize-none h-32`} {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400/70 text-xs mt-2" />
                  </FormItem>
                )}
              />
            </div>

            {/* Methodology */}
            <div className="bg-black p-8">
              <FormField
                control={form.control}
                name="methodology"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><FieldLabel>Methodology</FieldLabel></FormLabel>
                    <FormControl>
                      <Textarea data-testid="input-methodology" placeholder="Detailed description of research methods and protocol..." className={`${inputClass} resize-y min-h-[140px]`} {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400/70 text-xs mt-2" />
                  </FormItem>
                )}
              />
            </div>

            {/* Findings */}
            <div className="bg-black p-8">
              <FormField
                control={form.control}
                name="findings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><FieldLabel>Key Findings (Optional for Drafts)</FieldLabel></FormLabel>
                    <FormControl>
                      <Textarea data-testid="input-findings" placeholder="Results, conclusions, and data points..." className={`${inputClass} resize-y min-h-[100px]`} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <div className="bg-black p-8 flex justify-end">
              <button
                data-testid="button-submit-research"
                type="submit"
                disabled={createResearch.isPending}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-black text-sm font-bold rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {createResearch.isPending ? "Submitting..." : <>Submit to Network <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
}
