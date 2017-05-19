module.exports = dependencyInjection => {

  const Utility = dependencyInjection[0];

  function Sequence (sequenceIdentifier) {
     this.sequenceSettings = {
        availableMarker: "?",
        availableIdentifiers: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
        availableOperands: ['*', 'TOP', 'INTO'],
        availableOperations: ['FROM', 'VALUES', 'SET'],
        availableFilters: ['WHERE', 'ORDER BY']
     }
     this.sequenceParticles = [];
     this.sequenceMembers = {};

     if (this.sequenceSettings.availableIdentifiers.includes(sequenceIdentifier.toUpperCase())) {
        this.sequenceParticles.push(sequenceIdentifier);
        this.sequenceMembers.memberIdentifier = sequenceIdentifier;
     } else {
       throw new Error(this.sequenceWarnings.inst);
     }
  }
  Sequence.prototype.getSequence = function () {
    if (this.validateSequence()) {
      this.sequenceResult = this.sequenceParticles.map((particlesContained) => {
        if (Array.isArray(particlesContained) && Array.isArray(particlesContained[0])) {
          return particlesContained.map((particleValue) => {
            return `${particleValue[0]} = ${particleValue[1]}`;
          }).join(', ');
        } else if (Array.isArray(particlesContained)) {
          return `(${particlesContained.join(', ')})`
        } else {
          return particlesContained;
        }
      });

      return this.sequenceResult;
    }
  }
  Sequence.prototype.buildSequence = function () {
    return this.getSequence().join(' ');
  }
  Sequence.prototype.alterSequence = function (alterBy, alterWith) {
   if (this.sequenceParticles.includes(alterBy)) {
     this.sequenceParticles[this.sequenceParticles.indexOf(alterBy)] = alterWith;
   } else {
     this.sequenceParticles.push(alterWith);
   }
  }
  Sequence.prototype.validateSequence = function () {
    const sequenceDebug = this.sequenceDebug;

     for (let sequenceMember in this.sequenceMembers) {
       if (!this.sequenceParticles.includes(this.sequenceMembers[sequenceMember])) {
         throw new Error(this.sequenceWarnings.validateSequence(sequenceMember));
       }
     }
     return true;
  }

  /* ------------- Operands (*, TOP)---------------------- */
  Sequence.prototype.all = function () {
     if (this.sequenceParticles.includes(this.sequenceSettings.availableIdentifiers[0])) {
       this.alterSequence(this.sequenceMembers.memberOperand, this.sequenceSettings.availableOperands[0]);
       this.sequenceMembers.memberOperand = this.sequenceSettings.availableOperands[0];
     }

     return this;
  }
  Sequence.prototype.top = function (topNumber) {
     if (this.sequenceParticles.includes(this.sequenceSettings.availableIdentifiers[0])) {
        this.alterSequence(this.sequenceMembers.memberOperand, this.sequenceSettings.availableOperands[1]);
        this.sequenceMembers.memberOperand = this.sequenceSettings.availableOperands[1];

        this.alterSequence(this.sequenceMembers.memberOperandValue, topNumber);
        this.sequenceMembers.memberOperandValue = topNumber;
     }

     return this;
  }
  Sequence.prototype.only = function (onlyColumns) {
     if (this.sequenceParticles.includes(this.sequenceSettings.availableIdentifiers[0])) {
        this.alterSequence(this.sequenceMembers.memberOperandValue, intoColumns);
        this.sequenceMembers.memberOperandValue = intoColumns;
     }
  }
  Sequence.prototype.into = function (intoTable, intoColumns) {
     if (this.sequenceParticles.includes(this.sequenceSettings.availableIdentifiers[1])) {
        this.alterSequence(this.sequenceMembers.memberOperand, this.sequenceSettings.availableOperands[2]);
        this.sequenceMembers.memberOperand = this.sequenceSettings.availableOperands[2];
        this.alterSequence(this.sequenceMembers.memberTable, intoTable);
        this.sequenceMembers.memberTable = intoTable;
        this.alterSequence(this.sequenceMembers.memberColumns, intoColumns);
        this.sequenceMembers.memberColumns = intoColumns;
     }

     return this;
  }
  Sequence.prototype.update = function (updateTable) {
     if (this.sequenceParticles.includes(this.sequenceSettings.availableIdentifiers[2])) {
        this.alterSequence(this.sequenceMembers.memberTable, updateTable);
        this.sequenceMembers.memberTable = updateTable;
     }

     return this;
  }

  /* -------------- Operation (FROM) -------------- */
  Sequence.prototype.from = function (fromTable) {
     if (this.sequenceParticles.includes(this.sequenceSettings.availableOperands[0])) {
        this.alterSequence(this.sequenceMembers.memberOperation, this.sequenceSettings.availableOperations[0]);
        this.sequenceMembers.memberOperation = this.sequenceSettings.availableOperations[0];

        this.alterSequence(this.sequenceMembers.memberTable, fromTable);
        this.sequenceMembers.memberTable = fromTable;
     }

     return this;
  }
  Sequence.prototype.values = function (valuesValues) {
     let valueMarkers = [];
     if (this.sequenceMembers.memberColumns) {
        for (let i = 0; i < this.sequenceMembers.memberColumns.length; i++) {
           valueMarkers.push(this.sequenceSettings.availableMarker);
        }
        this.alterSequence(this.sequenceMembers.memberOperation, this.sequenceSettings.availableOperations[1]);
        this.sequenceMembers.memberOperation = this.sequenceSettings.availableOperations[1];
        this.alterSequence(this.sequenceMembers.memberValues, valueMarkers);
        this.sequenceMembers.memberValues = valueMarkers;
     }
  }
  Sequence.prototype.set = function (setColumns) {
     if (this.sequenceParticles.includes(this.sequenceSettings.availableIdentifiers[2])) {
        this.alterSequence(this.sequenceMembers.memberOperation, this.sequenceSettings.availableOperations[2]);
        this.sequenceMembers.memberOperation = this.sequenceSettings.availableOperations[2];

        this.alterSequence(this.sequenceMembers.memberOperationValue, setColumns);
        this.sequenceMembers.memberOperationValue = setColumns;
     }

     return this;
  }

  /* -------------- Filter (WHERE, ORDER BY) -------------- */
  Sequence.prototype.where = function (whereThis) {
    const whereRequirements = this.sequenceSettings.availableIdentifiers;

     if (this.sequenceParticles.filter((sequenceParticles) => { return whereRequirements.includes(sequenceParticles); })) {
        if (this.sequenceParticles.slice(this.sequenceParticles.length - 3, this.sequenceParticles.length)
                                   .includes(this.sequenceSettings.availableFilters[0])) {
          this.alterSequence(null, `AND ${this.sequenceSettings.availableFilters[0]}`);
        } else {
          this.alterSequence(null, this.sequenceSettings.availableFilters[0]);
        }
        this.alterSequence(null, whereThis);
        if (this.sequenceDebug) {
          console.warn(this.sequenceNotices.whereNotCached);
        }
     }

     return this;
  }
  Sequence.prototype.equals = function (equalsThis) {
     this.sequenceParticles.push(`= ?`);
     return this;
  }
  Sequence.prototype.order = function (orderBy) {
     if (this.sequenceParticles.includes(this.sequenceSettings.availableFilters[0])) {
        this.alterSequence(this.sequenceMembers.memberOrder, this.sequenceSettings.availableFilters[1]);
        this.sequenceMembers.memberOrder = this.sequenceSettings.availableFilters[1];
        this.alterSequence(this.sequenceMembers.memberOrderClause, orderBy);
        this.sequenceMembers.memberOrderClause = orderBy;
     }

     return this;
  }
  Sequence.prototype.orient = function (orientBy) {
     if (this.sequenceParticles.includes(this.sequenceSettings.availableFilters[1])) {
        if (this.sequenceSettings.availableOrients.includes(orientBy)) {
           this.alterSequence(this.sequenceMembers.memberOrient, orientBy);
           this.sequenceMembers.memberOrient = orientBy;
        }
     }

     return this;
  }


  return Sequence;
}
