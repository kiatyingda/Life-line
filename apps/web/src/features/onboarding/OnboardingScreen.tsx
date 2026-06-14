"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PERSON_COLORS, type Person } from "@lifelines/core";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().trim().min(1, "Tell us your name"),
  birthDate: z.string().min(1, "Add your birth date"),
  lifeExpectancy: z.number().min(40).max(110),
  emoji: z.string().trim().min(1),
});
type FormValues = z.infer<typeof schema>;

const defaults: FormValues = {
  name: "Me",
  birthDate: "",
  lifeExpectancy: 85,
  emoji: "🧑🏻",
};

/**
 * First-launch welcome. Full-screen — not a sheet — because this is the
 * front door, not an interruption. Sunset gradient sets the tone the rest
 * of the app inherits.
 */
export function OnboardingScreen({
  onSave,
}: {
  onSave: (p: Omit<Person, "id">) => void;
}) {
  const { register, handleSubmit, watch, setValue, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const le = watch("lifeExpectancy");
  const emoji = watch("emoji");

  const submit = handleSubmit((v) => {
    onSave({
      name: v.name,
      relationship: "self",
      birthDate: v.birthDate,
      lifeExpectancy: v.lifeExpectancy,
      emoji: v.emoji,
      color: PERSON_COLORS.self,
    });
  });

  return (
    <form
      onSubmit={submit}
      className="bg-sunset no-scrollbar flex flex-1 flex-col overflow-y-auto px-5 pb-7 pt-10"
    >
      {/* hero */}
      <div className="mb-7 text-center">
        <div className="mb-3 text-[52px] leading-none" aria-hidden>
          🌅
        </div>
        <h1 className="font-serif text-[34px] font-medium leading-[1.05] text-ink">
          Welcome.
        </h1>
        <p className="mx-auto mt-2 max-w-[280px] font-sans text-[14px] leading-snug text-ink-2">
          A little about you to begin — so the time you have with everyone else
          has meaning.
        </p>
      </div>

      {/* form */}
      <div className="rounded-card bg-card-soft/95 p-4 shadow-card backdrop-blur-sm">
        <Field label="Your name" error={formState.errors.name?.message}>
          <TextInput placeholder="Your name" {...register("name")} autoFocus />
        </Field>

        <div className="flex gap-3">
          <div className="flex-1">
            <Field label="Born" error={formState.errors.birthDate?.message}>
              <TextInput type="date" {...register("birthDate")} />
            </Field>
          </div>
          <div className="w-[78px]">
            <Field label="You">
              <TextInput
                className="text-center text-xl"
                value={emoji}
                onChange={(e) => setValue("emoji", e.target.value)}
              />
            </Field>
          </div>
        </div>

        <Field label={`Life expectancy estimate · ${le}`}>
          <input
            type="range"
            min={50}
            max={105}
            value={le}
            onChange={(e) => setValue("lifeExpectancy", Number(e.target.value))}
            className="w-full accent-brand"
          />
          <p className="mt-1 font-sans text-[11.5px] text-ink-3">
            A rough estimate — it only shapes how time is framed, never shown as a countdown.
          </p>
        </Field>
      </div>

      {/* CTA pinned bottom */}
      <div className="mt-auto pt-6">
        <Button type="submit">Begin</Button>
      </div>
    </form>
  );
}
