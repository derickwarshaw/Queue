class Client {

    /**
     * Manage a client.
     * @param clientObject
     */
    constructor (clientObject) {
        this.clientId = clientObject.ClientId;
        this.clientName = clientObject.ClientName;
        this.clientRoom = clientObject.ClientRoom;
        this.clientHandshake = clientObject.ClientHandshake;
        this.clientStatus = clientObject.ClientStatus;
    }
}

module.exports = Client;
