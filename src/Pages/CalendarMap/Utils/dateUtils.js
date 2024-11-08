// /src/Components/Calendar/Utils/dateUtils.js

export const formatDate = (date) => date.toISOString().split('T')[0];

export const getStartAndEndOfMonth = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
};

export const generateDatesArray = (start, end) => {
  const dates = [];
  for (let i = 1; i <= end.getDate(); i++) {
    dates.push(new Date(start.getFullYear(), start.getMonth(), i));
  }
  return dates;
};
