import express from "express";
import { nginxController } from "../controllers/nginx.controller.js";

const nginxRouter = express();

nginxRouter.post("/issue", nginxController.issue);

nginxRouter.post("/install", nginxController.install);

nginxRouter.post("/createBaseConfigFile", nginxController.createBaseConfigFile);

nginxRouter.post("/createSSLConfigFile", nginxController.createSSLConfigFile);

nginxRouter.post("/configBaseContent", nginxController.configBaseContent);

nginxRouter.post("/configSSLContent", nginxController.configSSLContent);

export default nginxRouter;