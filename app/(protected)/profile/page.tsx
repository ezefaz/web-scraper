'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { SettingsSchema, validCountries } from '@/schemas';
import { Card, CardHeader, CardBody, CardFooter, Select, SelectItem, Avatar } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { settings } from '@/app/actions/settings';
import { Input } from '@nextui-org/react';
import { useCurrentUser } from '@/hooks/use-current-user';
import FormError from '@/components/auth/FormError';
import FormSuccess from '@/components/auth/FormSuccess';

const ProfilePage = () => {
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  console.log('pineda', user);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'USER',
      country: user?.country || 'argentina',
    },
  });

  useEffect(() => {
    setValue('name', user?.name || '');
    setValue('email', user?.email || '');
    setValue('role', user?.role || 'USER');
    setValue('country', user?.country || 'argentina');
  }, [user, setValue]);

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError('Something went wrong!'));
    });
  };

  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>⚙️ Perfil</p>
      </CardHeader>
      <CardBody>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <div>
              <label>Nombre</label>
              <Input defaultValue={user.name} {...register('name')} disabled={isPending} />
            </div>
            {user?.isOAuth === false && (
              <>
                <div>
                  <label>Email</label>
                  <Input defaultValue={user.email} {...register('email')} type='email' disabled={isPending} />
                </div>
                <div>
                  <label>Contraseña</label>
                  <Input {...register('password')} placeholder='******' type='password' disabled={isPending} />
                </div>
                <div>
                  <label>Nueva Contraseña</label>
                  <Input {...register('newPassword')} placeholder='******' type='password' disabled={isPending} />
                </div>
              </>
            )}
            <div>
              <label>País</label>
              <Select {...register('country')} disabled={isPending} label='Seleccionar País'>
                {validCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country.charAt(0).toUpperCase() + country.slice(1)}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type='submit'>
            Guardar
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default ProfilePage;
