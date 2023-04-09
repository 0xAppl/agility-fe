import { useEffect } from 'react';

const useReportTVL = (TVL: number, pool: string) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    window.postMessage({ type: 'TVL', TVL: isNaN(TVL) ? 0 : TVL, pool }, '*');
  }, [TVL, pool]);
};

export default useReportTVL;
