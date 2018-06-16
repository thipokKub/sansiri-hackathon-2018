'use strict'

const Supplier = require('../models/Supplier');
const Project = require('../models/Project');
const { toJSON, generateRemoveHandler, difference, validateInput } = require('../helper');

const controller = {

  // GET get all Suppliers
  getAllSupplier: async (req, res) => {
    try {
      const result = await Supplier.find({});
      res.send(result);
    } catch (e) {
      console.error(e);
      res.status(500).send(toJSON(e));
    }
  },

  // GET get Supplier
  getSupplier: (req, res) => {
    var query = { _id: req.query.sid };
    Supplier.findOne(query, function (e, supplier) {
      if (e) {
        console.error(e);
        res.status(500).send(toJSON(e))
      }
      else {
        res.json(supplier);
      }
    });
  },

  // POST create Supplier
  createSupplier: async (req, res) => {
    try {
      //Check project id
      const { entitledTo } = req.body;
      // Validate input
      await validateInput(entitledTo, Project, "Invalid project id(s)");

      let newSupplier = new Supplier({
        ...req.body
      });
      const savedSupplier = await newSupplier.save();
      res.send({
        "status": "Success",
        "id": savedSupplier._id
      })
    } catch (e) {
      console.error(e);
      res.status(500).send(toJSON(e))
    }
  },

  // PUT edit Supplier
  editSupplier: async (req, res) => {
    try {
      let result = await Supplier.findById(req.query.sid);
      if (result !== null) {
        //Check project id
        const { entitledTo } = req.body;
        // Validate input
        await validateInput(difference(entitledTo, result.belongTo.map(it => it.toString())), Project, "Invalid project id(s)");

        let supplierAtt = {
          ...req.body
        }

        result.set(supplierAtt);
        await result.save();

        res.send({
          "status": "Success",
          "id": result._id
        })
      } else {
        return res.send({
          "status": "Failed",
          "messege": "Supplier not found"
        })
      }
    } catch (e) {
      console.error(e);
      res.status(500).send(toJSON(e))
    }
  },

  // DELETE Supplier
  deleteSupplier: async (req, res) => {
    let result = await Supplier.findById(req.query.sid);
    if (result !== null) {
      await generateRemoveHandler(req.query.sid, result, Project, "entitledTo", "owners.supplierId", "Remove Projects Failed")();
      // Remove Success
      Supplier.remove({ _id: req.query.sid }, function (e) {
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
        "messege": "Supplier not found"
      })
    }
  }
}

module.exports = controller