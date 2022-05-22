//Name: Cheng Yee Han
//SID: 1155143426
const express = require('express');
const app = express();

const cors = require('cors'); 
app.use(cors());

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://stu143:p448413-@csci2720.m2qbq.mongodb.net/stu143');

const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
    console.log("Connection is open...")});

var Schema= mongoose.Schema;

const EventSchema = mongoose.Schema({
        eventId: { type: Number, required: true, unique: true },
        name:{ type: String, required: true },
        loc: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
        quota:{ type: Number }
    });
    
const LocationSchema = mongoose.Schema({
    locId:{ type: Number, required: true, unique: true },
    name:{ type: String, required: true },
    quota:{ type: Number }
    });
    
const Location = mongoose.model('Location', LocationSchema);
const Event = mongoose.model('Event', EventSchema);
    

const bodyParser = require('body-parser');
const res = require('express/lib/response');
app.use(bodyParser.urlencoded({extended:false}));



Event.find({ }, function(err, event) {
    if(!err){
    console.log(event);
    }
});
Location.find({ }, function(err, event) {
    if(!err){
    console.log(event);
    }
});



    
    //Q1
    app.get('/event/:eventId', (req,res) => {
        Event
        .findOne({eventId: req.params['eventId']})
        .populate('loc')
        .exec( (err, event) => {
            
            if (err) return res.send(err); 
            if (event==null) return res.contentType('text/plain').status(404).send("404, Event not found"); 
            res.status(200).contentType('text/plain').send("{\n\"eventId\": "+event.eventId+",\n" +
                    "\"name\": \"" + event.name + "\",\n" +
                    "\"loc\": \n{\n\"locId\": " + event.loc[0].locId + ",\n" +
                    "\"name\": \""+ event.loc[0].name + "\"\n},\n" +
                    "\"quota\": " + event.quota + "\n}\n" );
        });
    });

    //Q2
    app.post('/event', (req,res) => {
        Event
        .find()
        .sort({eventId:-1})
        .exec((err, doc)=>{
            if(err) return res.send(err);
            Location
            .findOne({locId: req.body['loc'] })
            .select('locId name quota')
            .exec((err,location)=>{
                if(err) 
                    return res.send(err);
                else if (location == null)
                    return res.contentType('text/plain').status(404).send("404, Location not found");  
                else if( req.body['quota'] > location.quota)
                    return res.contentType('text/plain').send("Quota not enough");

                    new_eid = doc[0].eventId +1;
                    Event.create({
                        eventId: new_eid,
                        name: req.body['name'],
                        loc: location._id,
                        quota: req.body['quota']
                        }, (err,e) => {
                            if (err)
                                return res.send(err);  
                            res.status(201).setHeader('Location', '/event/'+new_eid);
                            res.status(201).redirect('/event/'+new_eid);
                        });
                    });
        });
    });

    //Q3
    app.delete('/event/:eventId', (req,res) => {

        Event
        .findOne({eventId: req.params['eventId']})
        .deleteOne((err) => {
            if (err)
                res.contentType('text/plain').status(404).send("404 not found");  
            else
                res.status(204).send(null);  
                
            });
    });

    //Q4
    app.get('/event', (req,res) => {
        Event
        .find({})
        .populate('loc')
        .find({}, (err, event) => {
                if (err) return res.status(404).send("404 not found"); 
                
                let content='[\n';
                event.forEach( (e)=>{
                    
                    content+="{\n\"eventId\": "+e.eventId+",\n" +
                    "\"name\": \"" + e.name + "\",\n" +
                    "\"loc\": \n{\n\"locId\": " + e.loc[0].locId + ",\n" +
                    "\"name\": \""+ e.loc[0].name + "\"\n},\n" +
                    "\"quota\": " + e.quota + "\n}\n,\n";
                });
                return res.contentType('text/plain').send(content.slice(0,-2)+']');
        });
    });

    //Q5
    app.get('/loc/:locId', (req,res) => {
        Location
        .findOne({locId: req.params['locId']})
        .select('locId name quota')
        .exec( (err, loc) => {
            if(loc==null) return res.status(404).contentType('text/plain').send("404, location not found"); 
            if (err) return res.send(err); 
            res.contentType('text/plain').send("{\n\"locId\": " 
                    + loc.locId + ",\n" +
                    "\"name\": \""+ loc.name + "\",\n" +
                    "\"quota\": " + loc.quota + "\n}\n" );
        });
    });

   //Q6+7
    app.get('/loc', (req,res) => {
        
        var locQuota = req.query['quota'];//'/loc?quota=number'
        if( locQuota === undefined || locQuota === '')
            Location
            .find({}, (err, location) => {
                    if (err) return res.status(404).send("404 not found"); 
                    if (location==null) return res.send('[ ]');
                    let content='[\n';
                    location.forEach( (loc)=>{
                        content+="{\n\"locId\": " 
                        + loc.locId + ",\n" +
                        "\"name\": \""+ loc.name + "\",\n" +
                        "\"quota\": " + loc.quota + "\n}\n,\n";
                    });        
                    return res.contentType('text/plain').send(content.slice(0,-3)+'\n]');
                });
        else
            Location
            .find({}, (err, location) => {
                    if (err) return res.contentType('text/plain').status(404).send("404 not found"); 
                    if (location==null) return res.contentType('text/plain').send('[ ]');
                    let content='[\n';
                    location.forEach( (loc)=>{
                        if(loc.quota>=locQuota){
                        content+="{\n\"locId\": " 
                        + loc.locId + ",\n" +
                        "\"name\": \""+ loc.name + "\",\n" +
                        "\"quota\": " + loc.quota + "\n}\n,\n";}
                    });
                    if (content=='[\n') return res.contentType('text/plain').send('[ ]');
                    return res.contentType('text/plain').send(content.slice(0,-3)+'\n]');
            });
    });


    //Q8
    app.put('/event/:eventId', (req,res) => {
        
        Event
        .findOne({eventId:req.params['eventId']},(err,event)=>{
            if(err) return res.send(err);

            else{
                if(req.body['name']!=undefined && req.body['name']!=null){
                event.name = req.body['name'];
                
            }
                if(req.body['quota']!= undefined && req.body['quota']!=null){
                event.quota = req.body['quota'];
                
            }
            if(req.body['loc']!= undefined && req.body['loc']!=null){
                Location
                .findOne({locId: req.body['loc'] })
                .select("_id")
                .exec( (err,location)=>{
                    if(err) return res.send(err);
                    event.loc[0] = location._id;
                    event.save();
                });

            }


            return res.end( );}
           
        });
        
    });


//handle ALL request
app.all('/*', (req, res) => {
    // send this to client
    res.sendFile(__dirname+"/id.html");
    });

const server = app.listen(3000);