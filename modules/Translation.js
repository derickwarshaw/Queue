module.exports = dependencyInjection => {

   const Translation = (function () {


      async function translateUser (userObject) {
         const translateObject = await userObject;

         if (translateObject) {
            translateObject.userId = translateObject.UserId,
            translateObject.userNumber = translateObject.UserNumber,
            translateObject.userLocation = translateObject.userLocation;
            translateObject.userDate = translateObject.UserDate;
            translateObject.clientId = null;

            delete translateObject.UserId;
            delete translateObject.UserNumber;
            delete translateObject.UserLocation;
            delete translateObject.UserDate;
            delete translateObject.ClientId;

            return  translateObject;
         }

         return;
      }

      return {
         user: translateUser
      }

   } ());

   return Translation;

}
