export const dateWithOffset = (offset: number, date?: Date | string): Date => {
  const currentDate = date ? new Date(date) : new Date();
  const offsetDate = new Date(currentDate);
  offsetDate.setDate(currentDate.getDate() + offset);
  return offsetDate;
};

export const dateWithoutHours = (date: Date | string) => {
  const newDate = new Date(date);
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
};
