class Selected {
  constructor (selectedElements) {
    this.selectedElements = selectedElements;
  }

  /**
   * Set the inner HTML of the selected element.
   * @param {*} htmlNow HTML/DOM to append.
   */
  set html (htmlNow) {
    this.selectedElements.innerHTML = htmlNow;
  }

  /**
   * Get the inner HTML of the selected element.
   * @returns {String} Inner HTML as a string.
   */
  get html () {
    return this.selectedElements.innerHTML;
  }

  /**
   * Set the text of the selected element.
   * @param {String|Number} textSet Text to change to.
   */
  set text (textSet) {
    this.selectedElements.innerText = textSet;
  }

  /**
   * Get the text of the selected element.
   * @returns {string|*}
   */
  get text () {
    return this.selectedElements.innerText;
  }

  /**
   * Set the source of the selected element.
   * @param {String} sourceOf Source for an image.
   */
  set source (sourceOf) {
    this.selectedElements.src = sourceOf;
  }

  /**
   * Get the source of the element.
   * @returns {String} Source for an image.
   */
  get source () {
    return this.selectedElements.src;
  }

  /**
   * Get the length of the current selected elements.
   * @returns {Number} Size of collection.
   */
  get length () {
    return this.selectedElements.length;
  }

  /**
   * Query child elements.
   * @param {String} queryName Name to query.
   * @returns {Selected} Selected instance with queried elements.
   */
  query (queryName) {
    if (typeof queryName === "string") {
      if (queryName !== undefined) {
        const queryQuery = this.selectedElements.querySelectorAll(queryName);
        return new Selected(queryQuery);
      } else {
        return null;
      }
    } else {
      throw Error(`'${queryName}' is not a string.`);
    }
  }

  /**
   * Find a child element.
   * @param {String} findName Name to look for.
   * @returns {Selected} Selected with found element.
   */
  find (findName) {
    if (typeof findName === "string") {
      if (findName !== undefined) {
        const findQuery = this.selectedElements.querySelectorAll(findName);
        return new Selected(findQuery[0]);
      } else {
        return null;
      }
    } else {
      throw Error(`'${findName}' is not a string.`);
    }
  }

  /**
   * Find a child by element ID.
   * @param {String} targetId ID of element.
   * @returns {Selected} Selected with found element.
   */
  target (targetId) {
    return new Selected(document.getElementById(targetId));
  }

  /**
   * Directly copy an element.
   * @param {Element} copyValue Element to copy.
   * @returns {Selected} With copied element.
   */
  copy (copyValue) {
    return new Selected(copyValue);
  }

  /**
   * Prepend something to the DOM.
   * @param {String|Element} prependThis Element or stringified DOM to prepend.
   * @returns {String} Prepended elements.
   */
  prepend (prependThis) {
    this.html = prependThis + this.html;
    return this.html;
  }

  /**
   * Append something to the DOM.
   * @param {String} appendThis Element or stringified DOM to append.
   * @returns {String} Updated DOM.
   */
  append (appendThis) {
    this.selectedElements.innerHTML += appendThis;
    return this.selectedElements.innerHTML;
  }

  /**
   * Query an element in the selected element NodeList.
   * @param {Number} indexNumber Index to access.
   * @returns {Selected} Selected with element of original index.
   */
  index (indexNumber) {
    if (Array.isArray(this.selectedElements) && this.length >= indexNumber) {
      return new Selected(this.selectedElements[indexNumber]);
    } else {
      throw Error(`Index cannot be accessed.`);
    }
  }

  /**
   * Remove the selected element from the DOM.
   */
  remove () {
    try {
      this.selectedElements.parentElement.removeChild(this.selectedElements);
    } catch (removeError) {
      console.log("Remove error!");
      console.log(removeError);
    }
  }

  /**
   * Check if the selected element has a class.
   * @param {String} className Name of the class to query.
   * @returns {Boolean} Result of check.
   */
  hasClass (className) {
    return this.selectedElements.classList.contains(className);
  }

  /**
   * Add a class to the selected element.
   * @param {String} className Class to add.
   * @returns {Boolean} Whether the class was added.
   */
  addClass (className) {
    this.selectedElements.classList.add(className);
    return this.hasClass(className);
  }

  /**
   * Remove a class from the selected element.
   * @param {String} className Class to remove.
   * @param {Number} classDelay Delay before removing the clas.
   * @param {Function} classCallback Function to call afterwards.
   * @returns {Selected} Current Selected.
   */
  removeClass (className, classDelay, classCallback) {
    const classNameCheck = Boolean(typeof className === "string");
    const classDelayCheck = Boolean(typeof classDelay === "number");
    const classCallbackCheck = (classCallback instanceof function);

    if (classNameCheck && classDelayCheck && classCallbackCheck) {
      if (Array.isArray(className)) {
        for (let i = 0; i < className.length; i++) {
          this.selectedElements.classList.remove(className[i]);
        }
      } else {
        this.selectedElements.classList.remove(className);
      }
    } else {
      throw Error(`Poor arguments for .removeClass()`);
    }

    if (!classDelay && classCallback) {
      classCallback(className, this);
    } else if (classDelay && classCallback) {
      const classInstance = this;

      setTimeout(function () {
         classCallbackCheck(className, classInstance);
      }, classDelay);
    }

    return this;
  }

  /**
   * Swap a class on the selected element.
   * @param {String} className Class to swap.
   */
  swapClass (className) {
    if (this.hasClass(className)) {
      this.removeClass(className);
    } else {
      this.addClass(className);
    }
  }

  /**
   * Add a click handler.
   * @param {Function} clickHandler Function to handle the click event.
   */
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
      return null;
    }
  }
}