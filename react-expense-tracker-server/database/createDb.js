mongo = new Mongo("localhost");
expenseTrackerDB = mongo.getDB('reactExpenseTracker');
expenseTrackerDB.categories.drop();
expenseTrackerDB.expenses.drop();
expenseTrackerDB.imports.drop();
expenseTrackerDB.createCollection("categories");
expenseTrackerDB.createCollection("expenses");
expenseTrackerDB.createCollection("imports");
expenseTrackerDB.createCollection('users');
