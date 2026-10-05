"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { profileFields } from "@/lib/schemas";
import type { Profile } from "@/lib/types";
import { saveProfile } from "../actions";
import { FieldInput, primaryButton, SaveStatus, useSaver } from "./controls";

export default function ProfileForm({ initial }: { initial: Profile }) {
  const [profile, setProfile] = useState<Profile>(initial);
  const { pending, message, run } = useSaver();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(() => saveProfile(profile));
      }}
      className="max-w-2xl space-y-4 rounded-xl border border-line bg-card p-5"
    >
      {profileFields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          value={profile[field.name as keyof Profile]}
          onChange={(v) => setProfile((p) => ({ ...p, [field.name]: v }))}
        />
      ))}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} className={primaryButton}>
          <Save size={16} /> {pending ? "Saving…" : "Save profile"}
        </button>
        <SaveStatus message={message} />
      </div>
    </form>
  );
}
