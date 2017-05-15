module.exports = dependencyInjection => {

   const Utility = (function () {

      const utilityTo = (function () {

         function toProperCase (caseWord) {
            return caseWord.charAt(0).toUpperCase() + caseWord.substring(1).toLowerCase();
         }

         function toImproperCase (caseWord) {
           return caseWord.charAt(1).toLowerCase() + caseWord.substring(1);
         }

         return {
            ProperCase: toProperCase,
            ImproperCase: toImproperCase
         };

      }());

      return {
         to: utilityTo
      }

   } ());

   return Utility;

}
