import * as z from 'zod';

export const validCountries = ['argentina', 'brasil', 'colombia', 'uruguay'];

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'El correo es obligatorio',
  }),
  password: z.string().min(1, {
    message: 'La contraseña es obligatoria',
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'El correo es obligatorio',
  }),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    role: z.enum(['ADMIN', 'USER']),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
    country: z.string().refine((value) => validCountries.includes(value), {
      message: 'El país seleccionado no es válido',
    }),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'La nueva contraseña es requerida!',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: 'Contrasena es requerida!',
      path: ['password'],
    }
  );

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres.',
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'El correo es obligatorio',
  }),
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres',
  }),
  name: z.string().min(1, {
    message: 'El nombre es obligatorio',
  }),
  country: z.string().refine((value) => validCountries.includes(value), {
    message: 'El país seleccionado no es válido',
  }),
});
