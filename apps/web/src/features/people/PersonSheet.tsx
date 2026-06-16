"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Heart,
  Baby,
  Users,
  Smile,
  type LucideIcon,
} from "lucide-react";
import { PERSON_COLORS, type Person, type Relationship } from "@lifelines/core";
import { Sheet } from "@/components/ui/sheet";
import { Field } from "@/components/ui/field";
import { TextInput } from "@/components/ui/text-input";
import { Button } from "@/components/ui/button";
import { DateField } from "@/components/ui/date-field";

const REL: ReadonlyArray<{ k: Relationship; color: string; Icon: LucideIcon }> = [
  { k: "self", color: PERSON_COLORS.self, Icon: User },
  { k: "partner", color: PERSON_COLORS.partner, Icon: Heart },
  { k: "parent", color: PERSON_COLORS.parent, Icon: User },
  { k: "child", color: PERSON_COLORS.child, Icon: Baby },
  { k: "sibling", color: PERSON_COLORS.sibling, Icon: Users },
  { k: "friend", color: PERSON_COLORS.friend, Icon: Smile },
];

const schema = z.object({
  name: z.string().trim().min(1, "Add a name"),
  relationship: z.enum(["self", "partner", "parent", "child", "sibling", "friend"]),
  birthDate: z.string().min(1, "Add a date"),
  lifeExpectancy: z.number().min(40).max(110),
});
type FormValues = z.infer<typeof schema>;

const blank: FormValues = {
  name: "",
  relationship: "parent",
  birthDate: "",
  lifeExpectancy: 85,
};

export function PersonSheet({
  open,
  onOpenChange,
  editing,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: Person | null;
  onSave: (p: Person | Omit<Person, "id">) => void;
}) {
  const { register, handleSubmit, reset, watch, setValue, formState } =
    useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: blank });

  // Editing the existing self person: lock relationship so they can't
  // accidentally morph themselves into a parent.
  const lockedSelf = editing?.relationship === "self";

  useEffect(() => {
    if (!open) return;
    if (editing) {
      reset({
        name: editing.name,
        relationship: editing.relationship,
        birthDate: editing.birthDate,
        lifeExpectancy: editing.lifeExpectancy,
      });
    } else {
      reset(blank);
    }
  }, [open, editing, reset]);

  const rel = watch("relationship");
  const le = watch("lifeExpectancy");
  const birthDate = watch("birthDate");

  const submit = handleSubmit((v) => {
    const color = REL.find((r) => r.k === v.relationship)?.color ?? PERSON_COLORS.parent;
    const base = { ...v, emoji: editing?.emoji ?? "", color };
    onSave(editing ? { ...editing, ...base } : base);
    onOpenChange(false);
  });

  const title = editing ? "Edit person" : "Someone who matters";
  const buttonLabel = editing ? "Save changes" : "Add to my people";

  // "self" is hidden from the picker — there can only be one. Onboarding lives
  // in OnboardingScreen, not here.
  const pickable = lockedSelf ? [] : REL.filter((r) => r.k !== "self");

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={title}>
      <Field label="Name" error={formState.errors.name?.message}>
        <TextInput placeholder="Dad" {...register("name")} />
      </Field>

      {lockedSelf ? null : (
        <Field label="Relationship">
          <div className="flex flex-wrap gap-2">
            {pickable.map((r) => {
              const on = rel === r.k;
              const Icon = r.Icon;
              return (
                <button
                  key={r.k}
                  type="button"
                  onClick={() => setValue("relationship", r.k)}
                  style={{
                    background: on ? `${r.color}28` : "var(--card)",
                    boxShadow: on
                      ? `inset 0 0 0 1.5px ${r.color}90`
                      : `inset 0 0 0 1.5px var(--line-2)`,
                    color: on ? r.color : undefined,
                  }}
                  className={`press flex items-center gap-[6px] rounded-pill px-[14px] py-2 font-sans text-[13px] font-bold capitalize ${on ? "" : "text-ink-3"}`}
                >
                  <Icon size={14} strokeWidth={2.4} />
                  {r.k}
                </button>
              );
            })}
          </div>
        </Field>
      )}

      <Field label="Born" error={formState.errors.birthDate?.message}>
        <DateField
          value={birthDate}
          onChange={(iso) => setValue("birthDate", iso, { shouldValidate: !!iso })}
        />
      </Field>

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
        <Button type="submit" onClick={submit} className="press">
          {buttonLabel}
        </Button>
      </div>
    </Sheet>
  );
}
