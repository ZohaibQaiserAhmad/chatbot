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
          client.close();
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
            client.close();
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
            client.close();
        }
      });

    
}



//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




 
app.get('/',function(req,res){});

app.post('/', function(req,res){

    main(req,res).catch(console.error);

});


app.listen((process.env.PORT), function () {
    console.log("Server is up and listening on port");
    
});


async function main(req,res){
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */

  const {MongoClient} = require('mongodb');
  const client = new MongoClient("mongodb+srv://ebizdom:VL93iD4V26A3XUJC@cluster0.th7ff.mongodb.net/store?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true });

  try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Make the appropriate DB calls
      await  universitySearch(client,req,res);

  } catch (e) {
      console.error(e);
  }
}
