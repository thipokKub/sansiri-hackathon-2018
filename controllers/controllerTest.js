'use strict'

const Project = require('../models/Project');
const Camp = require('../models/Camp');
const Supplier = require('../models/Supplier');
const Worker = require('../models/Worker');
const Follower = require('../models/Follower');

const toJSON = (obj) => {
    return { json: JSON.parse(JSON.stringify(obj)), string: obj.toString() }
}

const controller = {
    // GET Request for testing
    getTest: (req, res) => {
        res.send({"message": "Hello"});
    },

    // Test create Project
    // POST
    createProject: async (req, res) => {
        try {
            let newProject = new Project({
                ...req.body
            });
            const savedProject = await newProject.save();
            res.send({
                "status": "Success",
                "id": savedProject._id
            })
        } catch(e) {
            console.error(e);
            res.status(500).send(toJSON(e))
        }
    }
}

module.exports = controller