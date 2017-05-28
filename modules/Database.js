module.exports = dependencyInjection => {

   const Sequence = dependencyInjection[0];
   const Queue = new dependencyInjection[1];
   const Guid = dependencyInjection[2];
   const Utility = dependencyInjection[3];


    class Database {
        constructor(databaseServer) {
            this.databaseServer = databaseServer;
            this.userSigns = new Map();
        }

        // User operations.
        signUser (userObject) {
            userObject.userId = (Guid.create()).value;
            userObject.userName = Utility.to.ProperCase(Utility.from.UserName(userObject.userName));

            // Add to map of signed users.
            this.userSigns.set(userObject.userId, userObject);
            return userObject;
        }
        async readUser (userObject, userBy) {
            const databaseServer = this.databaseServer;
            const databaseQuery = new Sequence("SELECT")
                .all().from("User").where(`User${userBy}`).equals();

            return await Queue.add(() => {
                return databaseServer.get(databaseQuery.buildSequence(), [
                    userObject[`user${userBy}`]
                ]);
            });
        }
        async writeUser (userObject) {
            const databaseServer = this.databaseServer;
            const databaseQuery = new Sequence("INSERT")
                .into("User", ["UserId", "UserName", "UserNumber", "UserLocation", "UserDate"])
                .values("User");

            return await Queue.add(() => {
                return databaseServer.run(databaseQuery.buildSequence(), [
                    userObject.userId,
                    userObject.userName,
                    userObject.userNumber,
                    userObject.userLocation,
                    userObject.userDate
                ]);
            });
        }
        async alterUser (userObject) {
            const databaseServer = this.databaseServer;
            const databaseQuery = new Sequence("UPDATE")
                .update("User")
                .set("UserName").equals()
                .set("UserNumber").equals()
                .set("UserLocation").equals()
                .set("ClientId").equals()
                .where("UserId").equals();

            return await Queue.add(() => {
                return databaseServer.run(databaseQuery.buildSequence(), [
                    userObject.userName,
                    userObject.userNumber,
                    userObject.userLocation,
                    userObject.clientId,
                    userObject.userId
                ]);
            });
        }

        // Client operations.
        async readClient (clientId) {
            const databaseServer = this.databaseServer;
            const databaseQuery = new Sequence("SELECT")
                .all().from("Client").where("ClientId").equals();

            return await Queue.add(() => {
                return databaseServer.get(databaseQuery.buildSequence(), [
                    clientId
                ]);
            });
        }
        async writeClient (clientId) {
            const databaseServer = this.databaseServer;
            const databaseQuery = new Sequence("INSERT")
                .into("Client", ["ClientId", "ClientStatus"])
                .values("Client");

            return await Queue.add(() => {
                return databaseServer.run(databaseQuery.buildSequence(), [
                    clientId, "busy"
                ]);
            });
        }
        async alterClient (clientId, clientStatus) {
            const databaseServer = this.databaseServer;
            const databaseQuery = new Sequence("UPDATE")
                .update("Client")
                .set("ClientStatus").equals()
                .where("ClientId").equals();

            return await Queue.add(() => {
                return databaseServer.run(databaseQuery.buildSequence(), [
                    clientStatus, clientId
                ])
            })
        }
    }

   return Database;

}
