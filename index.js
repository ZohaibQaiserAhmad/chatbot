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



async function universitySearch(client,req,res){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */

    let questionToSearch = req.body.queryResult.queryText;
    await client.db("Store").collection("University")
        .findOne({question:questionToSearch},function(err,questionExists)
      {
        if (err)
        {
          console.log(err);
          return res.send({
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
            return res.send({
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
            return res.send({
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

    
}



//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));



 
app.get('/',function(req,res){
    console.dir(req.body);
  });

app.post('/', function(req,res){

    async function main(){
        /**
         * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
         * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
         */
        const uri = "mongodb+srv://ebizdom:VL93iD4V26A3XUJC@cluster0.th7ff.mongodb.net/store?retryWrites=true&w=majority";
    
        const {MongoClient} = require('mongodb');
        const client = new MongoClient(uri);
    
        try {
            // Connect to the MongoDB cluster
            await client.connect();
    
            // Make the appropriate DB calls
            await  universitySearch(client);
    
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);

});


app.listen((process.env.PORT || 3000), function () {
    console.log("Server is up and listening on port");
    
});


