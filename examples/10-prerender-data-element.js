const PreRenderData = (props) => {
  const url = getCurrentUrl();
  const content = encodeURI(JSON.stringify(props.data[url]));
  return (
    <script
      type="text/pd"
      id="__PRERENDER_DATA__"
      dangerouslySetInnerHTML={{
        __html: content
      }}
    />
  );
};
