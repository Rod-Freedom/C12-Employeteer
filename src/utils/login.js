import { configDotenv } from "dotenv";
import { writeFileSync } from 'fs';
import { createSpinner } from 'nanospinner';
import seeds from "./seeds.js";
import inquirer from "inquirer";
import chalk from "chalk";
import pg from "pg";

const { Client } = pg;
const { prompt } = inquirer;
let client;

configDotenv();

const registerUser = (user, pass, db = 'employeteer') => {
    const path = '.env';
    const envContent = `PG_PASSWORD = '${pass}'\nPG_USER = '${user}'\nMAIN_DB = '${db}'`;

    try {
        writeFileSync(path, envContent);
    } catch (err) {
        return err
    }
};

const promptForUser = async () => {
    const userPrompt = [
        {
            type: 'input',
            message: 'What\'s your PostgreSQL username?',
            name: 'user'
        }
    ];
    
    const passPrompt = [
        {
            type: 'password',
            message: 'Type your PostgreSQL password',
            name: 'password',
            mask: true,
        },
        {
            type: 'password',
            message: 'Please confirm your password',
            name: 'passwordConfirm',
            mask: true,
        }
    ];

    const promptPassword = () => new Promise (async (res, rej) => {
        const { password, passwordConfirm } = await prompt(passPrompt);
        if (password === passwordConfirm) res(password)
        else {
            process.stdout.moveCursor(0, -2);
            process.stdout.clearScreenDown();
            
            await prompt({ message: chalk.yellow('The passwords don\'t match, please try again') });
            
            process.stdout.moveCursor(0, -1);
            process.stdout.clearScreenDown();
            
            res(promptPassword());
        }
    });
    
    console.log(chalk.italic('Welcome! You need to set your user first.'))
    const { user } = await prompt(userPrompt);
    const password = await promptPassword();
    const testDB = 'postgres';

    try {
        client = new Client(
            {
                user: user,
                password: password,
                host: 'localhost',
                database: testDB
            }
        );
        
        await client.connect();
        await client.end();

        registerUser(user, password);
        configDotenv();

    } catch ({ message }) {
        const errMsgAuth = `password authentication failed for user "${user}"`;
        const errMsgDB = `database "${testDB}" does not exist`;

        if (message === errMsgAuth) {
            console.log('Incorrect user or password, please try again.');
            await promptForUser();

        } else if (message === errMsgDB) {
            registerUser(user, password);
            configDotenv();

        } else console.log(message)
    }
};

const checkUser = async () => {
    const { PG_USER, PG_PASSWORD } = process.env;
    
    if (PG_USER && PG_PASSWORD) return
    else await promptForUser();
};

const createDB = async () => {
    await seeds();
};

const checkDefaultDB = async (defaultDB = 'postgres') => {
    const createDBquery = `CREATE DATABASE ${process.env.MAIN_DB}`
    client = new Client(
        {
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            host: 'localhost',
            database: defaultDB
        }
    );

    try {
        await client.connect();
        console.log(chalk.cyan('Wait a sec, Employeteer is doing its magic!'));
        const spinnerNewDB = createSpinner(`Creating your database...`).start();
        
        await client.query(createDBquery);
        
        spinnerNewDB.success();

        await client.end();
        await createDB();
        console.log(chalk.italic(`All set! Please restart Employeteer!\n\n`));
        process.exit();

    } catch (err) {
        const { message } = err;
        const wrongDefaultDB = `database "${defaultDB}" does not exist`;

        if (message === wrongDefaultDB) {
            const quest = {
                type: 'input',
                message: `"${defaultDB}" isn't your PostgreSQL default database. Please write your default db.`,
                name: 'defaultDBInput'
            }

            const { defaultDBInput } = await prompt(quest);
            await checkDefaultDB(defaultDBInput);
        } else console.log(err)
    }
};

export default async () => {
    try {
        await checkUser();

        client = new Client(
            {
                user: process.env.PG_USER,
                password: process.env.PG_PASSWORD,
                host: 'localhost',
                database: process.env.MAIN_DB
            }
        );

        await client.connect();
        client.end();

    } catch (err) {
        const { message } = err;
        const noEmployeteer = `database "${process.env.MAIN_DB}" does not exist`;

        if (message === noEmployeteer) await checkDefaultDB()
        else console.log(message)
    }
};