const fs = require('node:fs');
const path = require('node:path');

const srcStyle = 'styles';
const dstStyle = path.join(__dirname, 'project-dist', 'style.css');

async function createDir(filePath) {
  await fs.promises.rm(filePath, { recursive: true, force: true });
  await fs.promises.mkdir(filePath, { recursive: true });
}

async function getFiles(folder) {
  const files = await fs.promises.readdir(path.join(__dirname, folder), {
    withFileTypes: true,
  });
  return files;
}

async function getPathes(src, dst = src) {
  const folderFiles = await getFiles(src);
  folderFiles.forEach(async (file) => {
    if (file.isDirectory()) {
      getPathes(
        path.join(src, file.name),
        path.join(dst, file.name),
      );
    } else {
      await fs.promises.mkdir(path.join(__dirname, dst), {
        recursive: true,
      });
      fs.promises.copyFile(
        path.join(__dirname, src, file.name),
        path.join(__dirname, dst, file.name),
      );
    }
  });
}

async function copyDir(srcDir, dstDir) {
  const dstPath = path.join(__dirname, dstDir);
  await createDir(dstPath);

  getPathes(srcDir, dstDir);
}

async function buildCSSBundle(srcFolder, dstPath) {
  let files = await getFiles(srcFolder);
  files = files.filter((file) => {
    const filePath = path.join(file.path, file.name);
    const fileExt = path.extname(filePath);
    return fileExt === '.css';
  });

  const writeStream = fs.createWriteStream(dstPath);

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const filePath = path.join(file.path, file.name);
    const fileExt = path.extname(filePath);
    if (fileExt === '.css') {
      const readStream = fs.createReadStream(filePath);
      readStream.on('data', (data) => {
        writeStream.write(data.toString());
      });
    }
  }
}

async function replaceAssets() {
  let file = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf8');
  const allComponents = await getFiles('components');
  const components = allComponents.filter(
    (component) =>
      path.extname(path.join(__dirname, 'components', component.name)) ===
      '.html',
  );

  const componentContent = components.map(async (component) => {
    const componentBasename = component.name.split('.')[0];
    const componentName = `{{${componentBasename}}}`;
    return [
      componentName,
      await fs.promises.readFile(
        path.join(__dirname, 'components', component.name),
        'utf8',
      ),
    ];
  });
  const componentContents = await Promise.all(componentContent);

  componentContents.forEach((component) => {
    const [key, value] = component;
    file = file.replaceAll(key, value);
  });
  fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), file);
}

async function build() {
  const distPath = path.join(__dirname, 'project-dist');

  await createDir(distPath);
  await copyDir('assets', `project-dist${path.sep}assets`);
  await buildCSSBundle(srcStyle, dstStyle);
  replaceAssets();
}

build();
