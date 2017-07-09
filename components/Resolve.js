

class Resolve {
  static collection (collectionObject) {
    if (Array.isArray(collectionObject)) {
      return collectionObject;
    } else {
      return [collectionObject];
    }
  }
}

module.exports = Resolve;