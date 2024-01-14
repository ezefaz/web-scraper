'use client';

import React, { useEffect, useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  User,
  Switch,
  VisuallyHidden,
  useSwitch,
} from '@nextui-org/react';
import { PiPlusCircleDuotone } from 'react-icons/pi';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-use';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function UserDropdown(props: any) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const loggedUser = useCurrentUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } = useSwitch(props);

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  return (
    <Dropdown
      showArrow
      radius='sm'
      classNames={{
        base: 'before:bg-default-200',
        content: 'p-0 border-small border-divider bg-background',
      }}
    >
      <DropdownTrigger>
        <Button variant='ghost' disableRipple>
          Menu
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Custom item styles'
        disabledKeys={[]}
        className='p-3'
        itemClasses={{
          base: [
            'rounded-md',
            'text-default-500',
            'transition-opacity',
            'data-[hover=true]:text-foreground',
            'data-[hover=true]:bg-default-100',
            'dark:data-[hover=true]:bg-default-50',
            'data-[selectable=true]:focus:bg-default-50',
            'data-[pressed=true]:opacity-70',
            'data-[focus-visible=true]:ring-default-500',
          ],
        }}
      >
        <DropdownSection aria-label='Preferencias' showDivider>
          <DropdownItem key='profile' className='h-14 gap-2'>
            <User
              name={loggedUser?.name}
              description={loggedUser?.email}
              classNames={{
                name: 'text-default-600',
                description: 'text-default-500',
              }}
              avatarProps={{
                size: 'sm',
                src: `${loggedUser ? loggedUser.image : '/assets/icons/user.svg'}`,
              }}
            />
          </DropdownItem>
          {loggedUser && loggedUser.role === 'ADMIN' && <DropdownItem key='dashboard'>Dashboard</DropdownItem>}
          <DropdownItem key='profile'>
            <Link href='/profile'>Perfil</Link>
          </DropdownItem>
          <DropdownItem key='my_products' endContent={<PiPlusCircleDuotone className='text-large' />}>
            <Link href='/user-products'>Mis Productos</Link>
          </DropdownItem>
        </DropdownSection>
        <DropdownSection aria-label='Preferences' showDivider>
          {/* <DropdownItem key='quick_search' shortcut='⌘K'>
            Busqueda Rápida
          </DropdownItem> */}
          <DropdownItem
            isReadOnly
            key='theme'
            className='cursor-default'
            endContent={
              <select
                className='z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500'
                id='theme'
                name='theme'
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value='light' selected={isSelected}>
                  Light
                </option>
                <option value='dark' selected={!isSelected}>
                  Dark
                </option>
              </select>
            }
          >
            Tema
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label='Ayuda & Feedback'>
          <DropdownItem key='help_and_feedback'>Ayuda & Feedback</DropdownItem>
          <DropdownItem key='logout' onClick={handleSignOut}>
            Cerrar Sesión
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
