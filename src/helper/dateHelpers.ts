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

export const dateSecondsFromNow = (seconds: number, date?: Date | string) => {
  const currentDate = date ? new Date(date) : new Date();
  return new Date(currentDate.getTime() + seconds * 1000);
};

export const isDateXDaysFromNow = (date: Date, offset: number): boolean => {
  const inputDate = dateWithoutHours(date);

  const offsetDate = dateWithoutHours(dateWithOffset(offset));

  return inputDate.getTime() === offsetDate.getTime();
};

export const isDateXDaysFromNowOrFarther = (
  date: Date,
  offset: number,
): boolean => {
  const inputDate = dateWithoutHours(date);

  const offsetDate = dateWithoutHours(dateWithOffset(offset));

  return inputDate.getTime() <= offsetDate.getTime();
};
