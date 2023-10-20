import { faker } from '@faker-js/faker';

export const generateDolarHistory = (numEntries: any) => {
  const dolarHistory = [];

  for (let i = 0; i < numEntries; i++) {
    const randomValue = faker.number.int({ min: 800, max: 1200 });
    const randomDate = faker.date.between({ from: '2023-01-01', to: '2023-12-31' });

    dolarHistory.push({
      value: randomValue,
      date: randomDate.toISOString(),
      _id: faker.datatype.uuid(),
    });
  }

  return dolarHistory;
};

// Generate daily dolar data
export const generateDailyDolarData = (days: any) => {
  const dolarData = [];
  for (let i = 0; i < days; i++) {
    const randomValue = faker.number.int({ min: 800, max: 1000 });
    const randomDate = faker.date.recent();
    dolarData.push({ value: randomValue, date: randomDate.toISOString() });
  }
  return dolarData;
};
// Generate weekly dolar data
export const generateWeeklyDolarData = () => {
  const dolarData = [];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  for (let i = 0; i < 7; i++) {
    const randomValue = faker.number.int({ min: 800, max: 1000 });
    const randomDate = faker.date.between({ from: startOfWeek, to: endOfWeek });
    dolarData.push({ value: randomValue, date: randomDate.toISOString() });
  }
  return dolarData;
};
