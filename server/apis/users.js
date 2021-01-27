const exp = require('express');
const router = exp.Router();
const xlsx = require('xlsx');
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI;
let database;

MongoClient.connect(uri,{ useUnifiedTopology: true, useNewUrlParser: true }, (err, conn) => {
        if (err) {
            console.log("Connection failed to database", err);
          } else {
            database = conn.db("Users");
            console.log("Connection Successfull");
          }
        }
  )


//Get all users
router.get('/', async (req, res) => {
    try {
        const users = await database.collection('users_details').find({}).toArray();
        res.json({users});
    } catch (error) {
        console.error(error);
    }
})


// Add a single user
router.post('/', async (req, res) => {
    const { name, email, mobile, about } = req.body;
    if( !name || !email || !mobile || !about ){
          res.sendStatus(400).json({msg:"You have to enter all details"}) 
    }
    else{
        try {
            await database.collection("counters").updateOne({id:"key"}, {$inc:{user_seq:1}});
                let seqVal = await database.collection("counters").find({id:"key"}).toArray();
                seqVal = seqVal[0].user_seq;

            const addUser = await database.collection('users_details').insertOne({
                id:seqVal,
                Name:name,
                Email:email,
                Mobile:mobile,
                About:about
            });
            if(addUser.nInserted !== 0){
                res.send(200).json({msg:"User added successfully"});
            }
        } catch (error) {
            console.error(error);
        }
    }
    
});

//Add users in bulk
router.post('/bulk', async (req, res) => {
    if(req.files === null){
        return res.status(400);
    }
    const file = req.files.file;
    file.mv(`${__dirname}/uploads/${file.name}`, err => {
        if(err){
            console.error(err);
            return res.sendStatus(500);
        }
        const wb = xlsx.readFile(`${__dirname}/uploads/${file.name}`);
        const ws = wb.Sheets["Sheet1"];
        const data = xlsx.utils.sheet_to_json(ws);
        data.map(async data => {
                    await database.collection("counters").updateOne({id:"key"}, {$inc:{user_seq:1}});
                    let seqVal = await database.collection("counters").find({id:"key"}).toArray();
                    seqVal = seqVal[0].user_seq;
                    data.id = seqVal;
                const addUser = await database.collection('users_details').insertOne(data);
        })
    });
});

//Delete Users
router.delete('/delete', (req,res)=>{
    const ids = req.body.selectedUsers;
    ids.map(async id => {
        const deleted = await database.collection("users_details").deleteOne({id:id});
        
    })

})

module.exports = router;