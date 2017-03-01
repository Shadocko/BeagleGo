var m = require('./motors.js');
m.init();

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

app.post('/remote', function (req, res) {
  if( !Array.isArray(req.body) ) {
    res.send('Bad request');
  }
  else {
    var left=req.body.length;
    var cb = function() {
      --left;
      if(left==0)
        res.send('OK');
    };
    for(var i=0 ; i<req.body.length ; ++i )
      m.move(i, req.body[i], cb);
  }
});

app.listen(1234, function () {
  console.log('Remote app listening on port 1234!');
});
