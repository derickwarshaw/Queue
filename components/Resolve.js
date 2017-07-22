

class Resolve {
  static collection (collectionObject) {
    if (collectionObject || collectionObject !== undefined) {
      if (Array.isArray(collectionObject)) {
        return collectionObject;
      } else {
        return [collectionObject];
      }
    }
  }
}

module.exports = Resolve;