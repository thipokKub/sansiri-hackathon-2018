'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const EventTransform = (doc, ret) => {
    delete ret.__v
}

const CampSchema = new Schema({
    address: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    hasGoodSpace: { type: Boolean, required: true },
    belongTo: [{
        projectId: { type: ObjectId, ref: 'Project' }
    }],
    contains: [{
        workerNoId: { type: String, ref: 'Worker' },
        workerId: { type: ObjectId, ref: 'Worker' }
    }]
}, {
    timestamps: true,
    collection: 'camps',
    toObject: { transform: EventTransform },
    toJSON: { transform: EventTransform }
});

const Camp = mongoose.model('Camp', CampSchema)

module.exports = Camp;
