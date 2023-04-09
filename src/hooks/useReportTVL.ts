import { useEffect } from 'react';

const useReportTVL = (TVL: number, pool: string, disabled?: boolean) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!disabled) {
      window.postMessage({ type: 'TVL', TVL, pool }, '*');
    }
  }, [TVL, pool, disabled]);
};

export default useReportTVL;
