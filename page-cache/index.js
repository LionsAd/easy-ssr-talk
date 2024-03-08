import { PageCacheContext } from './context';

const { Provider } = PageCacheContext;

export { Provider };
export { usePageCache, staticCachePlugin, nullCachePlugin, readOnlyCachePlugin, fetchCachePlugin, useCachePlugin } from './hook';
