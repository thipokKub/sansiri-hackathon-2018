'use strict'

const Worker = require('../models/Worker');
const Follower = require('../models/Follower');
const Camp = require('../models/Camp');
const { toJSON } = require('../helper');

const _calculateAge = (birthday) => { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const controller = {

    getTotalNationality: async (req, res) => {
        try {
            const allWorkers = await Worker.find({});
            let count = allWorkers.reduce((acc, item) => {
                if (typeof acc[item.nationality] === "undefined") acc[item.nationality] = 1;
                else acc[item.nationality]++;
                return acc;
            }, {});
            res.send(count);
        } catch(e) {
            console.error(e);
            res.status(500).send(toJSON(e));
        }
    },

    getCampNationalityCount: async (req, res) => {
        try {
            const campId = req.query.cid;
            // GET camp's workers
            const camp = await Camp.findById(campId);

            Promise.all(camp.contains.map((item) => {
                return new Promise((resolve, reject) => {
                    Worker.findById(item.workerId, (err, result) => {
                        if(err) return reject(e);
                        resolve(result.nationality)
                    });
                });
            })).then((results) => {
                const count = results.reduce((acc, item) => {
                    if(typeof acc[item] === "undefined") acc[item] = 1;
                    else acc[item] += 1
                    return acc;
                }, {});
                res.send(count);
            })

        } catch(e) {
            console.error(e);
            res.status(500).send(toJSON(e));
        }
    },

    getTotalCount: async (req, res) => {
        try {
            const workerCount = new Promise(async (resolve, reject) => {
                try {
                    const result = await Worker.aggregate([{
                        "$count": "countWorker"
                    }]);
                    resolve(result[0].countWorker)
                } catch(e) {
                    reject(e);
                }
            });
            const childrenCount = new Promise(async (resolve, reject) => {
                try {
                    const allFollowers = await Follower.find({});
                    resolve(allFollowers.filter((follower) => {
                        return _calculateAge(new Date(follower.birthDate)) < 16
                    }).length);
                } catch(e) {
                    reject(e);
                }
            });

            const [workerNum, childrenNum] = await Promise.all([workerCount, childrenCount]);
            res.send({
                "workerCount": workerNum,
                "childrenCount": childrenNum
            })
        } catch(e) {
            console.error(e);
            res.status(500).send(toJSON(e));
        }
    }
}

module.exports = controller;