'use strict'

const Worker = require('../models/Worker');

const toJSON = (obj) => {
  return { json: JSON.parse(JSON.stringify(obj)), string: obj.toString() }
}

const controller = {

  // GET Worker
  getWorker: (req, res) => {
    var query = {_id: req.id};
	  Worker.findOne(query, function(e,Worker){
      if(e) {
        console.error(e);
        res.status(500).send(toJSON(e))
      }
		  else{
			res.json(Worker);
		  }
    });
  },

  // POST create Worker
  createWorker: async (req, res) => {
      try {
          let newWorker = new Worker({
              ...req.body
          });
          const savedWorker = await newWorker.save();
          res.send({
              "status": "Success",
              "id": savedWorker._id
          })
      } catch(e) {
          console.error(e);
          res.status(500).send(toJSON(e))
      }
  },
  // PUT edit Worker
  editWorker: (req,res) =>{
    let WorkerAtt = {
      ...req.body
    }

    Worker.findOneAndUpdate(req._id,WorkerAtt,function(e,Worker){
      if(e) {
        console.error(e);
        res.status(500).send(toJSON(e))
      }
      else{
        res.send({
          "status": "Success",
          "id": Worker._id
        })
      }
    })
  },
  
  // DELETE Worker
  deleteWorker:  (req,res)=>{
    
    Worker.remove({ _id: req.id }, function(e){
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