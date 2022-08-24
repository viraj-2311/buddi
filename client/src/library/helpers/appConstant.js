import BookCrewStatusTypes from '@iso/enums/book_crew_status_types';
export const OrderBy = {
  ASC: 'asc',
  DESC: 'desc',
};

export const sortOptionList = [
  {
    label: 'Recently added',
    value: 'ra',
    field: 'createdDate',
    order: OrderBy.DESC,
  },
  {
    label: 'A-Z - Full Name',
    value: 'a-z-name',
    field: 'name',
    order: OrderBy.ASC,
  },
  {
    label: 'Z-A - Email',
    value: 'z-a-email',
    field: 'name',
    order: OrderBy.DESC,
  },
  {
    label: 'A-Z - Email',
    value: 'a-z-email',
    field: 'email',
    order: OrderBy.ASC,
  },
  {
    label: 'Z-A - Full Name',
    value: 'z-a-name',
    field: 'email',
    order: OrderBy.DESC,
  },
];

export const sortOptionListForContacts = [
  {
    label: 'A-Z - Email',
    value: 'a-z-email',
    field: 'email',
    order: OrderBy.ASC,
  },
  {
    label: 'Z-A - Full Name',
    value: 'z-a-fullName',
    field: 'fullName',
    order: OrderBy.ASC,
  },
];

export const amountDecimal = 2;

export const JobDocumentTypes = {
  W9: 'W9',
  INVOICES: 'Invoices',
};

export const sortIconHeightWidth = 16;

export const bookCrewStatusList = [
  {
    id: 1,
    status: BookCrewStatusTypes.CONFIRMED,
    color: '#5c4da0',
  },
  {
    id: 2,
    status: BookCrewStatusTypes.DECLINED,
    color: '#e25656',
  },
  {
    id: 3,
    status: BookCrewStatusTypes.MEMO_SENT,
    color: '#808bff',
  },
  {
    id: 4,
    status: BookCrewStatusTypes.MEMO_SAVED,
    color: '#a3a0fb',
  },
  {
    id: 5,
    status: '',
    color: '#ffc06a',
  },
];
