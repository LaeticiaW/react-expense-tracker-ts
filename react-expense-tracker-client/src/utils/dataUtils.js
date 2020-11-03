export const categoriesData = [
    {
        _id: '1',
        name: 'Auto',
        subcategories: [
            { id: '101', name: 'Auto Insurance', matchText: ['Progressive'] },
            { id: '102', name: 'Auto Service', matchText: ['Ford', 'Subaru'] },
            { id: '103', name: 'Gas', matchText: ['ExxonMobil', 'Valero'] }
        ]
    },
    {
        _id: '2',
        name: 'Groceries',
        subcategories: [
            { id: '104', name: 'Costco', matchText: ['Costco'] },
            { id: '105', name: 'Food Lion', matchText: ['Food Lion'] },
            { id: '106', name: 'Harris Teeter', matchText: ['Harris Teeter', 'HarrisTeeter'] }
        ]
    },
    {
        _id: '3',
        name: 'Utilities',
        subcategories: [
            { id: '107', name: 'Electric' },
            { id: '108', name: 'Gas', matchText: ['Valero'] },
            { id: '109', name: 'Internet', matchText: ['Spectrum'] }
        ]
    }
]

export const expensesData = [
    {
        _id: 503,
        trxDate: '2020-05-01',
        trxYear: 2020,
        trxMonth: 2,
        categoryId: '2',
        categoryName: 'Groceries',
        subcategoryId: '106',
        subcategoryName: 'Harris Teeter',
        description: 'Harris Teeter',
        amount: '74.15'
    },
    {
        _id: 502,
        trxDate: '2020-04-01',
        trxYear: 2020,
        trxMonth: 2,
        categoryId: '1',
        categoryName: 'Auto',
        subcategoryId: '101',
        subcategoryName: 'Auto Insurance',
        description: 'Quick Gas',
        amount: '257.28'
    },
    {
        _id: 501,
        trxDate: '2020-03-01',
        trxYear: 2020,
        trxMonth: 2,
        categoryId: '1',
        categoryName: 'Auto',
        subcategoryId: '103',
        subcategoryName: 'Gas',
        description: 'Quick Gas',
        amount: '25.32'
    }
]

export const expenseTotalsData = [
    { _id: { categoryId: '1', subcategoryId: '10' }, categoryId: '1', subcategoryId: '10', totalAmount: 500.00, categoryName: 'Auto', subcategoryName: 'Auto Insurance' },
    { _id: { categoryId: '1', subcategoryId: '11' }, categoryId: '1', subcategoryId: '11', totalAmount: 35.50, categoryName: 'Auto', subcategoryName: 'Auto Service' },
    { _id: { categoryId: '1', subcategoryId: '5' }, categoryId: '1', subcategoryId: '5', totalAmount: 40.25, categoryName: 'Auto', subcategoryName: 'Gas' },
    { _id: { categoryId: '2', subcategoryId: '2' }, categoryId: '2', subcategoryId: '2', totalAmount: 29.00, categoryName: 'Groceries', subcategoryName: 'Harris Teeter' },
    { _id: { categoryId: '2', subcategoryId: '55' }, categoryId: '2', subcategoryId: '55', totalAmount: 51.00, categoryName: 'Groceries', subcategoryName: 'Whole Foods' },
    { _id: { categoryId: '2', subcategoryId: '56' }, categoryId: '2', subcategoryId: '56', totalAmount: 42.17, categoryName: 'Groceries', subcategoryName: 'Costco' },
    { _id: { categoryId: '3', subcategoryId: '57' }, categoryId: '3', subcategoryId: '57', totalAmount: 23.00, categoryName: 'Utilities', subcategoryName: 'Gas' },
    { _id: { categoryId: '3', subcategoryId: '58' }, categoryId: '3', subcategoryId: '58', totalAmount: 120.10, categoryName: 'Utilities', subcategoryName: 'Internet' }
]

export const expenseTotalsSummaryData = [
    {
        categoryId: '1',
        categoryName: 'Auto',
        totalAmount: 575.75,
        subcategoryTotals:  [
            { subcategoryId: '10', subcategoryName: 'Auto Insurance', totalAmount: 500 },
            { subcategoryId: '11', subcategoryName: 'Auto Service', totalAmount: 35.5 },
            { subcategoryId: '5', subcategoryName: 'Gas', totalAmount: 40.25 }
          ],    
        percent: 68.45853844141637
    },
    {
        categoryId: '2',
        categoryName: 'Groceries',
        totalAmount: 122.17,
        subcategoryTotals: [
            { subcategoryId: '2', subcategoryName: 'Harris Teeter', totalAmount: 29 },
            { subcategoryId: '55', subcategoryName: 'Whole Foods', totalAmount: 51 },
            { subcategoryId: '56', subcategoryName: 'Costco', totalAmount: 42.17 }
          ],    
        percent: 14.526408408836888
    },
    {
        categoryId: '3',
        categoryName: 'Utilities',
        totalAmount: 143.1,
        subcategoryTotals: [
            { subcategoryId: '57', subcategoryName: 'Gas', totalAmount: 23 },
            { subcategoryId: '58', subcategoryName: 'Internet', totalAmount: 120.1 }
          ],    
        percent: 17.015053149746738
    }
]


