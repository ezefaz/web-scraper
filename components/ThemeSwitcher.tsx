'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// export function ThemeSwitcher() {
//   const [mounted, setMounted] = useState(false);
//   const { theme, setTheme } = useTheme();

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   return (
//     <div>
//       The current theme is: {theme}
//       <button onClick={() => setTheme('light')}>Light Mode</button>
//       <button onClick={() => setTheme('dark')}>Dark Mode</button>
//     </div>
//   );
// }

import React from 'react';
import { Switch, VisuallyHidden, useSwitch } from '@nextui-org/react';
import { BsMoon, BsSun } from 'react-icons/bs';

export const ThemeSwitcher = (props: any) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } = useSwitch(props);

  return (
    <div className='flex justify-end ml-5'>
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: ['w-8 h-8', 'flex items-center justify-center', 'rounded-lg bg-default-100 hover:bg-default-200'],
          })}
        >
          {isSelected ? <BsSun onClick={() => setTheme('light')} /> : <BsMoon onClick={() => setTheme('dark')} />}
        </div>
      </Component>
      {/* <p className='text-default-500 select-none'>{isSelected ? setTheme('light') : setTheme('dark')}</p> */}
    </div>
  );
};
