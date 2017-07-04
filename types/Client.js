class Client {

    /**
     * Manage a client.
     * @param clientObject
     */
    constructor (clientObject) {
        this.clientId = clientObject.ClientId;
        this.clientName = clientObject.ClientName;
        this.clientStatus = clientObject.ClientStatus;
    }
}

module.exports = Client;
