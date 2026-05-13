import { AppLayout } from "@/components/layout/AppLayout";
import { useCreatePrescription, useListProducts, getListPrescriptionsQueryKey } from "@workspace/api-client-react";
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

const prescriptionSchema = z.object({
  patientId: z.string().min(3, "Patient ID required"),
  productId: z.coerce.number().min(1, "Select a product"),
  dosage: z.string().min(2, "Dosage required"),
  frequency: z.string().min(2, "Frequency required"),
  duration: z.string().min(2, "Duration required"),
  condition: z.string().min(5, "Condition description required"),
  notes: z.string().optional(),
});

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-mono text-white/35 uppercase tracking-wider mb-2">{children}</div>;
}

const inputClass = "bg-white/[0.03] border-white/[0.18] focus-visible:border-primary/40 focus-visible:ring-0 text-white placeholder:text-white/15 font-mono";

export default function NewPrescription() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createPrescription = useCreatePrescription();
  const { data: products } = useListProducts();

  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: { patientId: "", productId: 0, dosage: "", frequency: "", duration: "", condition: "", notes: "" },
  });

  const onSubmit = async (data: z.infer<typeof prescriptionSchema>) => {
    try {
      await createPrescription.mutateAsync({ data: { ...data, doctorId: "DOC-8x3q9" } });
      queryClient.invalidateQueries({ queryKey: getListPrescriptionsQueryKey() });
      toast({ title: "Protocol Registered", description: "Prescription signed and added to the ledger." });
      setLocation("/prescriptions");
    } catch {
      toast({ title: "Error", description: "Failed to create prescription.", variant: "destructive" });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-12">
        <Link href="/prescriptions">
          <span className="inline-flex items-center gap-2 text-xs font-mono text-white/25 hover:text-white/50 transition-colors cursor-pointer">
            <ArrowLeft className="w-3 h-3" /> Back to Prescriptions
          </span>
        </Link>

        <div className="border-b border-white/[0.16] pb-8">
          <div className="section-label mb-4">CLINICAL: NEW PROTOCOL</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">New Protocol</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-px bg-white/[0.07]" data-testid="form-prescription">
            {/* Patient ID */}
            <div className="bg-black p-8">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><FieldLabel>Patient ID</FieldLabel></FormLabel>
                    <FormControl>
                      <Input data-testid="input-patient-id" placeholder="PAT-XXXX" {...field} className={inputClass} />
                    </FormControl>
                    <FormMessage className="text-red-400/70 text-xs mt-2" />
                  </FormItem>
                )}
              />
            </div>

            {/* Product */}
            <div className="bg-black p-8">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><FieldLabel>Target Product</FieldLabel></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ? field.value.toString() : ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-product" className={`${inputClass} h-10`}>
                          <SelectValue placeholder="Select formulation..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-white/[0.20]">
                        {products?.map(p => (
                          <SelectItem key={p.id} value={p.id.toString()} className="text-white/70 font-mono text-sm">
                            {p.name}, {p.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400/70 text-xs mt-2" />
                  </FormItem>
                )}
              />
            </div>

            {/* Dosage / Frequency / Duration */}
            <div className="bg-black p-8 grid md:grid-cols-3 gap-6">
              {[
                { name: "dosage" as const, label: "Dosage", placeholder: "e.g. 10mg CBD" },
                { name: "frequency" as const, label: "Frequency", placeholder: "e.g. 2x daily" },
                { name: "duration" as const, label: "Duration", placeholder: "e.g. 30 days" },
              ].map((f) => (
                <FormField
                  key={f.name}
                  control={form.control}
                  name={f.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><FieldLabel>{f.label}</FieldLabel></FormLabel>
                      <FormControl>
                        <Input data-testid={`input-${f.name}`} placeholder={f.placeholder} {...field} className={inputClass} />
                      </FormControl>
                      <FormMessage className="text-red-400/70 text-xs mt-2" />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Condition */}
            <div className="bg-black p-8">
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><FieldLabel>Treated Condition</FieldLabel></FormLabel>
                    <FormControl>
                      <Input data-testid="input-condition" placeholder="Primary diagnosis or clinical objective" {...field} className={inputClass} />
                    </FormControl>
                    <FormMessage className="text-red-400/70 text-xs mt-2" />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <div className="bg-black p-8">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><FieldLabel>Clinical Notes (Optional)</FieldLabel></FormLabel>
                    <FormControl>
                      <Textarea
                        data-testid="input-notes"
                        placeholder="Monitoring instructions, contraindications, context..."
                        className={`${inputClass} resize-none h-24`}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <div className="bg-black p-8 flex justify-end">
              <button
                data-testid="button-submit-prescription"
                type="submit"
                disabled={createPrescription.isPending}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-black text-sm font-bold rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {createPrescription.isPending ? "Registering..." : <>Sign & Register <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
}
