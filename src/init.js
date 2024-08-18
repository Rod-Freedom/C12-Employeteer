import login from "./utils/login.js";
import figlet from "figlet";
import chalk from "chalk";
import menu from "./menu.js";

export default async () => {
    try {
        figlet(`Employeteer |X| `, (err, logo) => {
            if (err) throw new Error(err.message)
            else return console.log(`${logo}\n\n\n`)
        });
        await login();
        await menu();
    } catch (err) {
        console.log(err);
    }

    process.stdout.moveCursor(0, -1);
    process.stdout.clearScreenDown();
    console.log(chalk.italic(`Thanks for using Employeteer!\n\n`));
    process.exit();
};