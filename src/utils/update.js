export default class Update {
    static employee (id, column, value) {
        console.log(typeof value)
        if (typeof value === 'string') value = `'${value}'`
        const table = 'employees';
        const set = `${column} = ${value}`;
        const where = `id = ${id}`;

        const command = `UPDATE ${table} SET ${set} WHERE ${where}`;

        return command;
    }
    
    static department (id, value) {
        const table = 'departments';
        const set = `name = '${value}'`;
        const where = `id = ${id}`;

        const command = `UPDATE ${table} SET ${set} WHERE ${where}`;

        return command;
    }
}