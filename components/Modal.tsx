'use client';

import { FormEvent, Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { addUserEmailToProduct } from '@/lib/actions';
import { toast } from 'react-hot-toast';

import { useCurrentUser } from '@/hooks/use-current-user';

interface Props {
  productUrl: string;
}

const Modal = ({ productUrl }: Props) => {
  const currentUser = useCurrentUser();

  if (!currentUser) return;

  const userEmail = currentUser.email;

  let [isOpen, setIsOpen] = useState(true);
  let [isSubmitting, setIsSubmitting] = useState(false);
  let [email, setEmail] = useState(userEmail ? userEmail : '');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    await addUserEmailToProduct(productUrl, email);

    setIsSubmitting(false);
    setEmail('');

    toast.success(`Seguimiento realizado! Porfavor chequee su correo ${userEmail}`);
    closeModal();
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button type='button' className='btn text-white mr-8' onClick={openModal}>
        {/* <Image src='/assets/icons/search-plus.svg' alt='check' width={22} height={22} className='m-auto' /> */}
        Iniciar Seguimiento
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' onClose={closeModal} className='dialog-container '>
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0' />
            </Transition.Child>
            <span className='inline-block h-screen align-middle' aria-hidden='true' />

            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div className='dialog-content dark:bg-black border border-gray-200'>
                <div className='flex flex-col'>
                  <div className='flex justify-between'>
                    <div className='p-3 border border-gray-200 rounded-10'>
                      <Image src='/assets/icons/savemelin3.svg' alt='Logo' width={48} height={48} />
                    </div>
                    <Image
                      src='/assets/icons/x-close.svg'
                      alt='close'
                      width={24}
                      height={24}
                      className='cursor-pointer'
                      onClick={closeModal}
                    />
                  </div>
                  <h4 className='dialog-head_text dark:text-white '>
                    ¡Manténgase actualizado con alertas de precios de productos directamente en su bandeja de entrada!
                  </h4>
                  <p className='text-sm text-gray-600 mt-2'>
                    ¡Nunca más te pierdas una ganga con nuestras alertas oportunas!
                  </p>
                </div>

                <form className='flex flex-col mt-5' onSubmit={handleSubmit}>
                  {/* <label htmlFor='email' className='text-sm font-medium text-gray-700'>
                    Email
                  </label>
                  <div className='dialog-input_container'>
                    <Image src='/assets/icons/mail.svg' alt='email' width={18} height={18} />
                    <input
                      required
                      type='email'
                      id='email'
                      value={email}
                      placeholder='Ingrese su correo electronico'
                      onChange={(e) => setEmail(e.target.value)}
                      className='dialog-input'
                    />
                  </div> */}
                  <button type='submit' className='dialog-btn dark:text-white'>
                    {isSubmitting ? 'Enviando...' : 'Iniciar Seguimiento'}
                  </button>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
