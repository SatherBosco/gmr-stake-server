import "dotenv/config";
import { App } from "./app/app";
import OldStake from "./app/contracts/OldStakeABI.json";
import { ethers } from "ethers";
import MigrateStakeController from "./app/controllers/migrateStakeController";

new App().server.listen(3333, () => console.log("Server is running! Port: 3333"));

const listenToEvents = () => {
    const NODE_URL = "https://quiet-polished-sheet.bsc.discover.quiknode.pro/8b45b0b83e386fa8eba0930f8a35897fafcce8a4/";
    const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

    const oldStakeObj = new ethers.Contract("0x26Db0a816699a87a57F6E451364C500f7E229a7E", OldStake, provider);

    oldStakeObj.on("Withdrawn", async (user, amount) => {
        console.log(`
        EVENT - EXIT
        From ${user}
        Amount ${amount}
        `);

        MigrateStakeController.migrate(user.toLowerCase());
    });
};

listenToEvents();
