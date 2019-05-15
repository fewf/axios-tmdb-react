import moment from 'moment';
import { API_KEY, API_ROOT } from './constants';

export function getApiUrl(query) {
  query.api_key = API_KEY;
  const search = Object.keys(query)
    .map(
      paramKey =>
        `${encodeURIComponent(paramKey)}=${encodeURIComponent(query[paramKey])}`
    )
    .join('&');
  return `${API_ROOT}${search ? '?' : ''}${search}`;
}

export function formatDate(date) {
  return moment(date).format('MMMM D, Y');
}
