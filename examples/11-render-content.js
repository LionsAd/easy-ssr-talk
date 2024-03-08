async function renderContent(url, routeData) {
  const values = getPrerenderValues(url, routeData);

  // Render once
  let fetchStore = {'url': url};
  values.CLI_DATA.fetchStore = fetchStore;
  values.CLI_DATA.fetchCallback = (data) => { fetchStore = data }

  prerender({ cwd, dest, src }, values);

  // Render twice
  delete fetchStore['url'];
  let newFetchStore = {'url': url};
    
  for (cid in fetchStore) {
    const response = await fetchIt(cid);
    const json = await response.json();
    newFetchStore[cid] = json;
  }
  values.CLI_DATA.fetchStore = newFetchStore;
  return prerender({ cwd, dest, src }, values);
}

function getPrerenderValues(url, routeData) {
  const values = {
    url,
    CLI_DATA: { preRenderData: { url, ...routeData } },
  }

  return values;
}
