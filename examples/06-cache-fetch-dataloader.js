export function useFetchDataLoader(uri) {
  if (typeof window !== "undefined") {
    return useUncachedDataLoader(uri);
  }

  return usePageCache('cache.fetch', uri, () => useUncachedDataLoader(uri));
}
