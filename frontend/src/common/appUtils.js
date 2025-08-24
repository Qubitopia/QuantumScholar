import {useMemo} from 'react';
import {useLocation} from 'react-router-dom';

export function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export function formatDate(value){
        if (!value) return '';
        const d = new Date(value);
        if (isNaN(d.getTime())) return String(value);
        try {
            return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
        } catch {
            return d.toLocaleString();
        }
};