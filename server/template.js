export default function template(body, initialState) {
  return `<!DOCTYPE HTML>
<html>
<head>
  <meta charset="UTF-8" />
  <title>CINEBRAIN</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/css/bootstrap.min.css" >
<link rel="stylesheet" href="/css/react-grid-layout-styles.css" >
  <link rel="stylesheet" href="/css/react-resizable-styles.css" >
    <link rel="stylesheet" href="/css/slider.css" />
<style>
    .panel-title a {display: block; width: 100%; cursor: pointer; }
  </style>
</head>

<body>
  <div id="contents">${body}</div>    <!-- this is where our component will appear -->
  <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};</script>
  <script src="/vendor.bundle.js"></script>
  <script src="/app.bundle.js"></script>

</body>

</html>
`;
}
