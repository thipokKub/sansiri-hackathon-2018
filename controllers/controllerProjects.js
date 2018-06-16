'use strict'

const _ = require('lodash');
const mongoose = require('mongoose');

const Project = require('../models/Project');
const Camp = require('../models/Camp');
const Supplier = require('../models/Supplier');

const { ObjectId } = mongoose.Types;

const { toJSON, generateRemoveHandler, difference, validateInput } = require('../helper');

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
            let validateCamps = validateInput(contains, Camp, "Invalid camp id(s)");
            let validateSuppliers = validateInput(owners, Supplier, "Invalid camp id(s)");
            await Promise.all([validateCamps, validateSuppliers]);

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
                const validateCamps = validateInput(difference(contains, result.contains.map(it => it.toString())), Camp, "Invalid camp id(s)");
                const validateSuppliers = validateInput(difference(owners, result.owners.map(it => it.toString())), Supplier, "Invalid supplier id(s)");
                await Promise.all([validateCamps, validateSuppliers]);
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
                // Use promise for performance (perform in parallel)
                // Remove any pointer left to this object
                let RemoveCamps = generateRemoveHandler(req.query.pid, result, Camp, "contains", "belongTo", "Remove Camps Failed")();
                let RemoveSuppliers = generateRemoveHandler(req.query.pid, result, Supplier, "owners", "entitledTo", "Remove Suppliers Failed")();
                await Promise.all([RemoveCamps, RemoveSuppliers])

                // Remove Success
                // Perform final remove
                Project.remove({ _id: req.query.pid }, function (e) {
                    if (e) {
                        console.error(e);
                        return res.status(500).send(toJSON(e))
                    }
                    else {
                        return (res.send({
                            "status": "Success",
                            "messege": "deleted"
                        }))
                    }
                });
            } else {
                //Nothing to remove
                return res.send({
                    "status": "Failed",
                    "messege": "Project not found"
                })
            }
        } catch(e) {
            console.error(e);
            res.status(500).send(toJSON(e));
        }
    }
}

module.exports = controller