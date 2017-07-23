# Queue
Queue servers two main purposes: acting as an endpoint for all Point clients through the use of WebSocket technology, and as an endpoint for anything else through REST API. While there is no GUI, the console is used to log ass requests by a socket or a web client.

![Console](https://i.imgur.com/W9btgwv.png)

This server also provides views, one of the main uses of these views is the board view:

![Board View](https://i.imgur.com/iIoH3ga.png)

Boards are generated for a room by the server, then updated by WebSockets. Any new join or leave will cause the page to refresh for the server to regenerate.

Error pages are also handled:

![Error Pages](https://i.imgur.com/Ucw9HXp.png)




