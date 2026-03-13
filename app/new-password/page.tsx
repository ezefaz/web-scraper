import AuthPageShell from "@/components/auth/AuthPageShell";
import ResetForm from "@/components/auth/ResetForm";

export default function NewPasswordPage() {
  return (
    <AuthPageShell
      badge="Recuperación de acceso"
      title="Solicita el enlace para cambiar tu contraseña"
      description="Te enviaremos un enlace seguro por email para restablecer tu contraseña."
      ctaHref="/sign-in"
      ctaLabel="Volver a iniciar sesión"
      withDataBackground
    >
      <ResetForm />
    </AuthPageShell>
  );
}
