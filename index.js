import express from "express";
import bodyParser from "body-parser";

import nginxRouter from "./routers/nginx.router.js";

const app = express();
const port = 6500;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(nginxRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})