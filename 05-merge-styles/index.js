const fs = require('fs');
const path = require('path');
const srcDir = 'styles';
const dstDir = path.join(__dirname, 'project-dist', 'bundle.css');

async function getFiles(folder) {
  const files = await fs.promises.readdir(path.join(__dirname, folder), {
    withFileTypes: true,
  });
  return files;
}

async function build(srcDir, dstPath) {
  let files = await getFiles(srcDir);
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

build(srcDir, dstDir);
