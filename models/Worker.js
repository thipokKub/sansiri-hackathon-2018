'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const EventTransform = (doc, ret) => {
    delete ret.__v
}

const WorkerSchema = new Schema({
    workerNoId: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
    jobType: { type: String, required: true },
    photos: [{ type: String, unique: true }],
    telephone: { type: String },
    nationality: { type: String },
    race: { type: String },
    camps: [{type: ObjectId, ref: 'Camp' }],
    followers: [{
        followerId: { type: ObjectId, ref: 'Follower' },
        relationship: { type: String, required: true }
    }]
}, {
    timestamps: true,
    collection: 'workers',
    toObject: { transform: EventTransform },
    toJSON: { transform: EventTransform }
});

const Worker = mongoose.model('Worker', WorkerSchema)

module.exports = Worker;
