/**
 * Created by admin.crowe on 19/05/2017.
 */

module.exports = dependencyInjection => {

    const Database = dependencyInjection[0];
    const Translation = dependencyInjection[1];

    const Handler = function (handlingSocket, Sockets) {
        handlingSocket.emit('user.connected');


        handlingSocket.on('user.request', requestData => {
            Sockets.listen('userRequest')([Database, Translation])(requestData)

                .then(signedUser => {
                    handlingSocket.emit('user.established', signedUser);
                })
                .catch(unsignedValue => {
                    handlingSocket.emit('user.failure');
                    Sockets.error(new Date(), `User Request for ${requestData.userName}`, unsignedValue);
                })
        });

        Sockets.disconnected(handlingSocket);

    }

    return Handler;
}