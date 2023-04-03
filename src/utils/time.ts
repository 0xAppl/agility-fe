export const secondsToDHMS = (seconds: number) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds: remainingSeconds,
  };
};

export const ONE_DAY_IN_SECS = 86400;
