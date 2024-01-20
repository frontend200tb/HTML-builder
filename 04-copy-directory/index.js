const fs = require('fs/promises');
const path = require('path');

async function getFiles(folder) {
  const files = await fs.readdir(path.join(__dirname, folder), {
    withFileTypes: true,
  });
  return files;
}

async function createDir(filePath) {
  await fs.rm(filePath, { recursive: true, force: true });
  await fs.mkdir(filePath, { recursive: true });
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
      await fs.mkdir(path.join(__dirname, dst), {
        recursive: true,
      });
      fs.copyFile(
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

copyDir('files', 'files-copy');
