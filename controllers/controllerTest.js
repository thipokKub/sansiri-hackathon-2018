'use strict'

const mongoose = require('mongoose');

const Project = require('../models/Project');
const Camp = require('../models/Camp');
const Supplier = require('../models/Supplier');
const Worker = require('../models/Worker');
const Follower = require('../models/Follower');

const { ObjectId } = mongoose.Types;

const toJSON = (obj) => {
    return { json: JSON.parse(JSON.stringify(obj)), string: obj.toString() }
}

const controller = {
    // Test create Project
    // GET list all projects as list
    listAllProject: async (req, res) => {
        try {
            const allPrjects = Project.aggregate([{
                "$project": {
                    "_id": true,
                    "nameTH": true,
                    "nameEN": true,
                    "code": true,
                    "owners": true
                }
            }], (error, result) => {
                if(error) {
                    throw error;
                    return;
                }
                res.send(result);
            });
        } catch(e) {
            console.error(e);
            res.status(500).send(toJSON(e));
        }
    },

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
            res.status(500).send(toJSON(e));
        }
    },

    // Edit Project
    editProjectById: async (req, res) => {
        try {
            const { pid } = req.query;
            let result;
            if(ObjectId.isValid(pid)) {
                result = await Project.findById(pid);
                if(result === null) {
                    return res.send({ "status": "error", "message": "Project nor found" })
                }
                result.set({ ...req.body });
                result = await result.save();
                return res.send({ "status": "Success", "_id": result._id })
            } else {
                res.send({ "message": "Not a valid ObjectId"})
            }
        } catch(e) {
            console.error(e);
            res.status(500).send(toJSON(e));
        }
    },

    findProjectByQuery: async (req, res) => {
        try {
            const { name, code } = req.query;
            let findQuery = []
            if(typeof(name) === "string" && name.length > 0) {
                findQuery.push({ "nameEN": new RegExp(name, 'i') })
                findQuery.push({ "nameTH": new RegExp(name, 'i') })
            }
            if (typeof (code) === "string" && code.length > 0) {
                findQuery.push({ "code": code })
            }
            if(findQuery.length == 0) {
                throw new Error("Invalid name and/or code");
            } else if(findQuery.length <= 2) {
                let result = await Project.find({
                    "$or": findQuery
                });
                res.send(result);
            } else {
                let result = await Project.find({
                    "$or": findQuery.slice(0, 2),
                    "$and": findQuery.slice(2,3)
                });
                res.send(result);
            }
        } catch(e) {
            console.error(e);
            res.status(500).send(toJSON(e));
        }
    }    
}

module.exports = controller