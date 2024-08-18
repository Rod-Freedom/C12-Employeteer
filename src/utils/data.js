export const deptsFormatted = (depsView) => {
    depsView.sort(({ employees: one }, { employees: two }) => {
        if (one.length > two.length) return -1
        else if (one.length < two.length) return 1
        return 0
    });

    const viewFormatted = [];

    for (let i = 0; i < depsView[0].employees.length; i++) {
        const rowObj = {}
        
        depsView.forEach(row => {
            const { department, employees } = row;
            if (employees[i]) rowObj[department] = employees[i]
            else rowObj[department] = '-'
        });

        viewFormatted.push(rowObj);
    }

    return viewFormatted;
};

export const managersFormatted = (mngView) => {
    mngView.sort(({ employees: one }, { employees: two }) => {
        if (one.length > two.length) return -1
        else if (one.length < two.length) return 1
        return 0
    });

    const viewFormatted = [];

    for (let i = 0; i < mngView[0].employees.length; i++) {
        const rowObj = {}
        
        mngView.forEach(row => {
            const { manager, employees } = row;
            if (employees[i]) rowObj[manager] = employees[i]
            else rowObj[manager] = '-'
        });

        viewFormatted.push(rowObj);
    }

    return viewFormatted;
};