import AuthPageShell from "@/components/auth/AuthPageShell";
import ResetForm from "@/components/auth/ResetForm";

export default function ResetPage() {
  return (
    <AuthPageShell
      badge="Recuperación de acceso"
      title="Recupera tu cuenta de SaveMelin"
      description="Te enviamos un enlace seguro para restablecer tu contraseña y volver a seguir precios en minutos."
      ctaHref="/sign-in"
      ctaLabel="Volver a iniciar sesión"
      withDataBackground
    >
      <ResetForm />
    </AuthPageShell>
  );
}
