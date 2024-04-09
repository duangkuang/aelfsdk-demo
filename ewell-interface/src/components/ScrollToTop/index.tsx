import { pageToTop } from 'components/ToTop/utils';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    pageToTop({ top: 0 });
  }, [pathname]);

  return null;
}
