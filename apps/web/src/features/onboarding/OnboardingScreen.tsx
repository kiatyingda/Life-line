"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PERSON_COLORS, type Person } from "@lifelines/core";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Button } from "@/components/ui/button";
import { Sunrise } from "@/components/ui/sunrise";
import { DateField } from "@/components/ui/date-field";

const schema = z.object({
  name: z.string().trim().min(1, "Tell us your name"),
  birthDate: z.string().min(1, "Add your birth date"),
  lifeExpectancy: z.number().min(40).max(110),
});
type FormValues = z.infer<typeof schema>;

const defaults: FormValues = {
  name: "Me",
  birthDate: "",
  lifeExpectancy: 85,
};

/**
 * First-launch welcome. Full-screen, sunset gradient, sans-bold headline,
 * single-card form, big pinned CTA. The front door, not an interruption.
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
  const birthDate = watch("birthDate");

  const submit = handleSubmit((v) => {
    onSave({
      name: v.name,
      relationship: "self",
      birthDate: v.birthDate,
      lifeExpectancy: v.lifeExpectancy,
      emoji: "",
      color: PERSON_COLORS.self,
    });
  });

  return (
    <form
      onSubmit={submit}
      className="bg-sunset no-scrollbar flex flex-1 flex-col overflow-y-auto px-6 pb-8 pt-12"
    >
      {/* hero */}
      <div className="rise-in mb-9 flex flex-col items-center text-center">
        <Sunrise size={120} />
        <h1
          className="mt-6 font-sans text-[40px] font-extrabold leading-[1.02] text-ink"
          style={{ letterSpacing: "-0.03em" }}
        >
          Welcome.
        </h1>
        <p className="mx-auto mt-3 max-w-[300px] font-sans text-[14.5px] font-medium leading-snug text-ink-2">
          A little about you to begin — so the time you have with everyone else has meaning.
        </p>
      </div>

      {/* form */}
      <div className="rounded-card bg-card/95 p-5 shadow-card backdrop-blur-sm">
        <Field label="Your name" error={formState.errors.name?.message}>
          <TextInput placeholder="Your name" {...register("name")} autoFocus />
        </Field>

        <Field label="Born" error={formState.errors.birthDate?.message}>
          <DateField
            value={birthDate}
            onChange={(iso) =>
              setValue("birthDate", iso, { shouldValidate: !!iso })
            }
          />
        </Field>

        <Field label={`Life expectancy estimate · ${le}`}>
          <input
            type="range"
            min={50}
            max={105}
            value={le}
            onChange={(e) => setValue("lifeExpectancy", Number(e.target.value))}
            className="w-full accent-brand"
          />
          <p className="mt-1 font-sans text-[11.5px] font-medium text-ink-3">
            A rough estimate — it shapes how time is framed, never shown as a countdown.
          </p>
        </Field>
      </div>

      <div className="mt-auto pt-8">
        <Button type="submit" className="press">
          Begin
        </Button>
      </div>
    </form>
  );
}
