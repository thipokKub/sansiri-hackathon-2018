'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const EventTransform = (doc, ret) => {
    delete ret.__v
}

const SupplierSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    province: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String },
    entitledTo: [{type: ObjectId, ref: 'Project' }]
}, {
        timestamps: true,
        collection: 'suppliers',
        toObject: { transform: EventTransform },
        toJSON: { transform: EventTransform }
    })

const Supplier = mongoose.model('Supplier', SupplierSchema)

module.exports = Supplier;
