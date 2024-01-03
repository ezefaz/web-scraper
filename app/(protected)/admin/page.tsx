import UserInfo from '@/components/UserInfo';
import AdminDashboard from '@/components/auth/AdminDashboard';
import FormSuccess from '@/components/auth/FormSuccess';
import RoleGate from '@/components/auth/RoleGate';
import { getCurrentUser } from '@/lib/actions';

type Props = {};

const AdminPage = async (props: Props) => {
  const user = await getCurrentUser();

  return (
    <div>
      <RoleGate allowedRole='ADMIN'>
        <FormSuccess message='Estas habilitado para ver este contenido.' />
        <AdminDashboard />
      </RoleGate>
    </div>
  );
};

export default AdminPage;
