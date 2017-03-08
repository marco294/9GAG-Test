var express = require('express');
var router = express.Router();

// Handle HTTP GET request by sending response of sorted id list according to user options
router.get('/load/:sortBy', function(req, res) {
  // check if the temp of sorted list exists
  req.db.exists('sortedby_'+req.params.sortBy, function(err,result){
    if(!err){

      // if the temp sorted list not exist
      if(result===0){
        // Sort the list by the user selected option and store it into a list which will expire after 300 seconds
        req.db.sort('posts', 'BY', '*->'+req.params.sortBy, 'desc', 'store', 'sortedby_'+req.params.sortBy , function (err, result) {
          if(!err){
              // set temp sorted list expire time to 300
              req.db.expire('sortedby_'+req.params.sortBy, 300);
              // return all ids from the sorted list
              req.db.lrange('sortedby_'+req.params.sortBy, 0,-1, function (err, keys) {
                if(!err){
                  res.json(keys);
                }
              });
          }
        });
      }

      // else the temp sorted list exists
      else{
        // directly return all ids from the sorted list
        req.db.lrange('sortedby_'+req.params.sortBy, 0, -1, function (err, keys) {
          if(!err){
            res.json(keys);
          }
        });
      }
    }
  });
});

// Handle HTTP POST request by sending response of all requested post details
router.post('/details', function(req, res) {
  // Return the data details according to the ids in POST data
  multiHGETALL(req.db, req.body, function (err, obj){
    if(!err){
        res.json(obj);
    }
  });
});

// Helper function to call mutiple HGETALL for each post id in "keys"
function multiHGETALL(db, keys, callback) {
    var pipeline = db.pipeline();

    keys.forEach(function(key, index){
        pipeline.hgetall(key);
    });

    pipeline.exec(function(err, result){
        callback(err, result);
    });
}

module.exports = router;
