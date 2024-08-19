import View from "./views.js";
import Insert from "./insert.js";
import Update from "./update.js";
import Delete from "./delete.js";
import { deptsFormatted, managersFormatted } from "./data.js";
import { 
    DeptPrompt,
    MngrPrompt,
    EmplPrompts,
    SelectEmplPrompt,
    EditEmplColPrompt,
} from "./prompts.js";
import pg from "pg";
import chalk from "chalk";
import inquirer from "inquirer";

const { Pool, Client } = pg;
const { prompt } = inquirer;

const pool = new Pool(
    {
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        host: 'localhost',
        database: process.env.MAIN_DB
    }
)

export default class PSQL {
    static logTable (content) {
        console.log(`\n\n`);
        console.table(content);
        console.log(`\n\n`);
    }

    static async allEmployees () {
        const command = View.employees();
        
        try {
            const { rows } = await pool.query(command);
            const rowsMapped = rows.map(row => {
                if (row.manager === null) row.manager = 'None'
                return row
            });
            
            this.logTable(rowsMapped);
        
        } catch ({ message }) {
            console.log(message);
        }
    }
    
    static async allDepartments () {
        const command = View.departments();
        
        try {
            const { rows } = await pool.query(command);
            const rowsFormatted = deptsFormatted(rows); 


            this.logTable(rowsFormatted);
        
        } catch ({ message }) {
            console.log(message);
        }
    }
    
    static async allManagers () {
        const command = View.managers();
        
        try {
            const { rows } = await pool.query(command);
            const rowsFormatted = managersFormatted(rows); 


            this.logTable(rowsFormatted);
        
        } catch ({ message }) {
            console.log(message);
        }
    }
    
    static async byDepartment (deptID) {
        const command = View.department(deptID);
        
        try {
            const { rows } = await pool.query(command);
            const rowsMapped = rows.map(row => {
                if (row.manager === null) row.manager = 'None'
                return row
            });

            this.logTable(rowsMapped);
        
        } catch ({ message }) {
            console.log(message);
        }
    }

    static async getDeptsPrompt () {
        const command = View.onlyDepts();

        try {
            const { rows } = await pool.query(command);
            const promptFormatted = new DeptPrompt(rows);

            return promptFormatted;

        } catch ({ message }) {
            console.log(message);
        }
    }
    
    static async byManager (mngrID) {
        const command = View.manager(mngrID);
        
        try {
            const { rows } = await pool.query(command);

            this.logTable(rows);
        
        } catch ({ message }) {
            console.log(message);
        }
    }

    static async getMngrsPrompt () {
        const command = View.onlyMngrs();

        try {
            const { rows } = await pool.query(command);
            const promptFormatted = new MngrPrompt(rows);

            return promptFormatted;

        } catch ({ message }) {
            console.log(message);
        }
    }
    
    static async getNewEmplPrompts () {
        const cmndDepts = View.onlyDepts();

        try {
            const { rows: deptsRows } = await pool.query(cmndDepts);
            const { prompts } = new EmplPrompts(deptsRows);

            return prompts;

        } catch ({ message }) {
            console.log(message);
        }
    }
    
    static async addEmployee ({ firstName, lastName, email, title, deptID, salary, mngrID }) {
        mngrID = mngrID === 0 ? null : mngrID;
        const command = Insert.employee([firstName, lastName, email, title, deptID, salary, mngrID]);

        try {
            await pool.query(command);
            console.log(`\n\n${chalk.italic('Employee added')}\n\n`);

        } catch ({ message }) {
            console.log(message);
        }
    }

    static async verifyEmployees () {
        const command = View.employeesLength();
        
        try {
            const { rows: [{ count }] } = await pool.query(command);
            if (count === 0) {
                console.log(chalk.red('Sorry, there are no employees yet'))
                return false
            } else return true

        } catch ({ message }) {
            console.log(message);
        }
    }

    static async verifyEmployee () {
        const selectEmplPrompt = new SelectEmplPrompt();
        
        try {
            const { id } = await prompt(selectEmplPrompt);
            const command = View.employee(id);
            const { rows } = await pool.query(command);

            if (rows.length === 0) {
                console.log(chalk.red('Sorry, there\'s no employee with that ID'))
                return await this.verifyEmployee();
            } else return id

        } catch ({ message }) {
            console.log(message);
        }
    }

    static async getEditEmployeeColPrompt (col) {
        let prompt;

        try {
            if (col === 'department') prompt = await this.getDeptsPrompt();
            else prompt = new EditEmplColPrompt(col)

            return prompt;

        } catch ({ message }) {
            console.log(message);
        }
    }
    
    static async editEmployee (empID, col, val) {
        if (val === 0) val = null
        const command = Update.employee(empID, col, val);
        console.log(command)

        try {
            await pool.query(command);

        } catch ({ message }) {
            console.log(message);
        }
    }
    
    static async deleteEmployee (empID) {
        const command = Delete.employee(empID);

        try {
            await pool.query(command);
            console.log(`\n\n${chalk.italic('Employee deleted')}\n\n`);

        } catch ({ message }) {
            console.log(message);
        }
    }

    static async verifyDepartments () {
        const command = View.departmentsLength();
        
        try {
            const { rows: [{ count }] } = await pool.query(command);
            if (count < 2) {
                console.log(chalk.red('Sorry, you need to have at least one department'))
                return false
            } else return true

        } catch ({ message }) {
            console.log(message);
        }
    }

    static async addDepartment ({ name }) {
        const command = Insert.department([name]);

        try {
            await pool.query(command);
            console.log(`\n\n${chalk.italic('Department added')}\n\n`);

        } catch ({ message }) {
            console.log(message);
        }
    }
    
    static async editDepartment ({ deptID }, { name }) {
        const command = Update.department(deptID, name);

        try {
            await pool.query(command);
            console.log(`\n\n${chalk.italic('Department edited')}\n\n`);

        } catch ({ message }) {
            console.log(message);
        }
    }

    static async deleteDepartment ({ deptID }) {
        const command = Delete.department(deptID);

        try {
            await pool.query(command);
            console.log(`\n\n${chalk.italic('Department deleted')}\n\n`);

        } catch ({ message }) {
            console.log(message);
        }
    }

    static async depsSalaries () {
        const command = View.salaries();
        
        try {
            const { rows } = await pool.query(command);
            const rowsMapped = rows.map(row => {
                row.salary_expenses = Number(row.salary_expenses);
                return row;
            })
            
            this.logTable(rowsMapped);
        
        } catch ({ message }) {
            console.log(message);
        }
    }
}