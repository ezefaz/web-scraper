import { signOut } from '@/auth';

export const logout = async () => {
  signOut();
};
