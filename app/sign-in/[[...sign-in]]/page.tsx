import LoginForm from "@/components/auth/LoginForm";
import AuthPageShell from "@/components/auth/AuthPageShell";

export default function Page() {
  return (
    <AuthPageShell
      badge="¿Primera vez por acá?"
      title="Volvé a tu espacio de ahorro"
      description="Seguí productos, monitoreá cambios de precios y compará oportunidades en segundos."
      ctaHref="/sign-up"
      ctaLabel="Crear cuenta"
      withDataBackground
    >
      <LoginForm />
    </AuthPageShell>
  );
}
