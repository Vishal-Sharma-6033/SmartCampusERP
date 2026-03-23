export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  if (!error) return fallback

  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback

  return String(message)
}
