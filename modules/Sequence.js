module.exports = dependencyInjection => {

   function Sequence (sequenceQuery) {
      this.sequenceStatement = sequenceQuery;
   }

   Sequence.prototype.all = function () {
      this.sequenceStatement += " *";
   }
   Sequence.prototype.from = function (fromTable) {
      this.sequenceStatement += ` FROM ${fromTable}`;
   }
   Sequence.prototype.where = function (whereCondition) {
      if (this.sequenceStatement.match(/WHERE/g || []) > 0) {
         this.sequenceStatement += ` AND WHERE ${whereCondition};`
      } else {
         this.sequenceStatement += ` WHERE ${whereCondition}`;
      }
   }


   return Sequence;
}
