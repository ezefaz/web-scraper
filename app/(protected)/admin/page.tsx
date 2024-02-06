import AdminDashboard from "@/components/auth/AdminDashboard";
import FormSuccess from "@/components/auth/FormSuccess";
import RoleGate from "@/components/auth/RoleGate";
import { UserRole } from "@/types";

type Props = {};

const AdminPage = async (props: Props) => {
	return (
		<div className='w-[80%]'>
			<RoleGate allowedRole={UserRole.ADMIN}>
				<FormSuccess message='Estas habilitado para ver este contenido.' />
				<AdminDashboard />
			</RoleGate>
		</div>
	);
};

export default AdminPage;
