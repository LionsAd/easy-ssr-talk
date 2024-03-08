const App = (props) => {
  
  const app = <div>Hello DrupalMountainCamp</div>;
  
  // Need to have a callback for updates that happen inside cacheState.
  let [cacheCounter, setCacheCounter] = useState(0);
  const incCacheCounter = () => setCacheCounter(cacheCounter++);

  // Setup plugins
  let cachePlugins = {};
  cachePlugins['cache.page'] = useCachePlugin('cache.page', plugin, preRenderData, incCacheCounter);

  // Retrieve page cache state.
  const cacheState = cachePlugins['cache.page'].state;

  return (
    <PageCacheProvider value={cachePlugins}>
      { app }
      <PreRenderData counter={ cacheCounter } data={ cacheState }></PreRenderData>
    </PageCacheProvider>
  );
}
