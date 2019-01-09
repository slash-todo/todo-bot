const Logger = require('./Logger');

function Plugin(nameOrObject, options = {}) {
  switch (typeof nameOrObject) {
    case 'string': {
      this.name = nameOrObject;
      this.options = options;
      break;
    }

    case 'object': {
      this.name = nameOrObject.name;
      this.options = nameOrObject.options;
      break;
    }

    default:
      //throw new Error('Unsupported name or config object!');
      Logger.error(new Error('Unsupported name or config object!'));
      break;
  }
}

module.exports = Plugin;
