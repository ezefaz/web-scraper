import * as z from 'zod';

const validCountries = ['argentina', 'brasil', 'colombia', 'uruguay', 'venezuela'];

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
