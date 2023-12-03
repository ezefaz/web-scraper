"use client";

import { esES } from "@clerk/localizations";
// import { SessionProvider } from 'next-auth/react';
import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
	return <ClerkProvider localization={esES}>{children}</ClerkProvider>;
}
