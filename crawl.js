module.exports = function(next) {
  var request = require('request');
  var async = require('async');

  var transactionsPath = "http://resttest.bench.co/transactions";

  function pageURL(idx) {
    return transactionsPath + '/' + idx + '.json';
  }

  var allTransactions = [];
  var totalCount = null;
  var currentPage = 1;

  async.whilst(
    function() {
      return totalCount === null || totalCount > allTransactions.length;
    },
    function(cbk) {
      var url = pageURL(currentPage);
      console.log('GET', url);
      request(url, function(err, response, body) {
        if (err) {
          console.error(error);
          return cbk(error);
        }

        var json = JSON.parse(body);
        totalCount = json.totalCount || 0;
        allTransactions.push.apply(allTransactions, json.transactions || []);
        currentPage++;
        cbk();
      })
    },
    function(err) {
      next(err, allTransactions);
    }
  );
};
