'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  mysql = require('mysql'),
  url = require('url'),
  myApp = require('./app.js'),
  app = express().use(bodyParser.json()); // creates express http server


// Sets server port and logs message on success
app.listen(3000, () => console.log('webhook is listening'));

app.get('/', (req,res)=>{
  res.send("Test");
});

app.get('/count', (req,res)=>{
  sqlpull(res);
});

app.post('/mySubmit', (req,res)=>{
  var count = 0;
  sqlpush(res, count, req.query.position, req.query.name, req.query.eday, req.query.rday);
});

function sqlpull(response2){
var connection = mysql.createConnection({
     host     : '',
     port     : '',
     user     : '',
     password : '',
     database : ''
   });

connection.connect(function(err) {
    if (err) {
      console.log(err);
      return;
    }
    connection.query('SELECT COUNT(*) FROM electiondb', function(error, results, fields){
       console.log(error);
       console.log(results[0]);
       response2.send(results[0]);
    });
  });

}

/*Block of image, HTML, CSS pages before setting up D.O. Spaces*/

app.get('/signup', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/signup.html');
});

app.get('/signupCSS', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/signupCSS.css');
});

app.get('/main', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/MainPage.HTML');
});

app.get('/donatefile', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/donateb.css');
});

app.get('/donated', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/donate.html');
});

app.get('/eshan', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/eshanI.jpg');
});

app.get('/robbie', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/robbieI.jpg');
});

app.get('/parisa', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/parisaI.jpg');
});

app.get('/lona', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/LonaI.jpg');
});

app.get('/eric', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/ericI.jpg');
});

app.get('/votingInformation', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/voterpg.html');
});

app.get('/map', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/Map.PNG');
});

app.get('/w3css', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/W3CSS.css');
});

app.get('/rewards', (req,res)=>{
  res.sendFile('/root/messenger-webhook/folders/rewards.css');
});

app.get('/freeGear', (req,res)=>{
  var x = "https://graph.facebook.com/v2.10/oauth/access_token?client_id=&redirect_uri=https://hellonara.site/freeGear&client_secret=&code=" + req.query.code;
  var y = "https://graph.facebook.com/v2.10/oauth/access_token?client_id=&client_secret=&grant_type=client_credentials"

  request(x, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    
    if(response && response.statusCode==200){
  	//dump into db
  	var body1 = body;

  	request(y, function (error, response, body) {
  	  console.log('error:', error); // Print the error if one occurred
    	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    	console.log('body:', body); // Print the HTML for the Google homepage.i

  	var z = "https://graph.facebook.com/debug_token?input_token="+body1+"&accesstoken="+body;
  	
    request(z, function (error, response, body) {
  		console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.i
  	});

	});

	//dumpSQL(body);
  }

});

res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
res.sendFile('/root/messenger-webhook/folders/rewards.HTML');
});


// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
// Gets the body of the webhook event
  let webhook_event = entry.messaging[0];
  console.log(webhook_event);


  // Get the sender PSID
  let sender_psid = webhook_event.sender.id;
  console.log('Sender PSID: ' + sender_psid);

  // Check if the event is a message or postback and
  // pass the event to the appropriate handler function
  if (webhook_event.message) {
    myApp.handleMessage(sender_psid, webhook_event.message);
  } else if (webhook_event.postback) {
   myApp.handlePostback(sender_psid, webhook_event.postback);
  }

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = ""

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
