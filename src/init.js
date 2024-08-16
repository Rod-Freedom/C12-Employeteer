import login from "./utils/login.js";
import figlet from "figlet";
import chalk from "chalk";

export default async () => {
    try {
        await figlet(`Employeteer |X| `, (err, logo) => {
            if (err) throw new Error(err.message)
            else return console.log(`${logo}\n`)
        });
        await login();
    } catch (err) {
        console.log(err);
    }
};