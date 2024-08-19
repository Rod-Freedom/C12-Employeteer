import pg from "pg";
import Table from "./table.js";
import Insert from "./insert.js";
import { createSpinner } from 'nanospinner';

const { Client } = pg;

const departmentsSeeds = [['Sales'], ['Engineering'], ['Finance'], ['Legal']];

const employeeSeeds = [
    ['Don', 'Trump', 'don@maga.com', 'Sales Lead', 1, 100000, null],
    ['Nico', 'Maduro', 'nico@jpm.com', 'Salesperson', 1, 80000, 1],
    ['Angela', 'Merkel', 'angela@merkelraute.com', 'Lead Engineer', 2, 150000, null],
    ['Barack', 'Obama', 'barack@yeswecan.com', 'Software Engineer', 2, 120000, 3],
    ['Emmanuel', 'Macron', 'emmanuel@avecvous.com', 'Account Manager', 3, 160000, null],
    ['Justin', 'Trudeau', 'justin@chooseforward.com', 'Accountant', 3, 125000, 5],
    ['Vlad', 'Putin', 'vlad@togetherstrong.com', 'Legal Team Lead', 4, 250000, null],
    ['Benji', 'Netan', 'benji@totalvictory.com', 'Lawyer', 4, 250000, 7],
    ['Andy', 'Obrador', 'andy@jhh.com', 'sales', 1, 85000, 1],
    ['Kam', 'Harris', 'kam@notgoingback.com', 'Data Engineer', 2, 120000, 3]
];

export default async () => {
    const depsTableQuery = Table.departments();
    const emplTableQuery = Table.employees();
    const insertDeps = Insert.department(departmentsSeeds);
    const insertEmpl = Insert.employee(employeeSeeds);

    const client = new Client(
        {
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            host: 'localhost',
            database: process.env.MAIN_DB
        }
    );

    try {
        const spinnerTables = createSpinner('Creating tables...').start();
        await client.connect();
        
        await client.query(depsTableQuery);
        await client.query(emplTableQuery);
        await client.query(insertDeps);
        await client.query(insertEmpl);
        
        spinnerTables.success();
        client.end();

    } catch (err) {
        console.log(err);
    }
};