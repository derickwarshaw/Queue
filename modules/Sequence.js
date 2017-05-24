module.exports = dependencyInjection => {

  const Utility = dependencyInjection[0];

  function SequenceConstructor (constructorSettings) {

     function Sequence(sequenceIdentifier, sequenceDebug) {
        this.sequenceSettings = constructorSettings;
        this.sequenceParticles = new Map();
        this.sequenceMembers = {};

        if (this.sequenceSettings.identifiers.includes(sequenceIdentifier)) {
           const identifierParticleId = Math.random().toString(36).slice(-8);

           this.sequenceParticles.set(identifierParticleId, sequenceIdentifier);
           this.sequenceMembers.memberIdentifier = identifierParticleId;
        }
     }

     // Turns the sequence into a primitive array,
     // derived from the map.
     Sequence.prototype.getSequence = function () {
        return Array.from(this.sequenceParticles.values());
     }
     Sequence.prototype.getSequenceWithKeys = function () {
        const sequenceParticles = this.sequenceParticles;

        return new Promise(function (sequenceResolve, sequenceReject) {
           let sequenceParticlesCollection = [];

           for (let [sequenceKey, sequenceValue] of sequenceParticles) {
              sequenceParticlesCollection.push(`${sequenceValue} {${sequenceKey}}`);
           }

           sequenceResolve(sequenceParticlesCollection);
        })
     }
     Sequence.prototype.buildSequence = function () {
        return this.getSequence().join(' ');
     }

     Sequence.prototype.alterSequence = function (particleName, particleValue) {
        const foundMember = this.sequenceMembers[particleName];

        if (foundMember) {
           this.sequenceParticles.set(foundMember, particleValue);
        } else {
           this.sequenceMembers[particleName] = Math.random().toString(36).slice(-8);
           this.sequenceParticles.set(this.sequenceMembers[particleName], particleValue);
        }
     }

     /* ------------- Operands ----------------- */
     Sequence.prototype.all = function () {
        if (this.getSequence().includes(this.sequenceSettings.identifiers[0])) {
           this.alterSequence("memberOperand", this.sequenceSettings.operands[0]);
        }

        return this;
     }
     Sequence.prototype.top = function (topNumber) {
        if (this.getSequence().includes(this.sequenceSettings.identifiers[0])) {
           this.alterSequence("memberOperand", `${this.sequenceSettings.operands[1]} (${topNumber})`);
        }

        return this;
     }
     Sequence.prototype.count = function (countColumn) {
        if (this.getSequence().includes(this.sequenceSettings.identifiers[0])) {
           this.alterSequence("memberOperand", `${this.sequenceSettings.operands[3]}(${countColumn})`);
        }

        return this;
     }
     Sequence.prototype.into = function (intoTable, intoColumns) {
        if (this.getSequence().includes(this.sequenceSettings.identifiers[1])) {
           this.alterSequence("memberOperand", this.sequenceSettings.operands[2]);
           this.alterSequence(`memberIntoTable_${intoTable}`, intoTable);
           this.alterSequence(`memberIntoColumns_${intoTable}`, `("${intoColumns.join('", "')}")`);
        }

        return this;
     }
     Sequence.prototype.update = function (updateTable) {
        if (this.getSequence().includes(this.sequenceSettings.identifiers[2])) {
           this.alterSequence(`memberUpdateTable_${updateTable}`, updateTable);
        }

        return this;
     }


     /* ------------- Extension ----------------- */
     Sequence.prototype.only = function (onlyColumns) {
        const sequenceParticles = this.getSequence();

        if (sequenceParticles.includes(this.sequenceSettings.identifiers[0])
        && !sequenceParticles.includes(this.sequenceSettings.operands[0])) {
           this.alterSequence("memberExtension_Only", onlyColumns.join(', '));
        }

        return this;
     }

     /* ------------- Operations ----------------- */
     Sequence.prototype.from = function (fromTable) {
        if (this.getSequence().includes(this.sequenceSettings.identifiers[0])) {
           this.alterSequence("memberOperation", this.sequenceSettings.operations[0]);
           this.alterSequence(`memberFromTable_${fromTable}`, fromTable);
        }

        return this;
     }
     Sequence.prototype.values = function (valuesTable) {
        if (this.getSequence().includes(this.sequenceSettings.identifiers[1])) {
           this.alterSequence("memberOperation", this.sequenceSettings.operations[1]);

           const foundValues = this.sequenceParticles.get(this.sequenceMembers[`memberIntoColumns_${valuesTable}`]);
           const generatedValues = foundValues.substring(1, foundValues.length - 1)
                                              .split(', ')
                                              .map(column => "?")
                                              .join(', ');

           this.alterSequence(`memberValuesValues_${valuesTable}`, `(${generatedValues})`);
        }

        return this;
     }
     Sequence.prototype.set = function (setColumns) {
        if (this.getSequence().includes(this.sequenceSettings.identifiers[2])) {
           this.alterSequence("memberOperation", this.sequenceSettings.operations[2]);

           this.alterSequence("memberSetValues", `${setColumns.join(' = ?, ')} = ?`);
        }

        return this;
     }



     /* ------------- Filters ----------------- */
     Sequence.prototype.where = function (whereThis) {
        const sequenceParticles = this.getSequence();

        if (sequenceParticles.filter(particle => this.sequenceSettings.identifiers.includes(particle))) {
           if (sequenceParticles.includes(this.sequenceSettings.filters[0])) {
              this.alterSequence(`membersWhereExtra_${whereThis}`, `AND ${this.sequenceSettings.filters[0]}`);
           } else {
              this.alterSequence(`membersWhere_${whereThis}`, this.sequenceSettings.filters[0]);
           }

           this.alterSequence(`membersWhereValue_${whereThis}`, whereThis);
        }

        return this;
     }
     Sequence.prototype.equals = function () {
        this.alterSequence(null, "= ?");

        return this;
     }
     Sequence.prototype.order = function (orderBy) {
        this.alterSequence("memberOrder", this.sequenceSettings.filters[1]);
        this.alterSequence("memberOrderClause", orderBy);

        return this;
     }
     Sequence.prototype.orient = function (orientBy) {
        if (this.getSequence().includes(this.sequenceSettings.filters[1])
        && this.sequenceSettings.orients.includes(orientBy)) {
           this.alterSequence("memberOrient", orientBy);
        }

        return this;
     }




     return Sequence;

  }

  return SequenceConstructor;
}
