export default class Table {
    static departments () {
        const command = `CREATE TABLE departments (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, UNIQUE(name))`;

        return command;
    }
    
    static employees () {
        const command = `CREATE TABLE employees (id SERIAL PRIMARY KEY, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, title VARCHAR(50) NOT NULL, salary INTEGER, department INTEGER, manager_id INTEGER, FOREIGN KEY (department) REFERENCES departments(id) ON DELETE SET NULL, FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL, UNIQUE(email))`;

        return command;
    }
}