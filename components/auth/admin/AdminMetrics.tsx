'use client';

import { getUsersForDashboard } from '@/lib/actions';
import { BadgeDelta, Card, Flex, Grid, Metric, ProgressBar, Text } from '@tremor/react';
import React, { useEffect, useState } from 'react';

type Props = {};

const AdminMetrics = (props: Props) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [users, setUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('stock');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers: any = await getUsersForDashboard();

        setUsers(fetchedUsers);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  return (
    <Grid numItemsMd={2} numItemsLg={3} className='mt-6 gap-6'>
      {users.map((item: any) => (
        <Card key={item._id}>
          <Flex alignItems='start'>
            <div className='truncate'>
              <Text>Usuarios</Text>
              <Metric className='truncate'>{item.metric}</Metric>
            </div>
            <BadgeDelta deltaType='moderateIncrease'>{item.delta}</BadgeDelta>
          </Flex>
          <Flex className='mt-4 space-x-2'>
            <Text className='truncate'>{`${item.progress}% (${item.metric})`}</Text>
            <Text className='truncate'>{item.target}</Text>
          </Flex>
          <ProgressBar value={item.progress} className='mt-2' />
        </Card>
      ))}
    </Grid>
  );
};

export default AdminMetrics;
