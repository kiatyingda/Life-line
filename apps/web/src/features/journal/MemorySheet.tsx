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
import { Avatar } from "@/components/ui/avatar";
import { DateField } from "@/components/ui/date-field";

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
        <DateField
          value={watch("date")}
          onChange={(iso) => setValue("date", iso, { shouldValidate: !!iso })}
        />
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
                  background: on ? `${p.color}28` : "var(--card)",
                  boxShadow: on
                    ? `inset 0 0 0 1.5px ${p.color}90`
                    : `inset 0 0 0 1.5px var(--line-2)`,
                }}
                className="press flex items-center gap-2 rounded-pill py-1 pl-1 pr-3"
              >
                <Avatar p={p} size={24} />
                <span
                  className={`font-sans text-[13px] font-bold ${on ? "text-ink" : "text-ink-3"}`}
                >
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </Field>
      <div className="mt-2">
        <Button type="submit" onClick={submit} className="press">
          Keep this moment
        </Button>
      </div>
      <Label className="mt-3 text-center text-ink-4">The small ones matter most</Label>
    </Sheet>
  );
}
