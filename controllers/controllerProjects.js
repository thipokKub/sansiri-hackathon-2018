'use strict'

const _ = require('lodash');
const mongoose = require('mongoose');

const Project = require('../models/Project');
const Camp = require('../models/Camp');
const Supplier = require('../models/Supplier');

const { ObjectId } = mongoose.Types;

const toJSON = (obj) => {
    return { json: JSON.parse(JSON.stringify(obj)), string: obj.toString() }
}

const isArray = (obj) => {
    return typeof(obj) !== "undefined" && obj !== null && obj.constructor === Array
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
                    "owners": true,
                    "contains": true
                }
            }], (error, result) => {
                if (error) {
                    throw error;
                    return;
                }
                res.send(result);
            });
        } catch (e) {
            console.error(e);
            res.status(500).send(toJSON(e));
        }
    },

    // POST
    createProject: async (req, res) => {
        try {
            const { contains, owners } = req.body;
            // Validate input
            if (isArray(contains) && contains.length > 0) {
                // Validate input -> campId
                const findQuery = contains.map((item) => { return { "_id": item.campId } });
                if ((await Camp.find({ "$or": findQuery })).length !== contains.length) {
                    throw new Error("Invalid camp id(s)");
                }
            }
            if (isArray(owners) && owners.length > 0) {
                // Validate input -> supplierId
                const findQuery = contains.map((item) => item.supplierId);
                if ((await Supplier.find({ "$or": findQuery })).length !== owners.length) {
                    throw new Error("Invalid supplier id(s)");
                }
            }

            let newProject = new Project({
                ...req.body
            });
            const savedProject = await newProject.save();
            res.send({
                "status": "Success",
                "id": savedProject._id
            })
        } catch (e) {
            console.error(e);
            res.status(500).send(toJSON(e));
        }
    },

    // Edit Project
    editProjectById: async (req, res) => {
        try {
            const { pid } = req.query;
            let result;
            if (ObjectId.isValid(pid)) {
                result = await Project.findById(pid);
                if (result === null) {
                    return res.send({ "status": "error", "message": "Project not found" })
                }

                //Validate input
                const { contains, owners } = req.body;

                if (isArray(contains) && contains.length > 0) {
                    // Validate input -> campId
                    const findQuery = _.difference( contains.map((item) => { return { "_id": item.campId } }), result.contains );
                    if((await Camp.find({ "$or": findQuery })).length !== contains.length) {
                        throw new Error("Invalid camp id(s)");
                    }
                }
                if(isArray(owners) && owners.length > 0) {
                    // Validate input -> supplierId
                    const findQuery = _.difference( contains.map((item) => item.supplierId), result.owners );
                    if ((await Supplier.find({ "$or": findQuery })).length !== owners.length) {
                        throw new Error("Invalid supplier id(s)");
                    }
                }

                result.set({ ...req.body });
                result = await result.save();
                return res.send({ "status": "Success", "_id": result._id })
            } else {
                res.send({ "message": "Not a valid ObjectId" })
            }
        } catch (e) {
            console.error(e);
            res.status(500).send(toJSON(e));
        }
    },

    findProjectByQuery: async (req, res) => {
        try {
            const { name, code } = req.query;
            let findQuery = []
            if (typeof (name) === "string" && name.length > 0) {
                findQuery.push({ "nameEN": new RegExp(name, 'i') })
                findQuery.push({ "nameTH": new RegExp(name, 'i') })
            }
            if (typeof (code) === "string" && code.length > 0) {
                findQuery.push({ "code": code })
            }
            if (findQuery.length == 0) {
                throw new Error("Invalid name and/or code");
            } else if (findQuery.length <= 2) {
                let result = await Project.find({
                    "$or": findQuery
                });
                res.send(result);
            } else {
                let result = await Project.find({
                    "$or": findQuery.slice(0, 2),
                    "$and": findQuery.slice(2, 3)
                });
                res.send(result);
            }
        } catch (e) {
            console.error(e);
            res.status(500).send(toJSON(e));
        }
    },  

    // DELETE Camp
    deleteProject: async (req, res) => {
        try {
            let result = await Project.findById(req.query.pid);
            if(result !== null) {
                // Delete owners -> Supplier

                // Delete contains -> Camp
                //console.log((await Camp.find({ "$or": result.contains.map(it => { return ({ "_id": it })}) })).map((it) => it.belongTo))
                let Camps = await Camp.find({ "$or": result.contains.map(it => { return ({ "_id": it }) }) });
                // Camps.forEach((it) => {
                //     it.set({
                //         "belongTo": 
                //     })
                // })
            }
            res.send("Hello")

        } catch(e) {

        }
        // Project.remove({ _id: req.id }, function (e) {
        //     if (e) {
        //         console.error(e);
        //         res.status(500).send(toJSON(e))
        //     }
        //     else {
        //         res.send({
        //             "status": "Success",
        //             "messege": "deleted"
        //         })
        //     }
        // });
    }
}

module.exports = controller