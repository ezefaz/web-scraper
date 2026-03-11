import RegisterForm from "@/components/auth/RegisterForm";
import AuthPageShell from "@/components/auth/AuthPageShell";

export default function Page() {
  return (
    <AuthPageShell
      badge="¿Ya tienes cuenta?"
      title="Empezá a ahorrar mejor, desde hoy"
      description="Creá tu cuenta para guardar productos, seguir precios y decidir con datos claros."
      ctaHref="/sign-in"
      ctaLabel="Iniciar sesión"
    >
      <RegisterForm />
    </AuthPageShell>
  );
}
