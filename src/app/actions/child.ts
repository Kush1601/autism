"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const ChildSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(4, "Age must be between 4 and 11").max(11, "Age must be between 4 and 11"),
  gender: z.string().min(1, "Please select a gender"),
  ethnicity: z.string().optional(),
  bornWithJaundice: z.boolean().default(false),
  familyASDHistory: z.boolean().default(false),
  country: z.string().optional(),
  whoCompleting: z.string().optional(),
});

export async function createChildAction(values: z.infer<typeof ChildSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const validatedFields = ChildSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    const child = await prisma.child.create({
      data: {
        ...validatedFields.data,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: "Child profile created successfully!", childId: child.id };
  } catch {
    return { error: "Something went wrong! Could not create profile." };
  }
}
