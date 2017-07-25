class Board {
    constructor () {
      this.boardAttended = new Map();
      this.boardUnattended = new Map();

      this.boardUsers = new Map();
    }

    async bind (attendedTarget) {
      $('#attended')
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
  var notifySystem = new Ajax("GET", `${http}/system/distinctor/${notify.clientSystemDistinctor}`);
  notifySystem.open(false, {}).then(promisedSystem => {

       pointAttended.get(promisedSystem.systemNumber).update(notify.clientStatus);
     });
});

socket.on('notif:join', function () {
  window.location.reload();
});
socket.on('notif:leave', function () {
  "use strict";
  console.log("JOINED: ");

  window.location.reload();
});