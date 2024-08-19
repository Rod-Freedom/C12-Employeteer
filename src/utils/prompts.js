class DeptOption {
    constructor ({ id, name }) {
        this.name = name;
        this.value = id;
    }
}

class MngrOption {
    constructor ({ id, name }) {
        this.name = name;
        this.value = id;
    }
}

class Prompt {
    getDeptArray (depts) {
        const optionsArr = [];

        depts.forEach(dept => optionsArr.push(new DeptOption(dept)));

        return optionsArr;
    }

    getMngrArray (mngrs) {
        const optionsArr = [];

        mngrs.forEach(mngr => optionsArr.push(new MngrOption(mngr)));

        return optionsArr;
    }
};

export class Menu {
    constructor () {
        this.type = 'list';
        this.message = 'Select an option employeteer!';
        this.choices = [
            'List all employees',
            'List all departments',
            'List all managers',
            'Employees by department',
            'Employees by manager',
            'Add employee',
            'Edit employee',
            'Delete employee',
            'Add department',
            'Edit department',
            'Delete department',
            'Salary expenses by department',
            'Quit'
        ];
        this.name = 'option';
        this.loop = false;
    }
}

export class DeptPrompt extends Prompt {
    constructor (departments) {
        super();
        this.type = 'list';
        this.message = 'Choose a department';
        this.choices = this.getDeptArray(departments);
        this.name = 'deptID';
        this.loop = false;
    }
};

export class MngrPrompt extends Prompt {
    constructor (managers) {
        super();
        this.type = 'list';
        this.message = 'Choose a manager';
        this.choices = this.getMngrArray(managers);
        this.name = 'mngrID';
        this.loop = false;
    }
};

export class EmplPrompts {
    constructor (departments) {
        this.prompts = [
            {
                type: 'input',
                message: 'Employee\'s first name',
                name: 'firstName'
            },
            {
                type: 'input',
                message: 'Employee\'s last name',
                name: 'lastName'
            },
            {
                type: 'input',
                message: 'Employee\'s email',
                name: 'email'
            },
            {
                type: 'input',
                message: 'Employee\'s role title (Eg. Account Manager)',
                name: 'title'
            },
            new DeptPrompt(departments),
            {
                type: 'input',
                message: 'Employee\'s annual salary',
                name: 'salary'
            },
            {
                type: 'number',
                message: 'If you want to assign a manager, type their employee ID, if not, type 0',
                name: 'mngrID'
            },
        ];
    }
};

export class SelectEmplPrompt {
    constructor () {
        this.type = 'number';
        this.message = 'Write the ID of the employee';
        this.name = 'id';
    }
}

export class EditEmplPrompt {
    constructor () {
        this.type = 'checkbox';
        this.message = 'Select the field you want to edit';
        this.choices = [
            { name: 'First name', value: 'first_name' },
            { name: 'Last name', value: 'last_name' },
            { name: 'Email', value: 'email' },
            { name: 'Job title', value: 'title' },
            { name: 'Department', value: 'department' },
            { name: 'Salary', value: 'salary' },
            { name: 'Manager', value: 'manager_id' },
        ];
        this.name = 'cols';
        this.loop = false;
    }
}

export class EditEmplColPrompt {
    constructor (col) {
        this.type = this.setType(col);
        this.message = this.setText(col);
        this.name = 'newVal';
    }

    setType (col) {
        switch (col) {
            case 'first_name':
            case 'last_name':
            case 'email':
            case 'title':
                return 'input';
            case 'salary':
            case 'manager_id':
                return 'number';
        }
    }
    
    setText (col) {
        switch (col) {
            case 'first_name':
                return 'Please type employee\'s first name';
            case 'last_name':
                return 'Please type employee\'s last name';
            case 'email':
                return 'Please type employee\'s email';
            case 'title':
                return 'Please type employee\'s new title';
            case 'salary':
                return 'Please type employee\'s new salary';
            case 'manager_id':
                return 'If you want to assign a manager, type their employee ID, if not, type 0';
        }
    }
}

export class AddDeptPrompt {
    constructor () {
        this.type = 'input';
        this.message = 'Write the name for the new department';
        this.name = 'name';
    }
};

export class EditDeptPrompt {
    constructor () {
        this.type = 'input';
        this.message = 'Write the new name for the department';
        this.name = 'name';
    }
};

