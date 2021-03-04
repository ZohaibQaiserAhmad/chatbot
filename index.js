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
const dialogflow = require('dialogflow');
dotenv.config()

//connect
const uri = config.SERVER_URL;
const {MongoClient} = require('mongodb');
const { exit } = require('process');
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

    let questionToSearch = req.body.queryResult.queryText;
  

    client.connect(() => {
        
    
        let result = client.db("Store").collection("University")
        .findOne({question:questionToSearch},function(err,questionExists)
      {
        if (err)
        {
          console.log(err);
          res.send({
            "fulfillmentMessages": [
              {
                "text": {
                  "text": [
                    "Issue with Bot..."
                  ]
                }
              }
            ]
          });
        }
        if (questionExists)
        {
            res.send({
                "fulfillmentMessages": [
                  {
                    "text": {
                      "text": [
                        "At " + questionExists.UniversityId + " The answer is : " + questionExists.answer
                      ]
                    }
                  }
                ]
              });
        }
        else {
          res.send({
                "fulfillmentMessages": [
                  {
                    "text": {
                      "text": [
                        "We currently do not have that question in our database...."
                      ]
                    }
                  }
                ]
              });
        }
      });


        // Make the appropriate DB calls
     

    }).catch((e) => {
        console.error(e);
        next(err);
    })
}



//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));



 
app.get('/',function(req,res){
    console.dir(req.body);
  });

app.post('/', function(req,res){
    universitySearch(req,res);
});


app.listen((process.env.PORT || 3000), function () {
    console.log("Server is up and listening on port");
    
});


