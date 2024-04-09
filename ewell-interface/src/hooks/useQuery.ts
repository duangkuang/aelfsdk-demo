import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { extract, parse } from 'query-string';

export const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => parse(extract(search || '')), [search]);
};
