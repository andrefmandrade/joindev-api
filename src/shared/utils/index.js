const crypto = require('crypto');
const fs = require('fs').promises;

exports.isEmpty = function (...data) {
  return data.some((value) => value === '' || value === null || !value);
};

exports.isEmail = function (email) {
  return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(
    email
  );
};

exports.simpleHash = function (level = 3) {
  const hash = [];
  for (let i = 1; i <= level; i++)
    hash.push(Math.random().toString(36).substr(2, 9));
  return hash.join('');
};

exports.encrypt = function (text) {
  try {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from('ca386f4282b61f4203b9f6f9a7a6d907'),
      Buffer.from('9877ad96f9458a8f')
    );
    const crypted = cipher.update(text, 'utf8', 'hex');
    return crypted + cipher.final('hex');
  } catch (e) {
    return '';
  }
};

exports.decrypt = function (text) {
  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from('ca386f4282b61f4203b9f6f9a7a6d907'),
      Buffer.from('9877ad96f9458a8f')
    );
    const dec = decipher.update(text, 'hex', 'utf8');
    return dec + decipher.final('utf8');
  } catch (e) {
    return '';
  }
};

exports.diferenceBetweenDates = function (currentDate, oldDate) {
  const diff = Math.abs(currentDate.getTime() - oldDate.getTime());
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};

exports.readFileAsync = async function (path) {
  const file = await fs.readFile(path, 'utf8');
  return file;
};
