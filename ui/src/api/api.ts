export interface BaseResponse {
  error?: false;
}

export interface ErrorResponse {
  error: true;
  message: string;
}

export async function performFetch<TData extends BaseResponse>(
  input: RequestInfo,
  init?: RequestInit
) {
  const response = await fetch(input, init);
  const data: TData | ErrorResponse = await response.json();
  if (data.error) throw new Error(data.message);
  return data;
}
