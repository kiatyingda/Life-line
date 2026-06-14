"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PERSON_COLORS, type Person, type Relationship } from "@lifelines/core";
import { Sheet } from "@/components/ui/sheet";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Button } from "@/components/ui/button";

const REL: ReadonlyArray<{ k: Relationship; emoji: string; color: string }> = [
  { k: "self", emoji: "🧑🏻", color: PERSON_COLORS.self },
  { k: "partner", emoji: "🧑🏻‍🤝‍🧑🏻", color: PERSON_COLORS.partner },
  { k: "parent", emoji: "👵🏻", color: PERSON_COLORS.parent },
  { k: "child", emoji: "🧒🏻", color: PERSON_COLORS.child },
  { k: "sibling", emoji: "🧑🏻", color: PERSON_COLORS.sibling },
  { k: "friend", emoji: "🙂", color: PERSON_COLORS.friend },
];

const schema = z.object({
  name: z.string().trim().min(1, "Add a name"),
  relationship: z.enum(["self", "partner", "parent", "child", "sibling", "friend"]),
  birthDate: z.string().min(1, "Add a date"),
  lifeExpectancy: z.number().min(40).max(110),
  emoji: z.string().trim().min(1),
});
type FormValues = z.infer<typeof schema>;

const blank: FormValues = {
  name: "",
  relationship: "parent",
  birthDate: "1960-01-01",
  lifeExpectancy: 85,
  emoji: "👵🏻",
};

const selfBlank: FormValues = {
  name: "Me",
  relationship: "self",
  birthDate: "",
  lifeExpectancy: 85,
  emoji: "🧑🏻",
};

export function PersonSheet({
  open,
  onOpenChange,
  editing,
  onSave,
  firstRun = false,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: Person | null;
  onSave: (p: Person | Omit<Person, "id">) => void;
  /** First-launch self setup: locks relationship to "self", blocks dismissal. */
  firstRun?: boolean;
}) {
  const { register, handleSubmit, reset, watch, setValue, formState } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: firstRun ? selfBlank : blank,
    });

  const lockedSelf = firstRun || editing?.relationship === "self";

  useEffect(() => {
    if (!open) return;
    if (editing) {
      reset({
        name: editing.name,
        relationship: editing.relationship,
        birthDate: editing.birthDate,
        lifeExpectancy: editing.lifeExpectancy,
        emoji: editing.emoji,
      });
    } else {
      reset(firstRun ? selfBlank : blank);
    }
  }, [open, editing, reset, firstRun]);

  const rel = watch("relationship");
  const le = watch("lifeExpectancy");
  const emoji = watch("emoji");

  const submit = handleSubmit((v) => {
    const color = REL.find((r) => r.k === v.relationship)?.color ?? PERSON_COLORS.parent;
    const base = { ...v, color };
    onSave(editing ? { ...editing, ...base } : base);
    onOpenChange(false);
  });

  const title = firstRun
    ? "Hi — start with you"
    : editing
      ? "Edit person"
      : "Someone who matters";

  const buttonLabel = firstRun
    ? "Save my profile"
    : editing
      ? "Save changes"
      : "Add to my people";

  // "self" is hidden from the picker outside firstRun — there can only be one.
  const pickable = lockedSelf ? [] : REL.filter((r) => r.k !== "self");

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      dismissible={!firstRun}
    >
      <Field label="Name" error={formState.errors.name?.message}>
        <TextInput placeholder={firstRun ? "Your name" : "Dad"} {...register("name")} />
      </Field>

      {lockedSelf ? null : (
        <Field label="Relationship">
          <div className="flex flex-wrap gap-2">
            {pickable.map((r) => {
              const on = rel === r.k;
              return (
                <button
                  key={r.k}
                  type="button"
                  onClick={() => {
                    setValue("relationship", r.k);
                    if (!editing) setValue("emoji", r.emoji);
                  }}
                  style={{
                    background: on ? `${r.color}20` : "var(--card)",
                    boxShadow: `inset 0 0 0 1.5px ${on ? `${r.color}70` : "var(--line-2)"}`,
                  }}
                  className={`rounded-pill px-[14px] py-2 font-sans text-[13px] font-semibold capitalize ${on ? "text-ink" : "text-ink-2"}`}
                >
                  {r.k}
                </button>
              );
            })}
          </div>
        </Field>
      )}

      <div className="flex gap-3">
        <div className="flex-1">
          <Field label="Born" error={formState.errors.birthDate?.message}>
            <TextInput type="date" {...register("birthDate")} />
          </Field>
        </div>
        <div className="w-[92px]">
          <Field label="Emoji">
            <TextInput
              className="text-center text-xl"
              value={emoji}
              onChange={(e) => setValue("emoji", e.target.value)}
            />
          </Field>
        </div>
      </div>

      {rel !== "child" ? (
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
      ) : null}

      <div className="mt-2">
        <Button type="submit" onClick={submit}>
          {buttonLabel}
        </Button>
      </div>
    </Sheet>
  );
}
