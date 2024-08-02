export const getDateWithOffset = (offset: number): Date => {
  const currentDate = new Date();
  const offsetDate = new Date(currentDate);
  offsetDate.setDate(currentDate.getDate() + offset);
  return offsetDate;
};
