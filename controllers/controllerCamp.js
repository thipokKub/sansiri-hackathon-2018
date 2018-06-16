'use strict'

const _ = require('lodash');

const Camp = require('../models/Camp');
const Project = require('../models/Project');
const Worker = require('../models/Worker');

//Import helper functions

const { toJSON, generateRemoveHandler, difference, validateInput } = require('../helper');

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
    var query = { _id: req.query.cid};
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
          const validateProjects = validateInput(belongTo, Project, "Invalid project id(s)");
          const validateWorkers = validateInput(contains.map((item) => item.workerId), Worker, "Invalid worker id(s)");
          await Promise.all([validateProjects, validateWorkers]);

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
      let result = await Camp.findById(req.query.cid);
      if(result !== null) {
        //Check project id
        const { belongTo, contains } = req.body;
    
        // Validate input
        const validateProjects = validateInput(difference(belongTo, result.belongTo.map(it => it.toString())), Project, "Invalid project id(s)");
        const validateWorkers = validateInput(
          difference(contains.map((item) => item.workerId), result.contains.map(it => it.workerId.toString()))
        , Worker, "Invalid worker id(s)");
        await Promise.all([validateProjects, validateWorkers]);
    
        let campAtt = {
          ...req.body
        }
  
        result.set(campAtt);
        await result.save();
  
        res.send({
          "status": "Success",
          "id": result._id
        })
      } else {
        return res.send({
          "status": "Failed",
          "messege": "Camp not found"
        })
      }
    } catch(e) {
      console.error(e);
      res.status(500).send(toJSON(e))
    }
  },
  
  // DELETE Camp
  deleteCamp: async (req,res) => {
    try {
      let result = await Camp.findById(req.query.cid);
      if (result !== null) {
        let RemoveProject = generateRemoveHandler(req.query.cid, result, Project, "belongTo", "contains", "Remove Projects Failed")();
        let RemoveWorker = generateRemoveHandler(req.query.cid, result, Worker, "contains", "camps", "Remove Worker Failed")();
        await Promise.all([RemoveProject, RemoveWorker]);
        // Remove Success
        Camp.remove({ _id: req.query.cid }, function (e) {
          if (e) {
            console.error(e);
            return res.status(500).send(toJSON(e))
          }
          else {
            return res.send({
              "status": "Success",
              "messege": "deleted"
            })
          }
        });
      } else {
        return res.send({
          "status": "Failed",
          "messege": "Camp not found"
        })
      }
    } catch(e) {
      console.error(e);
      res.status(500).send(toJSON(e))
    }
  }
}

module.exports = controller