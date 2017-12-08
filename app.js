const request = require('request');
const mysql = require('mysql');

module.exports = {
handlePostback : function(sender_psid, received_postback) {
 "use strict";
 let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'ELECTION_DAY') {
   readElectionDayMessage(sender_psid);
   // response = { "text": "Go vote" }
//callSendAPI(sender_psid, response);
  } else if (payload === 'GET_STARTED_PAYLOAD') {
    response = { "text": "Hi Robbie, Thank you very much for supporting me on my race for Mayor on Nov 6, 2018. My campaign is running a new effort to increase voter turnout where the winners get a chance to spend a day with me! If you are interested in helping, press the 'Help Us' button below for more information." }
callSendAPI(sender_psid, response);
  }
  // Send the message to acknowledge the postback
  //callSendAPI(sender_psid, response);
},
// Handles messaging_postbacks events
handleMessage : function(sender_psid, received_message) {
 "use strict";
  let response;

  // Checks if the message contains text
  if (received_message.text) {
    //readElectionDayMessage(response);
    // Creates the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": "The registration deadline is just 3 weeks away! Have you registered to vote already? In case you or your friends haven’t, here is the voter registration form for your state"
    }

  } else if (received_message.attachments) {

    // Gets the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;

  }

  // Sends the response message
  callSendAPI(sender_psid, response);
}
}

function readElectionDayMessage(sender_psid){
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
    connection.query('Select * from electiondb userdb', function(error, results, fields){
       console.log(error);
       console.log(results);
       var response = { "text": results[0].status }
       callSendAPI(sender_psid, response);
    });
  });
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {

}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  var request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": "" },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}
