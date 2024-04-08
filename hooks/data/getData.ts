import useSWR from "swr";
import swrGetFetcher from "../swrGetFetcher";

interface QueryParams {
  timeframe: string;
}

export const useGetData = ({
  queryParams,
}: {
  queryParams: QueryParams;
}) => {
  let fetchedData, error;

  const swrOptions = {
    refreshInterval: 0,
    revalidateOnFocus: true,
  };

  const params = Object.fromEntries(new URLSearchParams(queryParams as any));

  const queryString = new URLSearchParams(params).toString();
  const url = `/api/fetch?${queryString}`;

  ({ data: fetchedData, error } = useSWR(
    url,
    swrGetFetcher,
    swrOptions,
  ));

  return {
    getDataResult: fetchedData,
    getDataError: error,
    getDataLoading: !fetchedData && !error,
  };
};