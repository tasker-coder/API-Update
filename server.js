const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const validator=require("validator");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/workerDB",{useNewUrlParser: true}, { useUnifiedTopology: true } );

const Worker = mongoose.model(
    'worker',
    mongoose.Schema( 
    {
      country: String,
      firstName: {type:String},
      lastName: {type:String},
      email: { type:String,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Email is not valid !");
        }}
      },
      password: {type:String,min:[8,"should be 8 characters"]},
      confirmPassword: {type:String,min:[8,"should be 8 characters"]},
  
      address: {type:String}, 
      city: {type:String},
      state: {type:String}, 
      zip: Number,
      mobile:{type:String,
      validate: {
        validator: function(v) {
          return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
    }
    },
    {timestamps : true},
    
  ));

// GET ALL THE WORKERS

app.route('/workers')
.get( (req, res)=>{
    Worker.find((err, workerList)=>{
        if (err) {res.send(err)}
        else {res.send(workerList)}
    })
})

// REGISTER A WORKER
.post( (req,res)=>{
    const worker = new Worker({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      country: req.body.country,
      city: req.body.city,
      state: req.body.state,
      address: req.body.address,
      zip: req.body.zip,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      mobile:req.body.mobile
    });

    worker.save((err) =>{
        if (err) {res.send(err)}
        else res.send ('Successfully added a new worker!')
    }
    )
})

// DELETE ALL WORKER DATA
.delete((req,res) =>{
    Worker.deleteMany((err) =>{
        if (err) {res.send(err)}
        else {res.send('Successfully removed all workers!')}
    })
})


// GET SELECTED WORKER

app.route('/workers/:id')
.get((req, res)=>{
    Worker.findOne({_id: req.params.id}, (err, foundWorker)=>{
        if (foundWorker) (res.send(foundWorker))
        else res.send("No Matching Worker Found!")
    })
})

// UPDATE DETAILS OF SELECTED WORKER
.put((req,res)=>{     

    console.log(typeof(req.params.id));
    Worker.findOneAndUpdate(
        {_id: req.params.id},
        {
            country: req.body.country,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            city: req.body.city,
            state: req.body.state, 
        },
        (err)=>{
            if (err) {
                res.json({'err': err});
            }
            else {
                res.send('Successfully updated!');
            }
        }
    )
    
})

// DELETE SELECTED WORKER DATA.
.delete((req, res)=>{
    Worker.deleteOne({_id: req.params.id},(err) =>{
        if (err) {res.send(err)}
        else {res.send('Successfully removed selected worker!')}
    })
})

app.listen(process.env.PORT || 7000, ()=>{
    console.log('Server started on port 7000');
});
