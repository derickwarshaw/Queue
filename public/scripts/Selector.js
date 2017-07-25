class Selected {
  constructor (selectedElements) {
    this.selectedElements = selectedElements;
  }

  get html () {
    return this.selectedElements.innerHTML;
  }

  set html (htmlNow) {
    this.selectedElements.innerHTML = htmlNow;
  }

  // TODO: Needs JSDoc.
  set text (textSet) {
    this.selectedElements.innerText = textSet;
  }

  // TODO: Needs JSDoc.
  get text () {
    return this.selectedElements.innerText;
  }

  // TODO: Needs JSDoc.
  set source (sourceOf) {
    this.selectedElements.src = sourceOf;
  }

  // TODO: Needs JSDoc.
  get source () {
    return this.selectedElements.src;
  }

  // TODO: Needs JSDoc.
  get length () {
    return this.selectedElements.length;
  }









  // TODO: Needs JSDoc.
  query (queryName) {
    // TODO: Needs validation. Types/etc,
    if (queryName !== undefined) {
      const queryQuery = this.selectedElements.querySelectorAll(queryName);
      return new Selected(queryQuery);
    } else {
      return null;
    }
  }

  // TODO: Needs JSDoc.
  find (findName) {
    // TODO: Needs validation. Types/etc,
    if (findName !== undefined) {
      const findQuery = this.selectedElements.querySelectorAll(findName);
      return new Selected(findQuery[0]);
    } else {
      return null;
    }
  }

  target (targetId) {
    return new Selected(document.getElementById(targetId));
  }

  // TODO: Needs JSDoc.
  copy (copyValue) {
    return new Selected(copyValue);
  }


  prepend (prependThis) {
    this.html = prependThis + this.html;
    return this.html;
  }


  // TODO: Needs JSDoc.
  append (appendThis) {
    this.selectedElements.innerHTML += appendThis;
  }

  // TODO: Needs JSDoc.
  index (indexNumber) {
    // TODO: Needs validation. Types/etc,
    if ((this.selectedElements.length - 1) >= indexNumber) {
      return new Selected(this.selectedElements[indexNumber]);
    } else {
      return null;
    }
  }

  // TODO: Needs JSDoc.
  remove () {
    try {
      this.selectedElements.parentElement.removeChild(this.selectedElements);
    } catch (removeError) {
      console.log("Remove error!");
      console.log(removeError);
    }
  }

  // TODO: Needs JSDoc.
  hasClass (className) {
    return this.selectedElements.classList.contains(className);
  }

  addClass (className) {
    this.selectedElements.classList.add(className);
    return this.hasClass(className);
  }

  // TODO: Needs JSDoc.
  removeClass (className, classDelay, classCallback) {
    // TODO: Needs type checks
    const selectedInstance = this;

    if (Array.isArray(className)) {
      for (let i = 0; i < className.length; i++) {
        this.selectedElements.classList.remove(className[i]);
      }
    } else {
      this.selectedElements.classList.remove(className);
    }

    if (!classDelay && classCallback) {
      classCallback(className, selectedInstance);
    } else if (classDelay && classCallback) {
      setTimeout(timeoutEvent => {
        classCallback(className, selectedInstance)
      }, classDelay);
    }

    return this;
  }

  swapClass (className) {
    if (this.hasClass(className)) {
      this.removeClass(className);
    } else {
      this.addClass(className);
    }
  }






  click (clickHandler) {
    this.selectedElements.onclick = clickHandler;
  }
}


class Selector {

  /**
   * Validate a selection.
   * @param {Window|document|String} validateObject Object to validate.
   * @returns {Selected} Selected instance with object.
   */
  static validate (validateObject) {
    if (validateObject instanceof Object && (validateObject === window || document)) {
      return new Selected(validateObject);
    } else if (typeof validateObject === "string") {
      return new Selected(Selector.find(validateObject));
    } else {
      throw TypeError("You attempted to select an unsupported object.");
    }
  }

  /**
   * Adjust a collection.
   * @param {Array} adjusterCollection Collection to adjust.
   * @returns {Array<Element>|Element} First index of collection or collection.
   */
  static adjuster (adjusterCollection) {
    if (adjusterCollection.length && adjusterCollection.length < 2) {
      return adjusterCollection[0];
    } else {
      return adjusterCollection;
    }
  }

  /**
   * Query an element in the document.
   * @param {String} findName Name to query.
   * @returns {Array<Element>|Element} Array of or element queried.
   */
  static  find (findName) {
    const findById = document.getElementById(findName),
          findByClass = Selector.numerator(document.getElementsByClassName(findName)),
          findByTag = Selector.numerator(document.getElementsByTagName(findName)),
          findByName = Selector.numerator(document.getElementsByName(findName)),
          findByQuery = Selector.numerator(document.querySelectorAll(findName));

    if (findById) {
      return findById;
    } else if (findByClass && findByTag) {
      if (findByClass.length > findByTag.length) {
        return Selector.adjuster(findByClass);
      } else if (findByTag.length > findByClass.length) {
        return Selector.adjuster(findByTag);
      }
    } else if (findByTag && findByName) {
      if (findByTag.length > findByName.length) {
        return Selector.adjuster(findByTag);
      } else if (findByName.length > findByTag.length) {
        return Selector.adjuster(findByName);
      }
    } else if (findByName && findByQuery) {
      if (findByName.length > findByQuery.length) {
        return Selector.adjuster(findByName);
      } else if (findByQuery.length > findByName.length) {
        return Selector.adjuster(findByQuery);
      }
    } else if (findByQuery) {
      return Selector.adjuster(findByQuery);
    } else {
      throw Error(`Selector could not find '${findName}'.`);
    }
  }

  /**
   * Numerate a collection into a primitive array.
   * @param {Array|NodeList|HTMLCollection|DOMTokenList} numeratorValue Value to enumerate.
   * @returns {null|Array} Numerated array or nothing.
   */
  static numerator (numeratorValue) {
    try {
      if (!numeratorValue) {
        return null;
      } else if (numeratorValue instanceof NodeList || numeratorValue instanceof HTMLCollection || numeratorValue instanceof DOMTokenList) {
        numeratorValue = Array.from(numeratorValue);
      }

      if (Array.isArray(numeratorValue)) {
        if (!numeratorValue.length) {
          return null;
        } else {
          return numeratorValue;
        }
      } else {
        return [numeratorValue];
      }
    } catch (numeratorError) {
      // TODO: Why will this happen?
      return null;
    }
  }
}