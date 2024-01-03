import NewVerificationForm from '@/components/auth/NewVerificationForm';

import CardWrapper from '@/components/CardWrapper';

type Props = {};

const NewVerificationPage = (props: Props) => {
  return (
    <div className='flex justify-center w-full mt-40 items-center'>
      <NewVerificationForm />
    </div>
  );
};

export default NewVerificationPage;
