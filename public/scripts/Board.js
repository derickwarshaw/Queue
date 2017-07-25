class Board {
  constructor(boardAddress) {
    this.boardAttended = new Map();
    this.boardUnattended = new Map();

    this.boardAddress = boardAddress;
    this.boardSocket = io(boardAddress);
    this.boardUsers = new Map();
  }

  async bind(attendedTarget) {
    const $bindTargets = attendedTarget.query('.point');

    for (let i = 0; i < $bindTargets.length; i++) {
      const bindInstance = new Point($bindTargets[i]);

      await bindInstance.bind();

      this.boardAttended.set(bindInstance.number, bindInstance);
    }
  }


  readAttended (attendingNumber) {
    return this.boardAttended.get(attendingNumber);
  }


  join(joinHandler) {
    this.boardSocket.on('notif:join', joinHandler);
  }

  change(changeHandler) {
    const changePath = `${this.boardAddress}/api/system/distinctor/`;

    this.boardSocket.on('notif:change', changeData => {
      changeHandler(changeData, changePath);
    });
  }

  leave(leaveHandler) {
    // TODO: Put the path here.

    this.boardSocket.on('notif:leave', leaveData => {
      leaveHandler(leaveData);
    });
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