import { parseArgs } from './utils/parseArgs.js';
import { userBot } from './user_bot/index.js';
import { sequelize } from './db/index.js';


async function main() {
    const args = parseArgs(process.argv.splice(2, process.argv.length));
    if(args.sync) {
        await sequelize.sync({ force: true });
    }

    userBot.run();
}


main()
    .then(() => {
        console.log('Bot Started!');
    })
    .catch((error) => {
        console.log('error.stack :>> ', error.stack);
    })