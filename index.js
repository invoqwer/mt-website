import express from 'express';
import path from 'path';
import {websiteConfig, resumeConfig} from './config.js';

const log = console.log;
const __root = path.resolve();
const appPath = path.join(__root, 'app');
const appAssets = path.join(appPath, 'assets');
const viewPath = path.join(appPath, 'views');
const imagesPath = path.join(appPath, 'images');

const app = express();

// node index.js dev
const env = process.argv[2] === 'development' ? 'development' : 'production';
log(`===== WEBSITE ENV: ${env} =====`);
const dev = (env === 'development') ? true : false;

(async () => {
  const [wcfg, rcfg] = [await websiteConfig(), await resumeConfig()];
  log({
    websiteConfig: wcfg,
    resumeConfig: rcfg,
  });

  const websiteDistPath = path.join(__root, wcfg.distPath);
  const __resumeRoot = path.join(__root, wcfg.resumePath);
  const resumeDistPath = path.join(__resumeRoot, rcfg.distPath);
  app.use(rcfg.resumePath, express.static(resumeDistPath));

  if (dev) {
    // mt-website
    app.use(express.static(appAssets));
    app.use(express.static(imagesPath));
    app.set('view engine', 'pug');
    app.set('views', viewPath);
  } else {
    app.use(express.static(websiteDistPath));
  }

  app.listen(wcfg.port, () => {
    log(`mt-website: http://localhost:${wcfg.port}`);
  });

  // html
  app.get('/', async (req, res) => {
    if (dev) {
      res.render('layout', {
        resumePath: rcfg.resumePath,
        resumePdfPath: rcfg.resumePdfPath,
      });
    } else {
      res.sendFile(
          path.join(websiteDistPath, 'index.html'),
      );
    }
  });
})();
