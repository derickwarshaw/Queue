module.exports = dependencyInjection => {

   const Config = dependencyInjection[0];

   function Sequence (sequenceQuery) {
      this.sequenceStatement = sequenceQuery;
   }

   Sequence.prototype.into = function (intoTable, intoColumns) {
      this.sequenceStatement += ` INTO ${intoTable} (`;

      for (let i = 0; i < intoColumns; i++) {
         this.sequenceStatement += `${intoColumns[i]}, `;
      }

    this.sequenceStatement = `${this.sequenceStatement.substring(0, this.sequenceStatement.lastIndexOf(", "))})`;

    return this;
   }
   Sequence.prototype.set = function (setColumn) {
      if (this.seuqenceStatement.includes("SET")) {
         this.sequenceStatement += ` ${setColumn}`;
      } else {
         this.sequenceStatement += ` SET ${setColumn}`;
      }

      return this;
   }


   Sequence.prototype.from = function (fromTable) {
      this.sequenceStatement += ` FROM ${fromTable}`;

      return this;
   }
   Sequence.prototype.values = function (valuesObject, valuesArray) {
      this.sequenceStatement += ` VALUES (`;

      for (let i = 0; i < valuesArray; i++) {
         this.sequenceStatement += ` ${valuesObject[valuesArray[i]]}, `;
      }

      this.sequenceStatement += `)`;

      return this;
   }

   Sequence.prototype.where = function (whereCondition) {
      if (this.sequenceStatement.match(/WHERE/g || []) > 0) {
         this.sequenceStatement += ` AND WHERE ${whereCondition};`
      } else {
         this.sequenceStatement += ` WHERE ${whereCondition}`;
      }

      return this;
   }
   Sequence.prototype.equals = function (equalsCondition) {
      this.sequenceStatement += ` = ${equalsCondition}`;

      return this;
   }


   return Sequence;
}
