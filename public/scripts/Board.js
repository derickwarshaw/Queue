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
      const bindInstance = new Point($bindTargets.index(i));

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
    const changePath = `${this.boardAddress}/api/systems/`;

    this.boardSocket.on('notif:change', changeData => {
      changeHandler(changeData, changePath + changeData.clientSystemDistinctor);
    });
  }

  leave(leaveHandler) {
    this.boardSocket.on('notif:leave', leaveHandler);
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
    
    const $pointLeft = $bindTarget.find('.point-left');
    const $pointLeftHeader = $pointLeft.find('p');
    this.pointElements.set("Left", $pointLeft);
    this.pointElements.set("LeftHeader", $pointLeftHeader);
    this.pointData.set("LeftHeader", $pointLeftHeader.text);
    
    const $pointRight = $bindTarget.find('.point-right');
    const $pointRightHeader = $pointRight.find('p');
    this.pointElements.set("Right", $pointRight);
    this.pointElements.set("RightHeader", $pointRightHeader);
    this.pointData.set("RightHeader", $pointRightHeader.text);
  }
  
  update (updateStatus) {
    const $updateTarget = this.pointTarget;
    
    $updateTarget.removeClass(['available', 'busy', 'away']);
    $updateTarget.addClass(updateStatus);
    
    const $pointRightHeader = this.pointElements.get("RightHeader");
    
    $pointRightHeader.text = updateStatus;
    this.pointData.set("RightHeader", updateStatus);
  }
}