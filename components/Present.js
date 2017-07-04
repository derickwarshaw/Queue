const currentApplication = require('../queue').currentApplication;
const currentDatabase = require('../queue').currentDatabase;
const currentQueue = require('../queue').currentQueue;

const Translation = currentApplication.component('Translation');

class Present {
    static async rooms (roomId, roomReq, roomRes) {
        const foundUsers = await currentDatabase.readClientsByRoom(roomId);

        let translatedUser;
        if (Array.isArray(foundUsers)) {
            translatedUser = await Translation.users(foundUsers);
        } else {
            translatedUser = await Translation.users([foundUsers]);
        }

        return await currentQueue.add(function () {
            const queuedRender = currentQueue.render(roomReq, roomRes);
            return queuedRender('room', {room: roomId, users: translatedUser});
        });
    }
}

module.exports = Present;