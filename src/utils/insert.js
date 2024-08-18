export default class Insert {
    static employee (values) {
        const database = 'employees';

        const valuesStringified = JSON.stringify(values)
            .replaceAll(']', ')')
            .replaceAll('[', '(')
            .replaceAll('"', '\'')
            .replaceAll('((', '(')
            .replaceAll('))', ')')
        ;

        const columns = ['first_name', 'last_name', 'email', 'title', 'department', 'salary', 'manager_id'].join(', ');

        const command = `INSERT INTO ${database} (${columns}) VALUES ${valuesStringified}`;
        
        return command;
    }
    
    static department (values) {
        const database = 'departments';
        
        const valuesStringified = JSON.stringify(values)
            .replaceAll(']', ')')
            .replaceAll('[', '(')
            .replaceAll('"', '\'')
            .replaceAll('((', '(')
            .replaceAll('))', ')')
        ;

        const columns = 'name';

        const command = `INSERT INTO ${database} (${columns}) VALUES ${valuesStringified}`;

        return command;
    }
}