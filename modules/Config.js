module.exports = dependencyInjection => {

   const File = dependencyInjection[0];

   function Config () {
      this.configServer = {};
   }

   return Config;

}
