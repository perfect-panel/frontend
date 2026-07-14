const PAGE_SIZE = 100;

type PaginatedListFetcher<T> = (params: {
  page: number;
  size: number;
}) => Promise<{
  data?: {
    data?: {
      list?: T[];
      total?: number;
    };
  };
}>;

export const fetchAllPaginated = async <T>(
  fetchPage: PaginatedListFetcher<T>
): Promise<T[]> => {
  const firstResponse = await fetchPage({ page: 1, size: PAGE_SIZE });
  const firstPage = firstResponse.data?.data;
  const firstList = firstPage?.list || [];
  const total = firstPage?.total || firstList.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (totalPages <= 1) {
    return firstList;
  }

  const remainingResponses = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      fetchPage({ page: index + 2, size: PAGE_SIZE })
    )
  );

  const items = [...firstList];

  for (const response of remainingResponses) {
    items.push(...(response.data?.data?.list || []));
  }

  return items;
};
