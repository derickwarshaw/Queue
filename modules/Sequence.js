module.exports = dependencyInjection => {

  const Utility = dependencyInjection[0];

  function Sequence (sequenceIdentifier, sequenceOperand, sequenceMarker) {
    this.sequenceSettings = {
      availableMarkers: ['?'],
      availableIdentifiers: ['SELECT', 'UPDATE', 'DELETE'],
      availableOperands: ['*', 'TOP']
    }

    // "?" - Used to Mark Input Placeholder
    if (this.sequenceSettings.availableMarkers.includes(sequenceMarker)) {
      this.sequenceMarker = sequenceMarker;
    }

    // SELECT, UPDATE, DELETE,
    if (this.sequenceSettings.availableIdentifiers.includes(sequenceIdentifier)) {
      this.sequenceIdentifier = sequenceIdentifier;
    }
  }
  Sequence.prototype.getSequence = function () {
    let sequenceParticles = [];

    for (sequenceParticle in this) {
      sequenceParticles.push(this);
    }

    return sequenceParticles.join(' ');
  }



  /* ------------- Operans --------------------------- */

  Sequence.prototpe.all = function () {
    this.sequenceOperand = "*";
    return this;
  }
  Sequence.prototype.top = function (topNumber) {
    this.sequenceOperand = `TOP (${topNumber})`;
    return this;
  }
  Sequence.prototype.only = function (onlyColumns) {
    this.sequenceOperand = onlyColumns.join(', ');
    return this;
  }
  Sequence.prototype.into = function (intoTable, intoColumns) {
    this.sequenceTable = `INTO ${intoTable}`;
    this.sequenceColumns = `(${intoColumns.join(', ')})`;
    return this;
  }




  /* -------------- Operation -------------- */

  Sequenece.prototype.from = function (fromTable) {
    this.sequenceOperation = "FROM";
    this.sequenceTable = fromTable;
  }

  // .set([[Column1, Value1], [Column2, Value2]])
  Sequence.prototype.set = function (setColumns) {
    this.sequenceOperation = "SET";
    this.sequenceSets = new Map();

    for (let i = 0; i < setColumns.length; i++) {
      this.sequenceSets.set(setColumns[i][0], setColumns[i][1]);
    }
  }



  //  Sequence.prototype.set = function (setColumn) {
  //     if (this.seuqenceStatement.includes("SET")) {
  //        this.sequenceStatement += ` ${setColumn}`;
  //     } else {
  //        this.sequenceStatement += ` SET ${setColumn}`;
  //     }
   //
  //     return this;
  //  }
   //
   //
  //  Sequence.prototype.from = function (fromTable) {
  //     this.sequenceStatement += ` FROM ${fromTable}`;
   //
  //     return this;
  //  }
  //  Sequence.prototype.values = function (valuesArrayLength) {
  //     this.sequenceStatement += ` VALUES(`;
   //
  //     for (let i = 0; i < valuesArrayLength; i++) {
  //         this.sequenceStatement += `?, `;
  //     }
   //
  //     this.sequenceStatement += `)`;
  //     this.sequenceStatement = this.sequenceStatement.replace(', )', ')');
   //
  //     return this;
  //  }
   //
  //  Sequence.prototype.where = function (whereCondition) {
  //     if (this.sequenceStatement.match(/WHERE/g || []) > 0) {
  //        this.sequenceStatement += ` AND WHERE ${whereCondition};`
  //     } else {
  //        this.sequenceStatement += ` WHERE ${whereCondition}`;
  //     }
   //
  //     return this;
  //  }
  //  Sequence.prototype.equals = function () {
  //     if (this.sequenceStatement.includes("SET")) {
  //       this.sequenceStatement += `= ?, `;
  //       this.sequenceStatement = this.sequenceStatement.replace(', )', ')');
  //     } else {
  //       this.sequenceStatement += ` = ?`;
  //     }
   //
  //     return this;
  //  }


   return Sequence;
}
