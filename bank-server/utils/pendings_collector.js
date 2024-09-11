import User from "../models/user.js";
const MINS = 60000;
const EXPIRY_TIME = 15;
const CYCLE_TIME = 5;

function run() {
    setInterval(async () => {
        let expiredDate = new Date(Date.now() - EXPIRY_TIME * MINS);
        await User.deleteMany({
            status: "Pending",
            createdAt: { $lt: expiredDate },
        });
    }, CYCLE_TIME * MINS);
}

export default {
    run,
};
