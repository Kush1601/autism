"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createChildAction } from "@/app/actions/child";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChildProfileForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      const result = await createChildAction({
        name: String(formData.get("name") ?? ""),
        age: Number(formData.get("age")),
        gender: String(formData.get("gender") ?? ""),
        ethnicity: String(formData.get("ethnicity") ?? "") || undefined,
        country: String(formData.get("country") ?? "") || undefined,
        whoCompleting: String(formData.get("whoCompleting") ?? "") || undefined,
        bornWithJaundice: formData.get("bornWithJaundice") === "on",
        familyASDHistory: formData.get("familyASDHistory") === "on",
      });
      if (result.error) return setMessage(result.error);
      router.push(`/dashboard/child/${result.childId}`);
    });
  }

  return (
    <form action={submit} className="grid gap-5">
      <div className="grid gap-2"><Label htmlFor="name">Child&apos;s name</Label><Input id="name" name="name" required minLength={2} /></div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="grid gap-2"><Label htmlFor="age">Age</Label><Input id="age" name="age" type="number" min="4" max="11" required /></div>
        <div className="grid gap-2"><Label htmlFor="gender">Gender</Label><select id="gender" name="gender" required className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other / prefer not to say</option></select></div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="grid gap-2"><Label htmlFor="country">Country</Label><Input id="country" name="country" /></div>
        <div className="grid gap-2"><Label htmlFor="whoCompleting">Completed by</Label><Input id="whoCompleting" name="whoCompleting" placeholder="Parent, relative, clinician…" /></div>
      </div>
      <div className="grid gap-2"><Label htmlFor="ethnicity">Ethnicity (optional)</Label><Input id="ethnicity" name="ethnicity" /></div>
      <label className="flex items-center gap-3 text-sm"><input name="bornWithJaundice" type="checkbox" /> Born with jaundice</label>
      <label className="flex items-center gap-3 text-sm"><input name="familyASDHistory" type="checkbox" /> Family history of autism</label>
      {message && <p className="text-sm text-destructive">{message}</p>}
      <Button disabled={pending} type="submit">{pending ? "Saving…" : "Save child profile"}</Button>
    </form>
  );
}
