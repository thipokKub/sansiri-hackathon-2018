'use strict'

const Worker = require('../models/Worker');
const Follower = require('../models/Follower');

const { toJSON, isBad, generateRemoveHandler, difference, validateInput } = require('../helper');

const controller = {

    // GET get all Follower
    getAllFollower: async (req, res) => {
        try {
            const result = await Follower.find({});
            res.send(result);
        } catch (e) {
            console.error(e);
            res.status(500).send(toJSON(e));
        }
    },

    // GET Worker
    getFollower: (req, res) => {
        var query = { _id: req.query.fid };
        Follower.findOne(query, function (e, follower) {
            if (e) {
                console.error(e);
                res.status(500).send(toJSON(e))
            }
            else {
                res.json(follower);
            }
        });
    },

    // POST create Worker
    createFollower: async (req, res) => {
        try {
            //Check project id
            const { following } = req.body;
            await validateInput(following, Worker, "Invalid Worker id(s)");

            let newFollower = new Follower({
                ...req.body
            });
            const savedFollower = await newFollower.save();
            res.send({
                "status": "Success",
                "id": savedFollower._id
            })
        } catch (e) {
            console.error(e);
            res.status(500).send(toJSON(e))
        }
    },

    // Upload photo
    uploadPhoto: async (req, res) => {
        try {
            const { id } = req.params;
            if (!isBad(id) && id.length > 0) {
                if (req.file) {
                    const filename = req.file.filename;
                    let follower = await Follower.findById(id);
                    if (follower !== null) {
                        follower.set({
                            "photos": worker.photos.concat([filename])
                        });
                        await follower.save();
                        res.send({
                            "status": "Success",
                            "id": follower._id
                        })
                    } else {
                        res.send({
                            "status": "Failed",
                            "message": "Follower Not Found"
                        })
                    }
                }
            } else {
                res.send({
                    "status": "Failed",
                    "message": "Follower Not Found"
                })
            }
        } catch (e) {
            console.error(e);
            res.status(500).send(toJSON(e))
        }
    },

    // PUT edit Worker
    editFollower: async (req, res) => {
        try {
            let result = await Follower.findById(req.query.fid);
            if (result !== null) {
                const { following } = req.body;
                await validateInput(difference(following, result.following.map((it) => it.toString())), Worker, "Invalid Worker id(s)");
                result.set({ ...req.body });
                await result.save();

                res.send({
                    "status": "Success",
                    "id": result._id
                })

            } else {
                return res.send({
                    "status": "Failed",
                    "messege": "Follower not found"
                })
            }
        } catch (e) {
            console.error(e);
            res.status(500).send(toJSON(e))
        }
    },

    // DELETE Worker
    deleteFollower: async (req, res) => {
        try {
            let result = await Follower.findById(req.query.fid);
            if (result !== null) {
                await generateRemoveHandler(req.query.fid, result, Worker, "following", "followers.followerId", "Remove Worker Failed")();

                // Remove Success
                Follower.remove({ _id: req.query.fid }, function (e) {
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
                    "messege": "Follower not found"
                })
            }
        } catch (e) {
            console.error(e);
            res.status(500).send(toJSON(e))
        }
    }
}

module.exports = controller;