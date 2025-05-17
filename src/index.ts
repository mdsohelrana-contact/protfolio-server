import { Server } from "http";
import app from "./app";
import config from "./config";

const port = config.port;


async function main() {
    const server: Server = app.listen(port, () => {
       console.log(`🚀 Portfolio server is running at: http://localhost:${port}`);
    })
}

main()