var _ = require('lodash');

var crawl = require('./crawl');
var operations = require('./operations');
var parser = require('./parser');

crawl(function(err, transactions) {
  console.log('Got', transactions.length, 'transactions.', '\n');

  var transactions = parser.removeDuplicates(transactions);
  console.log(transactions.length +
              ' transactions left after removing duplicates.', '\n');

  parser.normalizeCompanyNames(transactions);

  var balance = operations.computeBalance(transactions);
  console.log('Total balance: ', balance, '\n');

  var categories = operations.computeCategories(transactions);
  categories.forEach(function(category) {
    var header = category.name + ": " + category.balance;
    console.log(category.name + ": " + category.balance);
    console.log(_.times(header.length, _.constant('-')).join(''));
    category.transactions.forEach(function(transaction) {
      console.log(transaction.Date, transaction.Company, transaction.Amount);
    });
    console.log();
  });

  var dailyBalances = operations.computeDailyBalances(transactions);
  console.log('Daily balances:');
  _.forIn(dailyBalances, function(balance, day) {
    console.log(day + ': ' + balance);
  });
});
