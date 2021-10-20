import {readFile} from 'fs/promises';
import yaml from 'js-yaml';
import path from 'path';

const log = console.log;
const parseYaml = async (filePath) => {
  try {
    const f = await readFile(filePath, 'utf-8');
    return yaml.load(f);
  } catch (err) {
    log(err);
    return {};
  }
};

const __root = path.resolve();

const websiteConfigPath = path.join(__root, 'config.yaml');
// import mt-website settings from config.yaml
const websiteConfig = async () => {
  const wcfg = await parseYaml(websiteConfigPath);
  return wcfg;
};

// import mt-resume settings from mt-resume/config.yaml
const resumeConfig = async () => {
  const wcfg = await websiteConfig();
  const resumeConfigPath = path.join(__root, wcfg.resumePath, 'config.yaml');
  const rcfg = await parseYaml(resumeConfigPath);
  rcfg.resumePath = '/resume';
  rcfg.resumePdfPath = `.${rcfg.resumePath}/${rcfg.resumeOutputName}.pdf`;
  return rcfg;
};

export {
  websiteConfig as websiteConfig,
  resumeConfig as resumeConfig,
};
