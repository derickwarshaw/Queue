/**
 * Created by admin.crowe on 19/05/2017.
 */

module.exports = dependencyInjection => {

    const Database = dependencyInjection[0];

    const Handler = function (handlingSocket, Sockets) {
        handlingSocket.emit('user.connected');


        handlingSocket.on('user.request', requestData => {
            Sockets.listen('userRequest')([Database])(requestData)
                .then(signedUser => {
                    handlingSocket.emit('user.established', signedUser);
                })
                .catch(unsignedValues => {
                    handlingSocket.emit('user.failure', unsignedValues[0]);
                    Sockets.error(new Date(), `User Request for ${requestData.userName}`, unsignedValues[1]);
                })
        });

        Sockets.disconnected(handlingSocket);

    }

    return Handler;
}