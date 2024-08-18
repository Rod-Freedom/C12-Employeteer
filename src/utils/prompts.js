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
    constructor (departments, managers) {
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
            new MngrPrompt(managers),
        ];
    }
};



