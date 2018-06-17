const multer = require('multer')
const uuid = require('uuid')
const dotenv = require('dotenv')

dotenv.config();

const isBad = (obj) => {
    return typeof (obj) === "undefined" || obj === null
}

const toJSON = (obj) => {
    return { json: JSON.parse(JSON.stringify(obj)), string: obj.toString() }
}

const isArray = (obj) => {
    return typeof (obj) !== "undefined" && obj !== null && obj.constructor === Array
}

const generateRemoveHandler = (id, result, destCollection, propertySrc, propertyDest, errorMsg = "Remove Failed") => {
    return (async () => {
        try {
            let Arrays;
            if (propertySrc.split(".") == 2) {
                const [front, back] = propertyDest.split(".");
                if (result[front][back].length > 0) {
                    Arrays = await destCollection.find({ "$or": result[front][back].map(it => { return ({ "_id": it }) }) })
                } else {
                    Arrays = []
                }
            } else {
                if (result[propertySrc].length > 0) {
                    Arrays = await destCollection.find({ "$or": result[propertySrc].map(it => { return ({ "_id": it }) }) })
                } else {
                    Arrays = []
                }
            }
            if (propertyDest.split(".") == 2) {
                const [front, back] = propertyDest.split(".");
                for (let i = 0; i < Arrays.length; i++) {
                    Arrays[i][front][back] = Arrays[i][front][back].map(it => {
                        if (it.toString() !== id) return it.toString()
                        return false
                    }).filter(Boolean);
                }
                return Promise.all(Arrays.map((item) => {
                    return new Promise((resolve, reject) => {
                        item.set({
                            [front]: item[front]
                        });
                        item.save((err, result) => {
                            if (err !== null) {
                                return reject(false);
                            }
                            return resolve(true)
                        });
                    })
                }));
            } else {
                for (let i = 0; i < Arrays.length; i++) {
                    Arrays[i][propertyDest] = Arrays[i][propertyDest].map(it => {
                        if (it.toString() !== id) return it.toString()
                        return false
                    }).filter(Boolean);
                }
                return Promise.all(Arrays.map((item) => {
                    return new Promise((resolve, reject) => {
                        item.set({
                            [propertyDest]: item[propertyDest]
                        });
                        item.save((err, result) => {
                            if (err !== null) {
                                return reject(false);
                            }
                            return resolve(true)
                        });
                    })
                }));
            }
        } catch (e) {
            console.error(e);
            throw new Error(errorMsg);
        }
    });
}

const difference = (arrayA, arrayB) => {
    if (isArray(arrayA) && isArray(arrayB)) {
        return arrayA.map((item) => {
            if (arrayB.indexOf(item) !== -1) return false;
            return item;
        }).filter(Boolean);
    }
    return []
}

const validateInput = async (array, destCollection, errorMsg = 'Invalid Input') => {
    if (isArray(array) && array.length > 0) {
        if ((await destCollection.find({ "$or": array.map(it => { return ({ "_id": it.toString() }) }) })).length !== array.length) {
            throw new Error(errorMsg);
        }
    }
}

const ext = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif'
};

const uploadWorkerPhotoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_WORKER_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + ext[file.mimetype])
    }
})

const uploadFollowerPhotoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_FOLLOWER_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + ext[file.mimetype])
    }
})

const uploadPictureFilter = (req, file, cb) => {
    var type = file.mimetype
    if (type === 'image/jpeg' || type === 'image/png' || type === 'image/gif') {
        cb(null, true)
    } else {
        cb(new Error('goes wrong on the mimetype'))
    }
  }

module.exports = {
    toJSON,
    isArray,
    generateRemoveHandler,
    difference,
    validateInput,
    isBad,
    // Upload photo helper
    uploadWorkerPhotoStorage,
    uploadFollowerPhotoStorage,
    uploadPictureFilter
}
