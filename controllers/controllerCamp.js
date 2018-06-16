'use strict'

const Camp = require('../models/Camp');

const toJSON = (obj) => {
  return { json: JSON.parse(JSON.stringify(obj)), string: obj.toString() }
}

const controller = {
  // GET Request for testing
  getCamp: (req, res) => {
    var query = {_id: req.id};
	  Camp.findOne(query, function(e,camp){
      if(e) {
        console.error(e);
        res.status(500).send(toJSON(e))
      }
		  else{
			res.json(camp);
		  }
    });
  },

  // POST create Camp
  createCamp: async (req, res) => {
      try {
          let newCamp = new Camp({
              ...req.body
          });
          const savedCamp = await newCamp.save();
          res.send({
              "status": "Success",
              "id": savedCamp._id
          })
      } catch(e) {
          console.error(e);
          res.status(500).send(toJSON(e))
      }
  },
  // PUT edit Camp
  editCamp: (req,res) =>{
    let campAtt = {
      ...req.body
    }

    Camp.findOneAndUpdate(req._id,campAtt,function(e,camp){
      if(e) {
        console.error(e);
        res.status(500).send(toJSON(e))
      }
      else{
        res.send({
          "status": "Success",
          "id": camp._id
        })
      }
    })
  },
  
  // DELETE Camp
  deleteCamp: (req,res)=>{
    
    Camp.remove({ _id: req.id }, function(e){
      if(e) {
        console.error(e);
        res.status(500).send(toJSON(e))
      }
      else{
        res.send({
          "status": "Success",
          "messege": "deleted"
        })
      }
    }); 
  }

  
  

}

module.exports = controller