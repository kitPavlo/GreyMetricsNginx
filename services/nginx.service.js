import fs from "fs";
import { execSync } from "child_process";
import path from "path";

const __dirname = path.resolve(path.dirname(""));

class NginxCertificateService {
  constructor() {
    this.acmeShPath = "/home/bitnami/.acme.sh";
    this.configDir = "userDomains";
  }

  setSubdomains(domains) {
    const dirPath = `${__dirname}/locations.conf`;

    const locationsList = ["app.greymetrics.com", ...domains.map(i => `${i}.greymetrics.com`)];
    const locations = locationsList.join(" ");

    fs.writeFile(dirPath, `server_name ${locations} ;`, function (err) {
      if (err) throw err;
      console.log('Saved domains config!');
    });
  }

  issue(domain) {
    const path = this.createBaseConfigFile(domain);
    if (path) {
      execSync("sudo nginx -s reload");
      execSync(
        `${this.acmeShPath}/acme.sh --issue --log -d ${domain} -w /home/bitnami/webroot`
      );
      console.log(`${domain} certificate issued`);
      return true;
    } else {
      console.log(`issue - ${e.message}`);
      console.log({ error: e });
      return false;
    }
  }

  install(domain) {
    const dirPath = `${__dirname}/${this.configDir}/${domain}`;
    console.log(
      { dirPath },
      "install!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
    execSync(
      `${this.acmeShPath}/acme.sh` +
        ` --installcert --log` +
        ` -d ${domain}` +
        ` --cert-file ${dirPath}/cert.pem` +
        ` --key-file ${dirPath}/key.pem` +
        ` --fullchain-file ${dirPath}/fullchain.pem`
    );
    const path = this.createSSLConfigFile(domain);
    execSync("sudo nginx -s reload");
    if (path) {
      return true;
    } else {
      console.log("No path error");
      return false;
    }
  }

  createBaseConfigFile(domain) {
    const dirPath = `${__dirname}/${this.configDir}/${domain}/`;
    console.log(
      { dirPath },
      "createBaseConfigFile!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
    if (!fs.existsSync(dirPath)) {
      console.log("Creating the file ....");
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const path = `${dirPath}/${domain}.conf`;
    const content = this.configBaseContent(domain);

    console.log("createBaseConfigFile.writeFileSync.before");

    fs.writeFileSync(path, content);

    console.log("createBaseConfigFile.writeFileSync.after");

    return path;
  }

  createSSLConfigFile(domain) {
    const dirPath = `${__dirname}/${this.configDir}/${domain}/`;
    console.log(
      { dirPath },
      "createSSLConfigFile!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    const path = `${dirPath}/${domain}.conf`;
    const content = this.configSSLContent(domain);

    console.log("createSSLConfigFile.writeFileSync.before");

    fs.writeFileSync(path, content);

    console.log("createSSLConfigFile.writeFileSync.after");
    return path;
  }

  configBaseContent(domainName) {
    return `
    server {
      listen 80;
      listen [::]:80;

      server_name ${domainName};

      location ^~ /.well-known/acme-challenge/ {
        alias /home/bitnami/webroot/.well-known/acme-challenge/;
      }

      location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_hide_header X-Frame-Options;
        proxy_pass http://localhost:4200;
      }
    }
    `;
  }

  // ssl_certificate ~/GreyMetricsNginx/userDomains/${domainName}/fullchain.pem;
  // ssl_certificate_key ~/GreyMetricsNginx/userDomains/${domainName}/key.pem;

  configSSLContent(domainName) {
    return `
    server {
      listen 443 ssl;
      listen [::]:443;

      ssl_certificate ${__dirname}/${this.configDir}/${domainName}/fullchain.pem;
      ssl_certificate_key ${__dirname}/${this.configDir}/${domainName}/key.pem;
      ssl_session_timeout 1h;
      ssl_prefer_server_ciphers on;
      ssl_session_cache shared:SSL:5m;
      ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
      add_header Strict-Transport-Security “max-age=15768000” always;
      ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;

      server_name ${domainName};

      location ^~ /.well-known/acme-challenge/ {
        alias /home/bitnami/webroot/.well-known/acme-challenge/;
      }
      
      location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_hide_header X-Frame-Options;
        proxy_pass http://localhost:4200;
      }
    }

    server {
      listen 80;
      listen [::]:80;
      server_name ${domainName};
      return 301 https://${domainName}$request_uri;
    }
    `;
  }
}

export const nginxService = new NginxCertificateService();
