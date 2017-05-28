module.exports = dependencyInjection => {

   const Utility = (function () {

      const utilityTo = (function () {

         function toProperCase (caseWord) {
            if (Array.isArray(caseWord)) {
               return caseWord.map((caseWor => {
                  return caseWor.charAt(0).toUpperCase() + caseWor.substring(1).toLowerCase();
               })).join(' ');
            } else {
                return caseWord.charAt(0).toUpperCase() + caseWord.substring(1).toLowerCase();
            }
         }

         function toImproperCase (caseWord) {
           return caseWord.charAt(0).toLowerCase() + caseWord.substring(1);
         }

         return {
            ProperCase: toProperCase,
            ImproperCase: toImproperCase
         };

      }());

      const utilityFrom = (function () {
         "use strict";

         function fromUserName (userName) {
             const filters  = [".", "-", "_"];

             for (let i = 0; i < filters.length; i++) {
                if (userName.includes(filters[i])) {
                   return userName.split(filters[i]);
                }
             }
         }

         return {
            UserName: fromUserName
         }
      } ());

      return {
         to: utilityTo,
          from: utilityFrom
      }

   } ());

   return Utility;

}
