export default class Insert {
    static employee (values) {
        const valuesStringified = JSON.stringify(values)
            .replaceAll(']', ')')
            .replaceAll('[', '(')
            .replaceAll('"', '\'')
            .replaceAll('((', '(')
            .replaceAll('))', ')')
        ;
        const command = `INSERT INTO employees (first_name, last_name, email, title, department, salary, manager_id) VALUES ${valuesStringified}`;
        
        return command;
    }
    
    static department (values) {
        const valuesStringified = JSON.stringify(values)
            .replaceAll(']', ')')
            .replaceAll('[', '(')
            .replaceAll('"', '\'')
            .replaceAll('((', '(')
            .replaceAll('))', ')')
        ;
        const command = `INSERT INTO departments (name) VALUES ${valuesStringified}`;
        console.log(command)

        return command;
    }
}