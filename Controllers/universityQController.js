'use strict';
var mongoose = require('mongoose');
var UniversityQuestion = mongoose.model('UniversityQuestion');


function getUniversityQuestion(req,res)
{
 

    let questionToSearch = req.body.question[0];
    console.log(UniversityQuestion);
    console.log(questionToSearch);

    UniversityQuestion.findOne({question:questionToSearch},function(err)
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
                displayText: questionExists.answer,
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
}




exports.processRequest = function(req, res) {
        getUniversityQuestion(req,res)
    };