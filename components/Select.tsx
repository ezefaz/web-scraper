'use client';
import { Select, SelectItem } from '@tremor/react';
import { useState } from 'react';

export function SelectMenu() {
  const [value, setValue] = useState('');
  return (
    <>
      <div className='flex justify-start space-x-6'>
        <div className='max-w-xs space-y-2'>
          <Select className='w-full' placeholder='Stock'>
            <SelectItem value='1'>Disponible</SelectItem>
            <SelectItem value='2'>Sin Stock</SelectItem>
          </Select>
        </div>
        <div className='max-w-xs space-y-2'>
          <Select className='w-full' value={value} onValueChange={setValue} placeholder='Precio'>
            <SelectItem value='1'>Mayor Precio</SelectItem>
            <SelectItem value='2'>Menor Precio</SelectItem>
            <SelectItem value='3'>Mayor Precio (USD)</SelectItem>
            <SelectItem value='4'>Menor Precio (USD)</SelectItem>
          </Select>
        </div>
      </div>
    </>
  );
}
