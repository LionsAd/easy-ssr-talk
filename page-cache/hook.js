import { useContext, useState, useMemo } from 'preact/hooks';
import { PageCacheContext } from './context';
import { getCurrentUrl } from 'preact-router';
import writeFileSync from './shim';

const noop = () => {};

class NullCache {
  init(data, callback = noop) {
  }

  get(cid) {
    return [undefined, false, false];
  }

  set(cid, data) {
  }
};

function useDataLoader(uri, transform) {
  let value;
  const [state, setState] = useState({
    value,
    isLoading: false,
    error: false,
  });

  async function fetchData() {
    setState({
      value: undefined,
      isLoading: true,
      error: false,
    });
    try {
      const response = await fetch(uri);
      const json = await transform(response);
      setState({
        value: json,
        isLoading: false,
        error: false,
      });
    } catch (e) {
      setState({
        value: undefined,
        isLoading: false,
        error: e,
      });
    }
  }

  if (!state.value && !state.isLoading && !state.error) {
    fetchData();
    return [state.value, true, state.error];
  }

  return [state.value, state.isLoading, state.error];
};

async function parsePreRenderData(response) {
    const text = await response.text();
    const t = text.split('<script type="text/pd" id="__PRERENDER_DATA__">', 2);

    let script = '{}';
    if (t.length > 1) {
      [script] = t[1].split('</script>', 2);
    }
    return JSON.parse(decodeURI(script)) || {};
}

class StaticCache {

  init(data, callback = noop) {
    this.callback = callback;
    this.state = {};

    const url = getCurrentUrl();
    this.state[url] = data;

    // Ensure url is matching if we get recalled on the same route.
    if (data.url != url) {
      this.state[url] = {};
    }
    this.state[url]['url'] = url;

    console.log('staticCachePlugin:init', data, this.state[url]);

    return this.state;
  }

  get(cid) {
    const url = getCurrentUrl();

    let data = undefined;
    if (typeof(this.state[url]) !== "undefined" && typeof(this.state[url][cid]) !== "undefined") {
      data = this.state[url][cid];
    }

    if (data !== undefined || typeof window === "undefined") {
      return [data, false, false];
    }

    // @todo Make configurable via node.process.env
    //const [data2, isLoading, error] = useDataLoader(url + '?prerender-data=1', (response) => response.json());
    const [data2, isLoading, error] = useDataLoader(url, parsePreRenderData);

    // Ignore any errors.
    if (isLoading) {
      return [undefined, isLoading, error];
    }

    if (data2 !== undefined && typeof(data2[cid]) !== "undefined") {
      data = data2[cid];
    }

    return [data, false, false];
  }

  set(cid, data) {
    const url = getCurrentUrl();
    this.state[url] = this.state[url] || {};
    this.state[url][cid] = data;
    if (typeof window === "undefined") {
      writeFileSync('./build-cache/' + url.replaceAll('/','_'), JSON.stringify(this.state[url]));
    }
    this.callback(this.state[url]);

    console.log('staticCachePlugin:set', cid, data, this.state);
  }
}

class ReadOnlyCache extends StaticCache {
  set(cid, data) {
  }
}

class FetchCache extends StaticCache {
  get(cid) {
    const [data, isLoading, error] = super.get(cid);
    if (data !== undefined || typeof window !== "undefined") {
      return [data, false, false];
    }

    const loader = undefined;

    this.set(cid, loader);
    return [undefined, true, false];
  }
}

const staticCachePlugin = { 'type': StaticCache };
const nullCachePlugin = { 'type': NullCache };
const readOnlyCachePlugin = { 'type': ReadOnlyCache };
const fetchCachePlugin = { 'type': FetchCache };

function useCachePlugin(name, pluginType, data, callback) {
  const cache = useMemo(() => {
    const plugin = new pluginType['type']();
    plugin.init(data, callback);

    return plugin;
  }, [name]);

  return cache;
}

function usePageCache(name, cacheId, resolveCacheMiss) {
  const pageCachePlugins = useContext(PageCacheContext);
  const pageCache = pageCachePlugins[name] || new NullCache();

  {
    const [data, isLoading, error] = pageCache.get(cacheId);

    if (error || isLoading || data !== undefined) {
      return [data, isLoading, error];
    }
  }

  const [data, isLoading, error] = resolveCacheMiss();

  if (error || isLoading) {
    return [data, isLoading, error];
  }

  pageCache.set(cacheId, data);
  return [data, false, false];
}

export { usePageCache, staticCachePlugin, nullCachePlugin, readOnlyCachePlugin, fetchCachePlugin, useCachePlugin };
