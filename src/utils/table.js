export default class Table {
    static departments () {
        const tableName = 'departments';
        const columns = [
            'id SERIAL PRIMARY KEY',
            'name VARCHAR(50) NOT NULL'
        ].join(', ');
        const uniques = 'name';
        
        const command = `CREATE TABLE ${tableName} (${columns}, UNIQUE(${uniques}))`;

        return command;
    }
    
    static employees () {
        const tableName = 'employees';
        const columns = [
            'id SERIAL PRIMARY KEY',
            'first_name VARCHAR(50) NOT NULL',
            'last_name VARCHAR(50) NOT NULL',
            'email VARCHAR(50) NOT NULL',
            'title VARCHAR(50) NOT NULL',
            'salary INTEGER',
            'department INTEGER',
            'manager_id INTEGER',
            'FOREIGN KEY (department) REFERENCES departments(id) ON DELETE SET NULL',
            'FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL'
        ].join(', ');
        const uniques = 'email';

        const command = `CREATE TABLE ${tableName} (${columns}, UNIQUE(${uniques}))`;

        return command;
    }
}