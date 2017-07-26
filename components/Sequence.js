class Sequence {

  /**
   Construct a sql string.
   * @param {String} sequenceIdentifier Type of clause. SELECT, UPDATE, etc.
   * @returns Sequence instrance.
   */
  constructor (sequenceIdentifier) {
    if (typeof sequenceIdentifier === "string") {
      this.sequenceSettings = {
        marker: "?",
        identifiers: ["SELECT", "INSERT", "UPDATE", "DELETE"],
        operands: ["*", "TOP", "INTO", "COUNT"],
        operations: ["FROM", "VALUES", "SET"],
        filters: ["WHERE", "ORDER BY", "NOT", "IN"],
        joins: ["INNER", "OUTER", "LEFT"],
        orients: ["ASC", "ASCENDING", "DESC", "DESCENDING"]
      };

      this.sequenceParticles = new Map();

      if (this.sequenceSettings.identifiers.includes(sequenceIdentifier)) {
        this.sequenceParticles.set("memberIdentifier", sequenceIdentifier);
      }
    }
  }

  /**
   Current sequence particles.
   * @returns Current sequence particles.
   */
  get sequence () {
    return Array.from(this.sequenceParticles.values());
  }

  /**
   *  Insert raw SQL.
   * @param {String} rawStatement Raw SQL statement.
   */
  raw (rawStatement) {
    this.sequenceParticles.set(null, rawStatement);
  }

  /**
   Alter a sequence particle.
   * @param {String} alterName Name of the particle to alter.
   * @param {*} alterValue Value of the particle.
   */
  alter (alterName, alterValue) {
    this.sequenceParticles.set(alterName, alterValue);
  }

  /**
   Build all sequence particles.
   * @returns {String} Constructed sequence.
   */
  build () {
    return this.sequence.join(' ');
  }

  /**
   * Selector
   * @returns {Sequence} Changed sequence instance.
   */
  all () {
    if (this.sequence.includes(this.sequenceSettings.identifiers[0])) {
      this.alter("memberOperand", this.sequenceSettings.operands[0]);
    }

    return this;
  }

  /**
   TOP(Number) clause.
   * @param {String|Number} topNumber Record count to select.
   * @returns {Sequence} Changed sequence instance.
   */
  top (topNumber) {
    this.alter("memberOperand", `${this.sequenceSettings.operands[1]}(${topNumber})`);

    return this;
  }

  /**
   COUNT(Number) clause.
   * @param {String|Number} countColumn Column to sum.
   * @returns {Sequence} Changed sequence instance.
   */
  count (countColumn) {
    if (this.sequence.includes(this.sequenceSettings.identifiers[0])) {
      this.alter("memberOperand", `${this.sequenceSettings.operands[3]}(${countColumn})`);
    }

    return this;
  }

  /**
   Column declaration for INSERT clause.
   * @param {String} intoTable Table to insert into.
   * @param {Array} intoColumns Columns to recognise.
   * @returns {Sequence} Changed sequence instance.
   */
  into (intoTable, intoColumns) {
    if (this.sequence.includes(this.sequenceSettings.identifiers[1])) {
      this.alter("memberOperand", this.sequenceSettings.operands[2]);
      this.alter(`memberIntoTable_${intoTable}`, intoTable);
      this.alter(`memberIntoColumns_${intoTable}`, `("${intoColumns.join('", "')}")`);
    }

    return this;
  }

  /**
   UPDATE clause.
   * @param {String} updateTable Table to update.
   * @returns {Sequence} Changed sequence instance.
   */
  update (updateTable) {
    if (this.sequence.includes(this.sequenceSettings.identifiers[2])) {
      this.alter(`memberUpdateTable_${updateTable}`, updateTable);
    }

    return this;
  }

  /**
   Column declaration for SELECT clause.
   * @param {Array} onlyColumns Columns to select.
   * @returns {Sequence} Changed sequence instance.
   */
  only (onlyColumns) {
    if (Array.isArray(onlyColumns) && !Array.isArray(onlyColumns[0])) {
      this.alter(`memberExtension_Only`, onlyColumns.join(', '));
    } else if (Array.isArray(onlyColumns) && Array.isArray(onlyColumns[0])) {
      this.alter(`memberExtensionOnly`, onlyColumns.map(onlyColumn => {
        return onlyColumn[0] ? onlyColumn.join('.') : onlyColumn[1];
      }));
    }

    return this;
  }

  /**
   FROM clause.
   * @param {String} fromTable Table to select from.
   * @returns {Sequence} Changed sequence instance.
   */
  from (fromTable) {
    if (this.sequence.includes(this.sequenceSettings.identifiers[0])
       || this.sequence.includes(this.sequenceSettings.identifiers[3])) {
      this.alter("memberOperation", this.sequenceSettings.operations[0]);
      this.alter(`memberFromTable_${fromTable}`, fromTable);
    }

    return this;
  }

  /**
   VALUES clause.
   * @param {String} valuesTable Table to generate value placeholders for.
   * @returns {Sequence} Changed sequence instance.
   */
  values (valuesTable) {
    if (this.sequence.includes(this.sequenceSettings.identifiers[1])) {
      const foundValues = this.sequenceParticles.get(`memberIntoColumns_${valuesTable}`);
      const generatedValues = foundValues.substring(1, foundValues.length - 1)
         .split(', ')
         .map(column => "?")
         .join(', ');

      this.alter("memberOperation", this.sequenceSettings.operations[1]);
      this.alter(`memberValuesValues_${valuesTable}`, `(${generatedValues})`);
    }

    return this;
  }

  /**
   SET clause.
   * @param {Array} setColumns Columns to generate a mark for.
   * @returns {Sequence} Changed sequence instance.
   */
  set (setColumns) {
    if (this.sequence.includes(this.sequenceSettings.identifiers[2])) {
      this.alter("memberOperation", this.sequenceSettings.operations[2]);
      this.alter("memberSetValues", `${setColumns.join(' = ?, ')} = ?`);
    }

    return this;
  }

  /**
   WHERE clause.
   * @param {String} whereThis Value to check.
   * @returns {Sequence} Changed sequence instance.
   */
  where (whereThis) {
    if (this.sequence.filter(particle => this.sequenceSettings.identifiers.includes(particle))) {
      if (this.sequence.includes(this.sequenceSettings.filters[0])) {
        this.alter(`memberWhereExtra_${whereThis}`, `AND`);
      } else  {
        this.alter(`membersWhere_${whereThis}`, this.sequenceSettings.filters[0]);
      }

      this.alter(`memberWhereValue_${whereThis}`, whereThis);
    }

    return this;
  }

  /**
   = clause.
   * @returns Changed sequence instance.
   */
  equals () {
    this.alter(Math.random().toString(36).substring(2, 5), "= ?");

    return this;
  }

  /**
   * JOIN clause.
   * @param {String} joinType Type of join.
   * @param {String} joinWith Table to join with.
   * @returns {Sequence} Changed sequence instance.
   */
  join (joinType, joinWith) {
    if (this.sequenceSettings.joins.includes(joinType)) {
      this.alter(`memberJoinType_${joinWith}`, `${joinType} JOIN`);
      this.alter(`memberJoinWith_${joinWith}`, joinWith);
    }

    return this;
  }

  /**
   ON clause.
   * @param {Array<Array>} onColumns Table.Column pairs for on clause.
   * @param {String} onTable Join with table ON clause relates to.
   * @returns {Sequence} Changed sequence instance.
   */
  on (onColumns, onTable) {
    if (this.sequenceParticles.get(`memberJoinWith_${onTable}`)) {
      this.alter(`memberJoinOnA_${onTable}`, `ON ${onColumns[0][0]}.${onColumns[0][1]} =`);
      this.alter(`memberJoinOnB_${onTable}`, `${onColumns[1][0]}.${onColumns[1][1]}`);
    }

    return this;
  }

  /**
   * IN clause.
   * @param {Sequence} inSequence Sequence to embed.
   * @returns {Sequence} Changed sequence instance.
   */
  isin (inSequence) {
    if (inSequence instanceof Sequence) {
      this.alter(`memberIsIn`, this.sequenceSettings.filters[3]);
      this.alter("memberIsInSequence", `(${inSequence.build()})`);
    }

    return this;
  }

  /**
   * NOT IN clause.
   * @param {Sequence} notinSequence Sequence to embed.
   * @returns {Sequence} Changed sequence instance.
   */
  notin (notinSequence) {
    if (notinSequence instanceof Sequence) {
      this.alter("memberNotIn", `${this.sequenceSettings.filters[2]} ${this.sequenceSettings.filters[3]}`);
      this.alter("memberNotInSequence", `(${notinSequence.build()})`);
    }

    return this;
  }

  /**
   ORDER BY clause.
   * @param {String} orderBy Value to order by.
   * @returns {Sequene} Changed sequence instance.
   */
  order (orderBy) {
    this.alter("memberOrder", this.sequenceSettings.filters[1]);
    this.alter("memberOrderClause", orderBy);

    return this;
  }

  /**
   ASC/DESC clauses.
   * @param {String} orientBy Value to order by.
   * @returns {Sequence} Changed sequence instance.
   */
  orient (orientBy) {
    if (this.sequence.includes(this.sequenceSettings.filters[1])
       && this.sequenceSettings.orients.includes(orientBy)) {
      this.alter("memberOrient", orientBy);
    }

    return this;
  }
}


module.exports = Sequence;