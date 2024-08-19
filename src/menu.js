import inquirer from "inquirer";
import PSQL from "./utils/psql.js";
import { 
    Menu,
    EditEmplPrompt,
    AddDeptPrompt,
    EditDeptPrompt
} from "./utils/prompts.js";
import chalk from "chalk";

const { prompt } = inquirer;

const menuOptions = new Menu();

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
        const deptsPrompt = await PSQL.getDeptsPrompt();
        const confirmEmps = await PSQL.verifyEmployees();
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
                if (!confirmEmps) break;
                const editID = await PSQL.verifyEmployee();
                const editEmplPrompt = new EditEmplPrompt();
                const { cols } = await prompt(editEmplPrompt);

                for (let i = 0; i < cols.length; i++) {
                    const col = cols[i];

                    const editEmployeeColPrompt = await PSQL.getEditEmployeeColPrompt(col);
                    const res = await prompt(editEmployeeColPrompt);
                    const newVal = col === 'department' ? res.deptID : res.newVal;
                    await PSQL.editEmployee(editID, col, newVal);
                    
                    if (i === (cols.length - 1)) console.log(`\n\n${chalk.italic('Employee edited')}\n\n`)
                }
                break;
            case 'Delete employee':
                if (!confirmEmps) break;
                const delEmpID = await PSQL.verifyEmployee();
                await PSQL.deleteEmployee(delEmpID);
                break;
            case 'Add department':
                const addDeptPrompt = new AddDeptPrompt();
                const newDept = await prompt(addDeptPrompt);
                await PSQL.addDepartment(newDept);
                break;
            case 'Edit department':
                const deptIDRes = await prompt(deptsPrompt);
                const deptName = await prompt(new EditDeptPrompt());
                await PSQL.editDepartment(deptIDRes, deptName);
                break;
            case 'Delete department':
                const confirmDepts = await PSQL.verifyDepartments();
                if (!confirmDepts) break;
                const delDepID = await prompt(deptsPrompt);
                await PSQL.deleteDepartment(delDepID);
                break;
            case 'Salary expenses by department':
                await PSQL.depsSalaries();
                break;
            case 'Quit':
                return;
        }

        await continueFunc();
    
    } catch (err) { console.log(err) }
};

export default async () => {
    await menuFunc();
};