var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UniversityQuestion = new Schema({

question:{
 type:String,
 required:false
},
answer:{
 type:String,
 required:false
},
UniversityId:{
    type:String,
    required:false
}

});
module.exports = mongoose.model('UniversityQuestion', UniversityQuestion);