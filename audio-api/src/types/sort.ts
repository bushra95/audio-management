export const sortFields = ['createdAt', 'sentencelocal', 'sentenceapi'] as const;
export type ValidSortField = typeof sortFields[number];

export const sortOrders = ['asc', 'desc'] as const;
export type ValidSortOrder = typeof sortOrders[number]; 