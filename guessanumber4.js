// HelloWorld1.js - a simple API running on Node.js and using Express
var express = require('express');					// use the express module and call it 'express'


var app = express();								// create a new express() server object called 'app'
app.use(express.urlencoded({extended: false}));     // allows us to parse (i.e., get information from) URLs 
app.use(express.json());                            // allows us to parse (i.e., get information from) JSON

var randomNumber =  []
var chances = {}


// app.use() configures the middleware server object. It is called each time a request is sent to the server.
// It contains code for general configuration of the server. 
// In this case we're setting up CORS (cross-origin resource sharing). This just means content on a web page
// can come from a domain other than the domain of that page.
app.use(function(req, res, next) {
    express.urlencoded({extended: false})
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

// app.get() instructs the application what to do when an HTTP GET request is made to the API.
// In this case, the code only runs if you use the route /sayhello (i.e., http://127.0.0.1/sayhello).
// And the code just increments the counter, sends a line of output to the console, and sends a line of 
// output to the browser.
app.post('/startGame', function(req,res){
	var randomNumberGenerated = Math.floor(Math.random() * 100) + 1;
    var gameNum = req.body.gameId;
    console.log('Creating game number. ' + gameNum + ' The number to guess is  ' + randomNumberGenerated);
    randomNumber[gameNum] = randomNumberGenerated;
    chances[gameNum] = 5; 
    var responseMessage = { APIMessage: new String('Game number ' + req.body.gameId + ' has started. You have 5 chances.') };
    res.json(responseMessage);                                                                                                                   
	});


app.get('/guessMade', function(req,res){
  var gameId = req.query.gameId;
  var numberToGuess = randomNumber[gameId];
  var numberGuessed = req.query.guessMade;
  var responseMessage = {};
  var guessed = false;
  if (chances[gameId] <= 0){
    var outMessage = "You have run out of guesses. The number to guess was " + numberToGuess + ". You lose. ";
    console.log("Game is resetting");
  } else {
    if (numberGuessed < numberToGuess) {
      chances[gameId]--;
      var outMessage = "The guess of " + numberGuessed + " is too low. Try again." + "You have " + chances[gameId] + " chances left." ; 
    } else if (numberGuessed > numberToGuess) {
      chances[gameId]--;
      var outMessage = "The guess of " + numberGuessed + " is too high. Try again. You have " + chances[gameId] + " chances left.";
    } else {
      var outMessage = " Congratulations!! You won!! The guess of " + numberGuessed + " is correct. ";
      guessed = true;
      console.log("Game is resetting");
    }
  }
    console.log("Game number " + req.query.gameId + " guessed " + numberGuessed + ' The number to guess is  ' + numberToGuess + '.');
    responseMessage = { APIMessage: outMessage, Guessed: guessed};
    res.json(responseMessage);
    });

console.log("Listening on port 8080");
app.listen(8080);									// And we're listening on port 8080