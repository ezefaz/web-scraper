import Account from '@/lib/models/account.model';

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await Account.findOne({
      _id: userId,
    });

    return account;
  } catch {
    return null;
  }
};
