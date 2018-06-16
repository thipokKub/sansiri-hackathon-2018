'use strict'

const _ = require('lodash');

const Camp = require('../models/Camp');
const Project = require('../models/Project');
const Worker = require('../models/Worker');

const toJSON = (obj) => {
  return { json: JSON.parse(JSON.stringify(obj)), string: obj.toString() }
}

const isArray = (obj) => {
  return typeof (obj) !== "undefined" && obj !== null && obj.constructor === Array
}

const controller = {
  getAllCamp: async (req, res) => {
    try {
      const result = await Camp.find({});
      res.send(result);
    } catch(e) {
      console.error(e);
      res.status(500).send(toJSON(e));
    }
  },

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
          //Check project id
          const { belongTo, contains } = req.body;

          // Validate input
          if (isArray(belongTo) && belongTo.length > 0) {
            // Validate input -> projectId
            const findQuery = belongTo.map((item) => { return { "_id": item.projectId } });
            if ((await Project.find({ "$or": findQuery })).length !== belongTo.length) {
              throw new Error("Invalid project id(s)");
            }
          }
          if (isArray(contains) && contains.length > 0) {
            // Validate input -> workerId
            const findQuery = contains.map((item) => item.workerId);
            if ((await Worker.find({ "$or": findQuery })).length !== contains.length) {
              throw new Error("Invalid worker id(s)");
            }
          }

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
  editCamp: async (req,res) => {
    try {
      let result = await Camp.findById(req._id);
      if(result !== null) {
        //Check project id
        const { belongTo, contains } = req.body;
    
        // Validate input
        if (isArray(belongTo) && belongTo.length > 0) {
          // Validate input -> projectId
          const findQuery = _.difference(belongTo.map((item) => { return { "_id": item.projectId } }), );
          if ((await Project.find({ "$or": findQuery })).length !== belongTo.length) {
            throw new Error("Invalid project id(s)");
          }
        }
        if (isArray(contains) && contains.length > 0) {
          // Validate input -> workerId
          const findQuery = contains.map((item) => item.workerId);
          if ((await Worker.find({ "$or": findQuery })).length !== contains.length) {
            throw new Error("Invalid worker id(s)");
          }
        }
    
        let campAtt = {
          ...req.body
        }
  
        result.set(campAtt);
        await result.save();
  
        res.send({
          "status": "Success",
          "id": result._id
        })
      }
    } catch(e) {
      console.error(e);
      res.status(500).send(toJSON(e))
    }
  },
  
  // DELETE Camp
  deleteCamp: async (req,res) => {
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