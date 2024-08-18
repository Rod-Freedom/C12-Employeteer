import View from "./views.js";
import Insert from "./insert.js";
import { deptsFormatted, managersFormatted } from "./data.js";
import { DeptPrompt, MngrPrompt, EmplPrompts } from "./prompts.js";
import pg from "pg";
import chalk from "chalk";

const { Pool, Client } = pg;

const pool = new Pool(
    {
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        host: 'localhost',
        database: process.env.MAIN_DB
    }
)

export default class PSQL {
    static async allEmployees () {
        const command = View.employees();
        
        try {
            const { rows } = await pool.query(command);
            const rowsMapped = rows.map(row => {
                if (row.manager === null) row.manager = 'None'
                return row
            });
            
            console.log(`\n\n`);
            console.table(rowsMapped);
            console.log(`\n\n`);
        
        } catch ({ message }) {
            console.log(message);
        }
    }
    
    static async allDepartments () {
        const command = View.departments();
        
        try {
            const { rows } = await pool.query(command);
            const rowsFormatted = deptsFormatted(rows); 


            console.log(`\n\n`);
            console.table(rowsFormatted);
            console.log(`\n\n`);
        
        } catch ({ message }) {
            console.log(message);
        }
    }
    
    static async allManagers () {
        const command = View.managers();
        
        try {
            const { rows } = await pool.query(command);
            const rowsFormatted = managersFormatted(rows); 


            console.log(`\n\n`);
            console.table(rowsFormatted);
            console.log(`\n\n`);
        
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

            console.log(`\n\n`);
            console.table(rowsMapped);
            console.log(`\n\n`);
        
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

            console.log(`\n\n`);
            console.table(rows);
            console.log(`\n\n`);
        
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
        const cmndMngrs = View.onlyMngrs();

        try {
            const { rows: deptsRows } = await pool.query(cmndDepts);
            const { rows: mngrRows } = await pool.query(cmndMngrs);
            const { prompts } = new EmplPrompts(deptsRows, mngrRows);

            return prompts;

        } catch ({ message }) {
            console.log(message);
        }
    }
    
    static async addEmployee ({ firstName, lastName, email, title, deptID, salary, mngrID }) {
        const command = Insert.employee([firstName, lastName, email, title, deptID, salary, mngrID]);

        try {
            await pool.query(command);
            console.log(`\n\n${chalk.italic('Employee added')}\n\n`);

        } catch ({ message }) {
            console.log(message);
        }
    }


}