'use strict'

const Worker = require('../models/Worker');
const Camp = require('../models/Camp');
const Follower = require('../models/Follower');

const { toJSON, generateRemoveHandler, difference, validateInput } = require('../helper');

const controller = {

  // GET get all Suppliers
  getAllWorker: async (req, res) => {
    try {
      const result = await Worker.find({});
      res.send(result);
    } catch (e) {
      console.error(e);
      res.status(500).send(toJSON(e));
    }
  },

  // GET Worker
  getWorker: (req, res) => {
    var query = {_id: req.query.wid};
	  Worker.findOne(query, function(e, worker){
      if(e) {
        console.error(e);
        res.status(500).send(toJSON(e))
      }
		  else{
			  res.json(worker);
		  }
    });
  },

  // POST create Worker
  createWorker: async (req, res) => {
    try {
      //Check project id
      const { followers, camps } = req.body;
      const validateCamps = validateInput(camps, Camp, "Invalid camp id(s)");
      const validateFollowers = validateInput(followers.map(it => it.followerId), Follower, "Invalid follower id(s)");
      await Promise.all([validateCamps, validateFollowers])

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
  editWorker: async (req,res) => {
    try {
      let result = await Worker.findById(req.query.wid);
      if (result !== null) {
        const { followers, camps } = req.body;
        const validateCamps = validateInput(difference(camps, result.camps.map(it => it.toString())), Camp, "Invalid camp id(s)");
        const validateFollowers = validateInput(difference(followers.map(it => it.followerId), result.followers.map(it => it.followerId.toString())), Follower, "Invalid follower id(s)");
        await Promise.all([validateCamps, validateFollowers])
        let WorkerAtt = {
          ...req.body
        }
        result.set(WorkerAtt);
        await result.save();
        res.send({
          "status": "Success",
          "id": result._id
        })

      } else {
        return res.send({
          "status": "Failed",
          "messege": "Worker not found"
        })
      }
    } catch(e) {
      console.error(e);
      res.status(500).send(toJSON(e))
    }
  },
  
  // DELETE Worker
  deleteWorker: async (req,res) =>{
    try {
      let result = await Worker.findById(req.query.wid);
      if (result !== null) {
        // const { followers, camps } = req.body;
        const RemoveFollower = generateRemoveHandler(req.query.wid, result, Follower, "followers.followerId", "following", "Remove Follower Failed")();
        const RemoveCamp = generateRemoveHandler(req.query.wid, result, Camp, "camps", "contains.workerUd", "Remove Camp Failed")();
        await Promise.all([RemoveFollower, RemoveCamp])

        // Remove Success
        Worker.remove({ _id: req.query.wid }, function (e) {
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
          "messege": "Worker not found"
        })
      }
    } catch(e) {
      console.error(e);
      res.status(500).send(toJSON(e))
    }
  }
}

module.exports = controller