export const calculateHourlyPayIncrease = (
  originalPay: number,
  currentPay: number,
) => {
  if (originalPay === 0) return 0;
  return ((currentPay - originalPay) / originalPay) * 100;
};

export const formatDate = (dateString: string): string => {
  const dateObj = new Date(dateString);
  const year = dateObj.getUTCFullYear();
  const month = ('0' + (dateObj.getUTCMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1 해줌
  const day = ('0' + dateObj.getUTCDate()).slice(-2);
  const hours = ('0' + dateObj.getUTCHours()).slice(-2);
  const minutes = ('0' + dateObj.getUTCMinutes()).slice(-2);

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formattedDate;
};

export const calculateEndTime = (
  startTimeString: string,
  workHours: number,
) => {
  const dateObj = new Date(startTimeString);
  const millisecondsPerHour = 60 * 60 * 1000;
  const currentMilliseconds = dateObj.getTime();
  const targetMilliseconds =
    currentMilliseconds + workHours * millisecondsPerHour;
  const newDateObj = new Date(targetMilliseconds);
  const hours = ('0' + newDateObj.getUTCHours()).slice(-2);
  const minutes = ('0' + newDateObj.getUTCMinutes()).slice(-2);

  const formattedTime = `${hours}:${minutes}`;

  return formattedTime;
};

export const formatDateForInput = (date: string) => {
  if (!date) return '';
  const parsedDate = new Date(date);
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
