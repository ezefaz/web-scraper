import AuthPageShell from "@/components/auth/AuthPageShell";
import NewVerificationForm from "@/components/auth/NewVerificationForm";

export default function NewVerificationPage() {
  return (
    <AuthPageShell
      badge="Verificación de cuenta"
      title="Estamos validando tu cuenta"
      description="Confirmamos tu email para activar alertas, productos guardados y seguimiento completo de precios."
      ctaHref="/sign-in"
      ctaLabel="Ir a iniciar sesión"
      withDataBackground
    >
      <NewVerificationForm />
    </AuthPageShell>
  );
}
