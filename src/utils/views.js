export default class View {
    static employees () {
        const table = 'employees';
        const columns = [
            `employees.id`,
            `(employees.first_name || ' ' || employees.last_name) AS name`,
            `employees.email`,
            `employees.title`,
            `departments.name AS department`,
            `employees.salary`,
            `(managers.first_name || ' ' || managers.last_name) AS manager`
        ].join(', ');
        const joinOne = 'employees AS managers';
        const joinOneRel = 'employees.manager_id = managers.id';
        const joinTwo = 'departments';
        const joinTwoRel = 'employees.department = departments.id';
        const orderBy = 'employees.id'

        const command = `SELECT ${columns} FROM ${table} LEFT JOIN ${joinOne} ON ${joinOneRel} LEFT JOIN ${joinTwo} ON ${joinTwoRel}
        ORDER BY ${orderBy}`;

        return command;
    }
    
    static departments () {
        const table = 'departments';
        const columns = [
            `departments.name AS department`,
            `ARRAY_AGG (employees.first_name || ' ' || employees.last_name) AS employees`
        ].join(', ');
        const join = 'employees';
        const joinRel = 'employees.department = departments.id';
        const groupBy = 'departments.name';

        const command = `SELECT ${columns} FROM ${table} JOIN ${join} ON ${joinRel} GROUP BY ${groupBy}`;

        return command;
    }
    
    static managers () {
        const table = 'employees';
        const columns = [
            `(managers.first_name || ' ' || managers.last_name) AS manager`,
            `ARRAY_AGG (employees.first_name || ' ' || employees.last_name) AS employees`
        ].join(', ');
        const join = 'employees';
        const joinAlias = 'managers';
        const joinRel = 'employees.manager_id = managers.id';
        const groupBy = 'managers.id';

        const command = `SELECT ${columns} FROM ${table} JOIN ${join} AS ${joinAlias} ON ${joinRel} GROUP BY ${groupBy}`;

        return command;
    }

    static onlyDepts () {
        const table = 'departments';
        const columns = `*`;
        
        const command = `SELECT ${columns} FROM ${table}`;

        return command;
    }

    static department (deptID) {
        const table = 'employees';
        const columns = [
            `employees.id AS employee_id`,
            `(employees.first_name || ' ' || employees.last_name) AS employee`,
            `employees.email`,
            `employees.title`,
            `employees.salary`,
            `(managers.first_name || ' ' || managers.last_name) AS manager`
        ].join(', ');
        const joinOne = 'employees';
        const joinOneAlias = 'managers';
        const joinOneRel = 'employees.manager_id = managers.id';
        const joinTwo = 'departments';
        const joinTwoRel = 'employees.department = departments.id';
        const where = `employees.department = ${deptID}`;

        const command = `SELECT ${columns} FROM ${table} LEFT JOIN ${joinOne} AS ${joinOneAlias} ON ${joinOneRel} JOIN ${joinTwo} ON ${joinTwoRel} WHERE ${where}`;

        return command;
    }
    
    static onlyMngrs () {
        const table = 'employees';
        const columns = [
            `managers.id`,
            `(managers.first_name || ' ' || managers.last_name) AS name`
        ].join(', ');
        const join = 'employees';
        const joinAlias = 'managers';
        const joinRel = 'employees.manager_id = managers.id';
        
        const command = `SELECT ${columns} FROM ${table} INNER JOIN ${join} AS ${joinAlias} ON ${joinRel}`;

        return command;
    }

    static manager (mngrID) {
        const table = 'employees';
        const columns = [
            `employees.id AS employee_id`,
            `(employees.first_name || ' ' || employees.last_name) AS employee`,
            `employees.email`,
            `employees.title`,
            `employees.salary`,
            `departments.name`
        ].join(', ');
        const joinOne = 'employees';
        const joinOneAlias = 'managers';
        const joinOneRel = 'employees.manager_id = managers.id';
        const joinTwo = 'departments';
        const joinTwoRel = 'employees.department = departments.id';
        const where = `employees.manager_id = ${mngrID}`;

        const command = `SELECT ${columns} FROM ${table} LEFT JOIN ${joinOne} AS ${joinOneAlias} ON ${joinOneRel} JOIN ${joinTwo} ON ${joinTwoRel} WHERE ${where}`;

        return command;
    }
}