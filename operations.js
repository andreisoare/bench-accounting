var _ = require('lodash');

module.exports = {
  computeBalance: function(transactions) {
    return transactions.reduce(function(prev, transaction) {
      return prev + parseFloat(transaction.Amount);
    }, 0);
  },

  // As a user, I need to get a list expense categories.
  // For each category I need a list of transactions,
  // and the total expenses for that category.
  computeCategories: function(transactions) {
    var operations = this;
    return _.chain(transactions)
      .groupBy("Ledger")
      .mapValues(function(transactions, name) {
        return {
          name: name || 'N/A',
          transactions: transactions,
          get balance() { return operations.computeBalance(this.transactions); }
        };
      })
      .values()
      .value();
  },

  // As a user, I need to calculate daily calculated balances.
  // A running total for each day.
  // For example, if I have 3 transactions for the 5th 6th 7th, each for $5,
  // then the daily balance on the 6th would be $10.
  computeDailyBalances: function(transactions) {
    // I assume all transactions are from the same month.
    var operations = this;
    var days = _.chain(transactions)
      .groupBy(function(transaction) {
        try {
          return parseInt(transaction.Date.split('-')[2]) || -1;
        } catch (e) {
          return -1;
        }
      })
      .mapValues(function(transactions, day) {
        return {
          transactions: transactions,
          get balance() { return operations.computeBalance(this.transactions); }
        };
      })
      .value();

    var dailyBalances = {};
    _.range(1,32).forEach(function(idx) {
      var currentDayBalance = (days[idx] || {}).balance || 0;
      var prevDayBalance = dailyBalances[idx - 1] || 0;
      dailyBalances[idx] = prevDayBalance + currentDayBalance;
    });
    return dailyBalances;
  }
}
