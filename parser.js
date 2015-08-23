var _ = require('lodash');

module.exports = {
  // As a user, I do not want to have any duplicated transactions in the list.
  removeDuplicates: function(transactions) {
    return _.uniq(transactions, function(transaction) {
      return transaction.Date + transaction.Amount + transaction.Company;
    });
  },

  // As a user, I need vendor names to be easily readable.
  normalizeCompanyNames: function(transactions) {
    var filterOut = [
      /^x+[\d\.]+$/,
      /^#.*$/,
      /^\d+\.\d+$/,
      /^[\/\@\-\&]$/,
      /^(CA|CAD|USD)$/,
      /^\d*$/
    ];

    transactions.forEach(function(transaction) {
      transaction.Company = transaction.Company.split(' ')
        .filter(function(word) {
          return filterOut.reduce(function(prev, regex) {
            return prev && !regex.test(word);
          }, true);
        })
        .join(' ');
    });
  }
}
