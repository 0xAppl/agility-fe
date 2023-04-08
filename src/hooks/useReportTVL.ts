import { useEffect } from 'react';

const useReportTVL = (TVL: number, pool: string) => {
  useEffect(() => {
    window.postMessage({ type: 'TVL', TVL, pool }, '*');
  }, [TVL, pool]);
};

export default useReportTVL;
