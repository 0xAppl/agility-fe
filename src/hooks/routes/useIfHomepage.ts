import { useLocation } from 'react-router-dom';

const useIfHomepage = () => {
  const { pathname } = useLocation();
  return pathname === '/';
};

export default useIfHomepage;
