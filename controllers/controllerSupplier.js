'use strict'

const Supplier = require('../models/Supplier');

const toJSON = (obj) => {
  return { json: JSON.parse(JSON.stringify(obj)), string: obj.toString() }
}

const controller = {

  // GET supplier
  getSupplier: (req, res) => {
    var query = {_id: req.id};
	  Supplier.findOne(query, function(e,Supplier){
      if(e) {
        console.error(e);
        res.status(500).send(toJSON(e))
      }
		  else{
			res.json(Supplier);
		  }
    });
  },

  // POST create Supplier
  createSupplier: async (req, res) => {
      try {
          let newSupplier = new Supplier({
              ...req.body
          });
          const savedSupplier = await newSupplier.save();
          res.send({
              "status": "Success",
              "id": savedSupplier._id
          })
      } catch(e) {
          console.error(e);
          res.status(500).send(toJSON(e))
      }
  },
  // PUT edit Supplier
  editSupplier: async (req,res) =>{
    let SupplierAtt = {
      ...req.body
    }

    Supplier.findOneAndUpdate(req._id,SupplierAtt,function(e,Supplier){
      if(e) {
        console.error(e);
        res.status(500).send(toJSON(e))
      }
      else{
        res.send({
          "status": "Success",
          "id": Supplier._id
        })
      }
    })
  },
  
  // DELETE Supplier
  deleteSupplier: async (req,res)=>{
    
    Supplier.remove({ _id: req.id }, function(e){
      if(e) {
        console.error(e);
        res.status(500).send(toJSON(e))
      }
      else{
        res.send({
          "status": "Success",
          "messege": "deleted"
        })
      }
    }); 
  }

  
  

}

module.exports = controller