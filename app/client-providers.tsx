"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";

type ClientProvidersProps = {
  children: React.ReactNode;
  session: Session | null;
};

export default function ClientProviders({
  children,
  session,
}: ClientProvidersProps) {
  return (
    <SessionProvider session={session}>
      <Providers>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
        <Analytics />
      </Providers>
    </SessionProvider>
  );
}

