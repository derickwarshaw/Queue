<div style="text-align:center">
  <img src="https://i.imgur.com/i6Lkzyw.png" />
</div>

Queue is a cluster server that supports the Kioska eco-system by providing WebSockets for each Point client, a view agent for general observers, and a REST API and CDN for all applications under the Kioska namespace.

![Console](https://i.imgur.com/W9btgwv.png)

## Contributing
If you wish to contribute, feel free to make a pull request for changes or report a bug in issues. They will be reviewed given they follow use strict guidelines and are indented with two spaces.



## Developing Queue
Development on Queue can be done on Mac, Windows, or Linux as long as you have [Node 8](https://nodejs.org/en/) and [Git](https://git-scm.com/). Use any Editor you wish, I suggest WebStorm 2017 with Node.js Core (`fs`, `cluster`) enabled and JavaScript on ES6.

    # Clone the repository.
    $ git clone https://github.com/Kioska/Queue.git

    # Install / update NPM packages.
    $ npm install && npm update

    # Run the server.
    $ node queue.js
