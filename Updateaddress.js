// USE THIS CODE IN PLACE OF THE EXISTING PUT METHOD IN SERVER.JS TO UPDATE ADDRESS AND MOBILE NUMBER.


console.log(typeof(req.params.id));
    Worker.findOneAndUpdate(
        {_id: req.params.id},
        {  
            address: req.body.address,
            mobile: req.body.mobile,
        },
        (err)=>{
            if (err) {
                res.json({'err': err});
            }
            else {
                res.send('Successfully updated!');
            }
        }
    );