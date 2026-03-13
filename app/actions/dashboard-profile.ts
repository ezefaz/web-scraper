"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";

import { update } from "@/auth";
import { getCurrentUser } from "@/lib/actions";
import { reset } from "@/app/actions/reset";
import { connectToDb } from "@/lib/mongoose";
import userModel from "@/lib/models/user.model";

const validCountries = ["argentina", "brasil", "colombia", "uruguay"] as const;

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "El nombre es demasiado largo"),
  country: z.enum(validCountries),
});

export const updateDashboardProfile = async (values: {
  name: string;
  country: (typeof validCountries)[number];
}) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: "No autorizado." };
  }

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await connectToDb();

  const updatedUser = await userModel.findByIdAndUpdate(
    currentUser._id,
    {
      $set: {
        name: parsed.data.name,
        country: parsed.data.country,
      },
    },
    { new: true }
  );

  if (!updatedUser) {
    return { error: "No se pudo actualizar el perfil." };
  }

  await update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  return {
    success: "Perfil actualizado correctamente.",
    user: {
      name: updatedUser.name,
      country: updatedUser.country,
    },
  };
};

export const requestDashboardPasswordReset = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.email) {
    return { error: "No se encontró el email del usuario." };
  }

  return reset({ email: currentUser.email });
};

const productAlertSchema = z.object({
  productId: z.string().min(1),
  enabled: z.boolean(),
});

export const updateProductAlertPreference = async (values: {
  productId: string;
  enabled: boolean;
}) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: "No autorizado." };
  }

  const parsed = productAlertSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Parámetros inválidos." };
  }

  await connectToDb();

  const result = await userModel.updateOne(
    {
      _id: currentUser._id,
      "products._id": parsed.data.productId,
    },
    {
      $set: {
        "products.$.isFollowing": parsed.data.enabled,
      },
    }
  );

  if (!result.matchedCount) {
    return { error: "No se encontró el producto dentro de tus guardados." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  return {
    success: parsed.data.enabled
      ? "Alerta activada para este producto."
      : "Alerta desactivada para este producto.",
  };
};
