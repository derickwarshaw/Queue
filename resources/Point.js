class Ajax {

  /**
   Make an asynchronous call to a Web API service.
   * @param {String} ajaxType Type of request. GET, POST, etc.
   * @param {string} ajaxURL Location of the resource to request.
   */
  constructor (ajaxType, ajaxURL) {
    const ajaxTypeCheck = Boolean(typeof openType === "string");
    const ajaxURLCheck = Boolean(typeof openURL === "string");

    if (ajaxType && ajaxURL) {
      this.ajaxInstance = new XMLHttpRequest();

      this.ajaxType = ajaxType;
      this.ajaxURL = ajaxURL;
      this.ajaxResponse = {};

      this.ajaxReady = this.ajaxInstance.readyState;
      this.ajaxStatus = this.ajaxInstance.status;
      this.ajaxState = null;

      // TODO: Security needs properly implementing.
      this.ajaxSecurity = this.ajaxInstance.withCredentials;
    } else {
      throw Error("ajaxType and ajaxURL must be strings.");
    }
  }

  /**
   Open the AJAX call.
   * @param {string} openSecurity Security code for authentication.
   * @param {Array} openHeaders Headers to be sent with the request.
   * @returns {String} Response of the Ajax call.
   */
  open (openSecurity, openData) {
    const ajaxInstance = this;

    return new Promise(function (openResolve, openReject) {
      const openSecurityCheck = Boolean(typeof openSecurity === "boolean");
      const openDataCheck = Boolean(typeof openData === "object");

      if (openSecurityCheck && openDataCheck) {
        ajaxInstance.ajaxInstance.onreadystatechange = function (stateChange) {
          ajaxInstance.ajaxState = stateChange;
          ajaxInstance.ajaxReady = this.readyState;
          ajaxInstance.ajaxStatus = this.status;

          if (ajaxInstance.ajaxReady === 4 && ajaxInstance.ajaxStatus === 200) {
            ajaxInstance.ajaxResponse.responseType = this.responseType;
            ajaxInstance.ajaxResponse.responseText = this.responseText;

            try {
              openResolve(JSON.parse(ajaxInstance.ajaxResponse.responseText));
            } catch (jsonError) {
              openResolve(ajaxInstance.ajaxResponse.responseText);
            }
          }
        }
        try {
          ajaxInstance.ajaxInstance.open(ajaxInstance.ajaxType, ajaxInstance.ajaxURL, true);
        } catch (openError) {
          openReject(new Error("Invalid URL."));
        }
        ajaxInstance.ajaxInstance.send(openData);
        ajaxInstance.ajaxInstance.error = errorObject => {
          ajaxInstance.ajaxState = errorObject;
          ajaxInstance.ajaxReady = this.readyState;
          ajaxInstance.ajaxState = this.status;

          openReject(new Error("Ajax was aborted."));
        }
        ajaxInstance.ajaxInstance.abort = errorObject => {
          ajaxInstance.ajaxState = errorObject;
          ajaxInstance.ajaxReady = this.readyState;
          ajaxInstance.ajaxState = this.status;

          openReject(new Error("Ajax was aborted."));
        }
      } else {
        openReject(new Error("Invalid parameter."))
      }
    });
  }

  /**
   Validate a resource.
   @param {String} validateURL Location of resource.
   @returns {Oject} Ajax instance to make an appropriate request on.
   */
  static validate (validateType, validateURL) {
    return new Promise(function (validateResolve, validateReject) {
      const validateTypeCheck = Boolean(typeof validateType === "string");
      const validateURLCheck = Boolean(typeof validateURL === "string");

      if (validateTypeCheck && validateURLCheck) {
        const validateAjax = new XMLHttpRequest();

        validateAjax.onreadystatechange = function (stateChange) {
          validateResolve(new Ajax(validateType, validateURL));
        }
        validateAjax.open(validateType, validateURL, true);
        validateAjax.send();

        validateAjax.onerror = validateReject;
      }
    });
  }
};

class Board {
    constructor () {
        this.boardPoints = new Map();
    }
}


class Point {
    constructor (pointTarget) {
        this.pointTarget = pointTarget;
        this.pointElements = new Map();
        this.pointData = new Map();
    }
    
    get number () {
        return parseInt(this.pointData.get("LeftHeader"), 10);
    }
    
    get status () {
        return this.pointData.get("RightHeader");
    }
    
    async bind () {
        const $bindTarget = this.pointTarget;
        
        const $pointLeft = $bindTarget.children('.point-left');
        const $pointLeftHeader = $pointLeft.children('p');
        this.pointElements.set("Left", $pointLeft);
        this.pointElements.set("LeftHeader", $pointLeftHeader);
        this.pointData.set("LeftHeader", $pointLeftHeader.text());
        
        const $pointRight = $bindTarget.children('.point-right');
        const $pointRightHeader = $pointRight.children('p');
        this.pointElements.set("Right", $pointRight);
        this.pointElements.set("RightHeader", $pointRightHeader);
        this.pointData.set("RightHeader", $pointRightHeader.text());
    }

    update (updateStatus) {
      const $updateTarget = this.pointTarget;

      $updateTarget.removeClass('available away busy');
      $updateTarget.addClass(updateStatus);

      const $rightHeader = this.pointElements.get("RightHeader");

      $rightHeader.text(updateStatus);
      this.pointData.set("RightHeader", updateStatus);
    }
}










let pointAttended = new Map(), pointsUnattended = new Map();

window.pointAttended = pointAttended;
window.pointsUnattended = pointsUnattended;

// Think of this like a bind function.
$('#attended').children('.point').each(function () {
   const pointInstance = new Point($(this));
    
    pointInstance.bind().then(a => pointAttended.set(pointInstance.number, pointInstance));
});


var socket = io("http://127.0.0.1:8080");
const http = "http://localhost:8080/api";

socket.on('notif:change', function (notify) {
  "use strict";


  var notifySystem = new Ajax("GET", `${http}/system/distinctor/${notify.clientSystemDistinctor}`);
  notifySystem.open(false, {}).then(promisedSystem => {

       pointAttended.get(promisedSystem[0].systemNumber).update(notify.clientStatus);
     });
});

socket.on('notif:join', function () {
  "use strict";
  console.log("JOINED: ");

  window.location.reload();
});
socket.on('notif:leave', function () {
  "use strict";
  console.log("JOINED: ");

  window.location.reload();
});