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
        filters: ["WHERE", "ORDER BY"],
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
   * @returns Changed sequence instance.
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
   * @returns Changed sequence instance.
   */
  top (topNumber) {
    if (this.sequenceSettings.includes(this.sequenceSettings.identifiers[0])) {
      this.alter("memberOperand", `${this.sequenceSettings.operands[1]}(${topNumber})`);
    }

    return this;
  }

  /**
   COUNT(Number) clause.
   * @param {String|Number} countColumn Column to sum.
   * @returns Changed sequence instance.
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
   * @returns Changed sequence instance.
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
   * @returns Changed sequence instance.
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
   * @returns Changed sequence instance.
   */
  only (onlyColumns) {
    if (this.sequence.includes(this.sequenceSettings.identifiers[1])) {
      this.alter("memberExtension_Only", onlyColumns.join(', '));
    }

    return this;
  }

  /**
   FROM clause.
   * @param {String} fromTable Table to select from.
   * @returns Changed sequence instance.
   */
  from (fromTable) {
    if (this.sequence.includes(this.sequenceSettings.identifiers[0])) {
      this.alter("memberOperation", this.sequenceSettings.operations[0]);
      this.alter(`memberFromTable_${fromTable}`, fromTable);
    }

    return this;
  }

  /**
   VALUES clause.
   * @param {String} valuesTable Table to generate value placeholders for.
   * @returns Changed sequence instance.
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
   * @returns Changed sequence instance.
   */
  set (setColumns) {
    if (this.sequence.includes(this.sequenceSettings.identifiers[2])) {
      this.alter("memberOperation", this.sequenceSettings.opertions[2]);
      this.alter("memberSetValues", `${setColumns.join('=  ?, ')} = ?`);
    }

    return this;
  }

  /**
   WHERE clause.
   * @param {String} whereThis Value to check.
   * @returns Changed sequence instance.
   */
  where (whereThis) {
    if (this.sequence.filter(particle => this.sequenceSettings.identifiers.includes(particle))) {
      if (this.sequence.includes(this.sequenceSettings.filters[0])) {
        this.alter(`memberWhereExtra_${whereThis}`, `AND ${this.sequenceSettings.filters[0]}`);
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
    this.alter(null, "= ?");
    return this;
  }

  /**
   ORDER BY clause.
   * @param {String} orderBy Value to order by.
   * @returns Changed sequence instance.
   */
  order (orderBy) {
    this.alter("memberOrder", this.sequenceSettings.filters[1]);
    this.alter("memberOrderClause", orderBy);

    return this;
  }

  /**
   ASC/DESC clauses.
   * @param {String} orientBy Value to order by.
   * @returns Changed sequence instance.
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