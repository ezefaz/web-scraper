import UserInfo from '@/components/UserInfo';
import { getCurrentUser } from '@/lib/actions';
import { signOut } from 'next-auth/react';

type Props = {};

const ProfilePage = async (props: Props) => {
  const user = await getCurrentUser();

  return <UserInfo user={user} label='Información de tu cuenta' />;
};

export default ProfilePage;
