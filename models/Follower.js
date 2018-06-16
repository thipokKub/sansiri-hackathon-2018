'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const EventTransform = (doc, ret) => {
    delete ret.__v
}

const FollowerSchema = new Schema({
    gender: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    followerNoId: { type: String, required: true, unique: true },
    birthDate: { type: Date, required: true },
    nationality: { type: String },
    race: { type: String },
    resideInCamp: { type: ObjectId, ref: 'Camp' },
    isPermanent: { type: Boolean },
    photos: [{ type: String, unique: true }],
    eduaction: [{
        schoolName: { type: String },
        lastLevel: { type: String },
        yearStart: { type: Number },
        // If still enrolled -> -1
        yearEnd: { type: Number, default: -1 },
        country: { type: String },
    }],
    isEnrolledWithGoodSpace: { type: Boolean, default: false },
    vaccine: {
        //has been vaccinated between age 0 to 4?
        hasVaccinated: { type: Boolean, default: false },
        history: [{
            timePeroid: { type: String },
            vaccineNames: [{ name: { type: String } }],
            dueDate: { type: Date },
            vaccinatedDate: { type: Date }
        }]
    },
    following: [{ type: ObjectId, required: true }]
}, {
    timestamps: true,
    collection: 'followers',
    toObject: { transform: EventTransform },
    toJSON: { transform: EventTransform }
});

const Follower = mongoose.model('Follower', FollowerSchema)

module.exports = Follower;
