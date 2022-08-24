import moment from 'moment';

const dateSort = (dateA, dateB, multiplier) =>
  moment(dateA).diff(moment(dateB)) * multiplier;

const defaultSort = (a, b) => {
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
};

const stringSort = (a, b) => {
  const aa = a.toUpperCase();
  const bb = b.toUpperCase();
  if (aa < bb) return -1;
  if (bb < aa) return 1;
  return 0;
};

export const Sorter = {
  DEFAULT: defaultSort,
  DATE: dateSort,
  STRING: stringSort,
};
