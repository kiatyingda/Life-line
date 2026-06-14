"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Memory, Person } from "@lifelines/core";
import { Sheet } from "@/components/ui/sheet";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  title: z.string().trim().min(1, "Give it a name"),
  note: z.string().trim().optional(),
  date: z.string().min(1),
  personIds: z.array(z.string()),
});
type FormValues = z.infer<typeof schema>;

const todayISO = (): string => new Date().toISOString().slice(0, 10);

export function MemorySheet({
  open,
  onOpenChange,
  people,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  people: Person[];
  onSave: (m: Omit<Memory, "id">) => void;
}) {
  const { register, handleSubmit, reset, watch, setValue, formState } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { title: "", note: "", date: todayISO(), personIds: [] },
    });

  useEffect(() => {
    if (open) reset({ title: "", note: "", date: todayISO(), personIds: [] });
  }, [open, reset]);

  const ids = watch("personIds");
  const toggle = (id: string) =>
    setValue(
      "personIds",
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );

  const submit = handleSubmit((v) => {
    onSave({ title: v.title, note: v.note || undefined, date: v.date, personIds: v.personIds });
    onOpenChange(false);
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="A moment worth keeping">
      <Field label="What happened" error={formState.errors.title?.message}>
        <TextInput placeholder="Dim sum with Dad" {...register("title")} />
      </Field>
      <Field label="A note (optional)">
        <TextInput placeholder="He ordered too much. Again." {...register("note")} />
      </Field>
      <Field label="When">
        <TextInput type="date" {...register("date")} />
      </Field>
      <Field label="Who was there">
        <div className="flex flex-wrap gap-2">
          {people.map((p) => {
            const on = ids.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(p.id)}
                style={{
                  background: on ? `${p.color}20` : "var(--card)",
                  boxShadow: `inset 0 0 0 1.5px ${on ? `${p.color}70` : "var(--line-2)"}`,
                }}
                className="flex items-center gap-[7px] rounded-pill py-[7px] pl-2 pr-3"
              >
                <span className="text-[15px] leading-none">{p.emoji}</span>
                <span
                  className={`font-sans text-[13px] font-semibold ${on ? "text-ink" : "text-ink-2"}`}
                >
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </Field>
      <div className="mt-2">
        <Button type="submit" onClick={submit}>
          Keep this moment
        </Button>
      </div>
      <Label className="mt-3 text-center text-ink-4">The small ones matter most</Label>
    </Sheet>
  );
}
