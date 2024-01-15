import React from 'react';
import { Select, SelectItem, Avatar } from '@nextui-org/react';

export default function CountrySelect() {
  return (
    <Select className='max-w-xs' label='Seleccionar País'>
      <SelectItem
        key='argentina'
        startContent={<Avatar alt='Argentina' className='w-6 h-6' src='https://flagcdn.com/ar.svg' />}
      >
        Argentina
      </SelectItem>
      <SelectItem
        key='brasil'
        startContent={<Avatar alt='Brasil' className='w-6 h-6' src='https://flagcdn.com/br.svg' />}
      >
        Brasil
      </SelectItem>
      <SelectItem
        key='colombia'
        startContent={<Avatar alt='Colombia' className='w-6 h-6' src='https://flagcdn.com/co.svg' />}
      >
        Colombia
      </SelectItem>
      <SelectItem
        key='uruguay'
        startContent={<Avatar alt='Uruguay' className='w-6 h-6' src='https://flagcdn.com/uy.svg' />}
      >
        Uruguay
      </SelectItem>
      <SelectItem
        key='venezuela'
        startContent={<Avatar alt='Venezuela' className='w-6 h-6' src='https://flagcdn.com/ve.svg' />}
      >
        Venezuela
      </SelectItem>
    </Select>
  );
}
