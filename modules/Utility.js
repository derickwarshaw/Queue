module.exports = dependencyInjection => {

   const Utility = (function () {

      const utilityTo = (function () {

         function toProperCase (caseWord) {
            return caseWord.charAt(0) + caseWord.substring(1);
         }

         return {
            ProperCase: toProperCase
         };

      }());

      return {
         to: utilityTo
      }

   } ());

   return Utility;

}
