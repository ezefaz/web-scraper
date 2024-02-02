"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import React from "react";
import FormError from "./FormError";
import { UserRole } from "@/types";

interface RoleGatesProps {
	children: React.ReactNode;
	allowedRole: UserRole.ADMIN;
}

const RoleGate = ({ children, allowedRole }: RoleGatesProps) => {
	const role = useCurrentRole();

	if (role !== allowedRole) {
		return (
			<FormError message='El usuario no tiene permisos para ver el contenido.' />
		);
	}

	return <>{children}</>;
};

export default RoleGate;
