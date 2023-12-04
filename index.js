
const express=require("express");
const cors=require("cors")
const multer=require('multer')
const storage=multer.memoryStorage();
const upload=multer({storage:storage});

const app=new express();

const studmodel =require('./model/student');
const certmodel =require('./model/cert');



app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors());


app.get('/',(request,response)=>{
    response.send("hi database")
})


//For saving student data

app.post('/snew',(request,response)=>{
    new studmodel(request.body).save();
    response.send("record saved")
})




//for retreiving student data
app.get('/sview',async(request,response)=>{
    var data = await studmodel.find();
    response.send(data)
})

//for updating status of student
app.put('/updatestatus/:id',async(request,response)=>{
    let id=request.params.id;
    await studmodel.findByIdAndUpdate(id,{$set:{Status:"INACTIVE"}})
    response.send("Record Deleted")


})

//for modifying the details student
app.put('/sedit/:id',async(request,response)=>{

    let id=request.params.id;
    await studmodel.findByIdAndUpdate(id,request.body)
    response.send("Record Deleted")


})


//for saving certificate details
app.post('/certnew',upload.single('certphoto'),async(request,response)=>{
const {sid,qualification}=request.body
const newdata = new certmodel({
    sid,
    qualification,
    certphoto:{
        data:request.file.buffer,
        contentType:request.file.mimetype,
    }
})
await newdata.save();
})


//for retreiving student data
app.get('/cview',async(request,response)=>{
    
    const result = await certmodel.aggregate([
        {
            $lookup: {
                from: 'students',
                localField: 'sid',   //foriegn key
                foreignField: '_id',
                as: 'stud'
            },
        },
    ]);
console.log(result)
    response.send(result)

})


app.listen(4005,(request,response)=>{
    console.log("port is running is 4005")
})