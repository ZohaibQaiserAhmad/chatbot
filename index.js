'use strict';
var express = require('express');
var app = express();
var express  = require('express'),
bodyParser   = require('body-parser'),
http         = require('http'),
config       = require('./config'),
server       = express(),
dotenv = require("dotenv");
const {WebhookClient} = require('dialogflow-fulfillment');
dotenv.config()

//connect
const uri = config.SERVER_URL;
const {MongoClient} = require('mongodb');
const client = new MongoClient(uri);



const sessionIds = new Map();


const credentials = {
    client_email: config.GOOGLE_CLIENT_EMAIL,
    private_key: config.GOOGLE_PRIVATE_KEY,
};

const sessionClient = new dialogflow.SessionsClient(
	{
		projectId: config.GOOGLE_PROJECT_ID,
		credentials
	}
);


async function universitySearch(req,res){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */

    let questionToSearch = req.body.question;

    try {
        // Connect to the MongoDB cluster
        await client.connect();
      
        let answer = "At" + req.body.UniversityId + "The answer is :" + req.body.answer;
        console.log(answer);
    
        let result = await client.db("Store").collection("University")
        .findOne({question:questionToSearch},function(err,questionExists)
      {
        if (err)
        {
          console.log(err);
          return res.json({
              speech: 'Something went wrong!',
              displayText: 'Something went wrong!',
              source: 'UniversityQuestion'
          });
        }
        if (questionExists)
        {
          return res.json({
                speech: questionExists.answer,
                displayText: "At " + questionExists.UniversityId + " The answer is : " + questionExists.answer,
                source: 'UniversityQuestion'
            });
        }
        else {
          return res.json({
                speech: 'Currently I am not having information about this question',
                displayText: 'Currently I am not having information about this question',
                source: 'UniversityQuestion'
            });
        }
      });


        // Make the appropriate DB calls
     

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}


const dialogflowFulfillment = (request, response) => {
    const agent = new WebhookClient({request, response})
    console.log("here");
    function sayHello(agent){
        agent.add("Hello, this to test heroku")
    }

    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", sayHello)
    agent.handleRequest(intentHandler);

}

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));



 
app.get('/',function(req,res){
    console.dir(req.body);
    res.send('We are happy to see you using Chat Bot Webhook');
  });

app.post('/', function(req,res){
    res.send('We are happy to see you using Chat Bot Webhook');
    //dialogflowFulfillment(request, response);
});

app.post('/dialogflow-fulfillment', (request, response) => {
    dialogflowFulfillment(request, response);
})

app.listen((process.env.PORT || 3000), function () {
    console.log("Server is up and listening on port");
    
});


