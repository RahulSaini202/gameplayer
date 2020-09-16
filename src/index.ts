import {Server} from './server';

let server = new Server().app;
let port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
