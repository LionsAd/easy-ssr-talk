let preRenderData = props.CLI_DATA.preRenderData;

if (typeof window !== "undefined") {
  plugin = readOnlyCachePlugin;

  const inlineDataElement = document.getElementById('__PRERENDER_DATA__');

  if (inlineDataElement) {
    preRenderData = JSON.parse(decodeURI(inlineDataElement.innerHTML)) || preRenderData;
    console.log('loaded:', preRenderData);
  }
}
