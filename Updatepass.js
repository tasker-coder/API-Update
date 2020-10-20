// USE THIS CODE IN PLACE OF THE EXISTING PUT METHOD IN SERVER.JS TO UPDATE PASSWORD

console.log(typeof(req.params.id));
    Worker.findOneAndUpdate(
        {_id: req.params.id},
        {
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
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