const fs = require('fs');
const path = require('path');
const process = require('process');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
process.stdout.write('Добрый вечер! Введите текст, который запишется в файл\n');
process.stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    goodBye();
  }
  output.write(data);
});
process.on('SIGINT', goodBye);
function goodBye() {
  process.stdout.write('\nФайл успешно записан. Приятного вечера!');
  process.exit();
}