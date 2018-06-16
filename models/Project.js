'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const EventTransform = (doc, ret) => {
    delete ret.__v
}

const ProjectSchema = new Schema({
    code: { type: String, required: true },
    nameTH: { type: String, required: true },
    nameEN: { type: String, required: true },
    province: { type: String, required: true },
    timestart: { type: Date, required: true, default: Date.now },
    timeend: { type: Date, required: true },
    owners: [{
        supplierId: { type: ObjectId, ref: 'Supplier' },
        title: { type: String, required: true }
    }],
    contains: [{
        campId: { type: ObjectId, ref: 'Camp' }
    }]
}, {
    timestamps: true,
    collection: 'projects',
    toObject: { transform: EventTransform },
    toJSON: { transform: EventTransform }
})

const Project = mongoose.model('Project', ProjectSchema)

module.exports = Project;
