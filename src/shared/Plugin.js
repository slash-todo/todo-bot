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
      throw new Error('Unsupported name or config object!');
  }
}

module.exports = Plugin;
