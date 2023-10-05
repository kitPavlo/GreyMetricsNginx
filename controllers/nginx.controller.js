import { nginxService } from "../services/nginx.service.js";

class NginxController {
  issue(req, res) {
    try {
      const { domain } = req.body;

      const success = nginxService.issue(domain);
      res.send(success);
    } catch (e) {
      console.log(`issue - ${e.message}`);
      console.log({ error: e });
      res.status(500).send({ error: e });
    }
  }

  install(req, res) {
    try {
      const { domain } = req.body;

      const success = nginxService.install(domain);
      res.send(success);
    } catch (e) {
      console.log(`install - ${e.message}`);
      console.log({ error: e });
      res.status(500).send({ error: e });
    }
  }

  createBaseConfigFile(req, res) {
    try {
      const { domain } = req.body;

      const path = nginxService.createBaseConfigFile(domain);
      res.send(path);
    } catch (e) {
      console.log(`createBaseConfigFile - ${e.message}`);
      console.log({ error: e });
      res.status(500).send({ error: e });
    }
  }

  createSSLConfigFile(req, res) {
    try {
      const { domain } = req.body;

      const path = nginxService.createSSLConfigFile(domain);
      res.send(path);
    } catch (e) {
      console.log(`createSSLConfigFile - ${e.message}`);
      console.log({ error: e });
      res.status(500).send({ error: e });
    }
  }

  configBaseContent(req, res) {
    try {
      const { domain } = req.body;

      const url = nginxService.configBaseContent(domain);
      res.send(url);
    } catch (e) {
      console.log(`configBaseContent - ${e.message}`);
      console.log({ error: e });
      res.status(500).send({ error: e });
    }
  }

  configSSLContent(req, res) {
    try {
      const { domain } = req.body;

      const url = nginxService.configSSLContent(domain);
      res.send(url);
    } catch (e) {
      console.log(`configSSLContent - ${e.message}`);
      console.log({ error: e });
      res.status(500).send({ error: e });
    }
  }
}

export const nginxController = new NginxController();
