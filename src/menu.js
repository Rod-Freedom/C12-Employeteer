import inquirer from "inquirer";
import PSQL from "./utils/psql.js";

const { prompt } = inquirer;

const menuOptions = {
    type: 'list',
    message: 'Select an option employeteer!',
    choices: [
        'List all employees',
        'List all departments',
        'List all managers',
        'Employees by department',
        'Employees by manager',
        'Add employee',
        'Edit employee',
        'Delete employee',
        'Add department',
        'Edit department',
        'Delete department',
        'List salaries',
        'Quit'
    ],
    name: 'option',
    loop: false
};

const continueFunc = async () => {
    const continuePrompt = {
        type: 'list',
        message: 'Do you wanna do anything else?',
        choices: [
            { name: 'Yes', value: true },
            { name: 'Quit', value: false }
        ],
        name: 'confirm',
        loop: false
    };

    try {
        const { confirm } = await prompt(continuePrompt);
        if (confirm) {
            process.stdout.moveCursor(0, -1);
            process.stdout.clearScreenDown();
            await menuFunc();
        } else return
    }
    catch (err) { return }
};

const menuFunc = async () => {

    try {
        const { option } = await prompt(menuOptions);
        
        switch (option) {
            case 'List all employees':
                await PSQL.allEmployees();
                break;
            case 'List all departments':
                await PSQL.allDepartments();
                break;
            case 'List all managers':
                await PSQL.allManagers();
                break;
            case 'Employees by department':
                const deptsPrompt = await PSQL.getDeptsPrompt();
                const { deptID } = await prompt(deptsPrompt);
                await PSQL.byDepartment(deptID);
                break;
            case 'Employees by manager':
                const mngrsPrompt = await PSQL.getMngrsPrompt();
                const { mngrID } = await prompt(mngrsPrompt);
                await PSQL.byManager(mngrID);
                break;
            case 'Add employee':
                const newEmplPrompts = await PSQL.getNewEmplPrompts();
                const emplVals = await prompt(newEmplPrompts);
                await PSQL.addEmployee(emplVals);
                break;
            case 'Edit employee':
                break;
            case 'Delete employee':
                break;
            case 'Add department':
                break;
            case 'Edit department':
                break;
            case 'Delete department':
                break;
            case 'List salaries':
                break;
            case 'Quit':
                return;
        }

        await continueFunc();
    }
    catch (err) { return }
};

export default async () => {
    await menuFunc();
};