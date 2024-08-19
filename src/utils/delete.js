export default class Delete {
    static employee (id) {
        const table = 'employees';
        const where = `id = ${id}`;

        const command = `DELETE FROM ${table} WHERE ${where}`;

        return command;
    }
    
    static department (id) {
        const table = 'departments';
        const where = `id = ${id}`;

        const command = `DELETE FROM ${table} WHERE ${where}`;

        return command;
    }
}