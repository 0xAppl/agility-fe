import { useEffect, useState } from 'react';

const useCountDown = (targetTime: number, start = true) => {
  const timeDifference = targetTime - new Date().getTime();
  const [second, setSecond] = useState(timeDifference);

  useEffect(() => {
    if (second >= 0) {
      setTimeout(() => {
        setSecond(second - 1000);
      }, 1000);
    }
  }, [start, second]);
  return Math.round(second);
};

export default useCountDown;
