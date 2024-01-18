const fs = require('fs');
const path = require('path');
fs.promises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true})
  .then(results => {
    results.forEach(result => {
      if (!result.isDirectory()) {
        const filePath = path.join(__dirname, 'secret-folder', result.name);
        const fileName = path.basename(filePath);
        const ext = path.extname(filePath);
        fs.promises
          .stat(filePath)
          .then(res => {
            console.log(`${fileName.replace(ext, '')} - ${ext.replace('.', '')} - ${Number(res.size / 1024).toFixed(3)}kb`);
          });
      }
    });
  });