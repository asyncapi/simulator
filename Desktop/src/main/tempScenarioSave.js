/* eslint-disable */
const fs = require('fs');
const path = require('path');

const cache = {};

function autoSave(filename, onSave) {
  const filepath = path.resolve(filename);

  if (filepath in cache) {
    return cache[filepath];
  }

  const object = read(filepath);
  let changed = false;
  let writing = false;

  return (cache[filepath] = wrap(object, change));

  function change() {
    if (!changed) {
      changed = true;

      if (!writing) {
        setImmediate(save);
      }
    }
  }

  function save() {
    changed = false;
    writing = true;

    const json = JSON.stringify(object, null, 2);

    if (typeof onSave === 'function') {
      fs.writeFile(filepath, json, (err) => {
        onSave(err);

        if (changed) {
          setImmediate(save);
        } else {
          writing = false;
        }
      });
    } else {
      fs.writeFileSync(filepath, json);
    }
  }
}

function wrap(o, change) {
  const innerCache = {};

  return new Proxy(o, {
    set(o, prop, v) {
      if (typeof v === 'object') {
        if (innerCache[prop] !== v) {
          change();
        }
      } else if (v !== o[prop]) {
        change();
      }

      o[prop] = v;

      if (innerCache.hasOwnProperty(prop)) {
        delete innerCache[prop];
      }

      return true;
    },
    get(o, prop) {
      if (o.hasOwnProperty(prop) && typeof o[prop] === 'object') {
        if (prop in innerCache) {
          return innerCache[prop];
        }
        return (innerCache[prop] = wrap(o[prop], change));
      }
      return o[prop];
    },
  });
}

function read(p) {
  try {
    const raw = fs.readFileSync(p);
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

module.exports = autoSave;
