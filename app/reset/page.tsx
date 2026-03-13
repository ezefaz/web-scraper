import AuthPageShell from "@/components/auth/AuthPageShell";
import NewPasswordForm from "@/components/auth/NewPasswordForm";

export default function ResetPage() {
  return (
    <AuthPageShell
      badge="Cambio de contraseña"
      title="Restablece tu contraseña"
      description="Ingresa una nueva contraseña para recuperar el acceso a tu cuenta."
      ctaHref="/sign-in"
      ctaLabel="Volver a iniciar sesión"
      withDataBackground
    >
      <NewPasswordForm />
    </AuthPageShell>
  );
}
