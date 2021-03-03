'use strict';
var express = require('express');
var app = express();
var express  = require('express'),
bodyParser   = require('body-parser'),
http         = require('http'),
config       = require('./config'),
server       = express(),
UniversityQuestion = require('../API/Models/UniversityQuestion');
var universityController = require('../API/Controllers/universityQController');
const dotenv = require("dotenv")
dotenv.config()

//connect
const uri = config.dbUrl;
const {MongoClient} = require('mongodb');
const client = new MongoClient(uri);

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


//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

 
app.get('/',function(req,res){
    res.send('We are happy to see you using Chat Bot Webhook');
  });

app.post('/', function(req,res){
    universitySearch(req,res);
});
  

app.listen((process.env.PORT || 3000), function () {
    console.log("Server is up and listening on port");
    
});


