const App = (props) => {
  
  const app = <div>Hello DrupalMountainCamp</div>;
  
  // Setup plugins
  let cachePlugins = {};
  if (typeof window === "undefined" && props.CLI_DATA.fetchCallback) {
    cachePlugins['cache.fetch'] = useCachePlugin('cache.fetch',
      fetchCachePlugin,
      props.CLI_DATA.fetchStore,
      props.CLI_DATA.fetchCallback
    );
  }

  return (
    <PageCacheProvider value={cachePlugins}>
      { app }
    </PageCacheProvider>
  );
}
