'use client';

import { getUsersForDashboard } from '@/lib/actions';
import {
  Card,
  Flex,
  Icon,
  MultiSelect,
  MultiSelectItem,
  Select,
  SelectItem,
  TabPanel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from '@tremor/react';
import { useEffect, useState } from 'react';
import { IoMdInformationCircleOutline } from 'react-icons/io';

type Props = {};

const UsersDashboard = (props: Props) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [users, setUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('stock');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isUserSelected = (user: any) =>
    // (user.id === selectedStatus || selectedStatus === 'all') &&
    selectedUsers.includes(user.email) || selectedUsers.length === 0;

  const formatDate = (dateString: string) => {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers: any = await getUsersForDashboard();
        setUsers(fetchedUsers);
        setLoading(false);

        console.log('Fetched Users:', fetchedUsers);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  return (
    <TabPanel>
      <div className='mt-6'>
        <Card>
          <>
            <div>
              <Flex className='space-x-0.5' justifyContent='start' alignItems='center'>
                <Title> Historial de Usuarios </Title>
                <Icon
                  icon={IoMdInformationCircleOutline}
                  variant='simple'
                  tooltip='Muestra la cantidad actual de usuarios'
                />
              </Flex>
            </div>
            <div className='flex space-x-2'>
              <MultiSelect
                className='max-w-full sm:max-w-xs'
                onValueChange={setSelectedUsers}
                placeholder='Seleccionar Usuario...'
              >
                {users.map((item: any) => (
                  <MultiSelectItem key={item._id} value={item.email}>
                    {item.email}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
              {/* <Select className='max-w-full sm:max-w-xs' defaultValue='all' onValueChange={setSelectedStatus}>
                <SelectItem value='all'>All Performances</SelectItem>
                <SelectItem value='overperforming'>Overperforming</SelectItem>
                <SelectItem value='average'>Average</SelectItem>
                <SelectItem value='underperforming'>Underperforming</SelectItem>
              </Select> */}
            </div>
            <Table className='mt-6'>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Creado</TableHeaderCell>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell className='text-right'>Nombre</TableHeaderCell>
                  <TableHeaderCell className='text-right'>Cant. Productos</TableHeaderCell>
                  <TableHeaderCell className='text-right'>Rol</TableHeaderCell>
                  <TableHeaderCell className='text-right'>Correo Verificado</TableHeaderCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users
                  .filter((user: any) => isUserSelected(user))
                  .map((user: any) => (
                    <TableRow key={user.name}>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className='text-right'>{user.name}</TableCell>
                      <TableCell className='text-right'>{user.products} productos</TableCell>
                      <TableCell className='text-right'>{user.role}</TableCell>
                      <TableCell className='text-right'>{user.emailVerified ? 'Si' : 'No'}</TableCell>
                      <TableCell className='text-right'>
                        {/* <BadgeDelta deltaType={deltaTypes[item.status]} size='xs'>
                          {item.status}
                        </BadgeDelta> */}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </>
        </Card>
      </div>
    </TabPanel>
  );
};

export default UsersDashboard;
