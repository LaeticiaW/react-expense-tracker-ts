module.exports = {
    /*
     * Adds category and subcategory names to expense objects in an array
     * @param {array} expenses - list of expenses
     * @param {array} categories - list of categories
     * @return {array} - the list of expenses with category name and subcategory name added to each expense that contains the cat/subcat ids
     */
    addCategoryToExpenses: (expenses, categories) => {
        // Create category and subcategory maps with key of id and value of name to make it easy to
        // add the names to the expenses
        let categoryMap = categories.reduce((map, obj) => {
            map[obj._id] = obj
            return map
        }, {})
        let subcategories = []
        categories.forEach(cat => {
            if (cat.subcategories && cat.subcategories.length) {
                subcategories.push(...cat.subcategories)
            }
        })
        let subcategoryMap = subcategories.reduce((map, obj) => {
            map[obj.id] = obj
            return map
        }, {})

        // Add the category name and subcategory name to the expense data
        expenses.forEach(exp => {
            if (exp.categoryId) {
                if (categoryMap[exp.categoryId]) {
                    exp.categoryName = categoryMap[exp.categoryId].name
                }
            }
            if (exp.subcategoryId) {
                if (subcategoryMap[exp.subcategoryId]) {
                    exp.subcategoryName = subcategoryMap[exp.subcategoryId].name
                }
            }
        })

        return expenses
    }
}
