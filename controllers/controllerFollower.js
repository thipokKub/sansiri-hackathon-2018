'use strict'

const axios = require("axios");
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

    findFollowerByName: async (req, res) => {
        try {
            const { name } = req.query;
            const findQuery = [];
            findQuery.push({ "firstname": new RegExp(name, 'i') });
            findQuery.push({ "lastname": new RegExp(name, 'i') });
    
            const result = await Follower.find([{
                "$or": findQuery
            }]);
    
            res.send(result);
        } catch(e) {
            console.error(e);
            res.status(500).send(toJSON(e))
        }
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
                    if (e) {s
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
    },

    //Searching 
    searchChildren: (req, res) => {
        //filename
        const filename = req.file.filename;
        const req_body = {    
            "url": " "+"/uploads"+"/followers/"+filename
        }
        const config = {
            headers: {
                'Ocp-Apim-Subscription-Key': 'c1c347d0c7cf4b5ab244e98e054537d1',
                'Content-Type':'application/json'
            }
        };

        axios.post(`https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect`, req_body,config)
        .then(res => {
            console.log(res.data)
            return res.data.faceId
        })
        .then(faceId => {
            var req_body = {
                "faceId1": faceId,
                "faceId2" : "'f467dab9-3965-4291-9b8c-57b616df3760"
            }
            var out = axios.post(`https://southeastasia.api.cognitive.microsoft.com/face/v1.0/verify`, req_body,config)
            .then(
                res => {
                    var out = res.data
                    return out
                }
            )
            return out
        })
        .then(output =>{
            res.send(output);
        })
        .catch((e) => {
            console.log(e)
        })
        
        


        // var params = {
        //     // Request parameters
        //     "returnFaceId": "true",
        //     "returnFaceLandmarks": "false",
        //     "returnFaceAttributes": "age",
        // };
        // const config = {
        //     headers: {
        //         'Ocp-Apim-Subscription-Key': 'c1c347d0c7cf4b5ab244e98e054537d1',
        //         'Content-Type':'application/json'
        //     }
        // };

        
        // axios.post(`https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect`, req_body,config)
        // .then(res => {
        //     console.log(res.data);
        // })
     
    }
}

module.exports = controller;