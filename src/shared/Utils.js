function requireDependency(modulePath) {
  try {
    return require(modulePath);
  } catch (e) {
    console.log(
      'requireDependency(): The file "' +
        modulePath +
        '".js could not be loaded.'
    );
    return false;
  }
}

module.exports = {
  requireDependency
};
