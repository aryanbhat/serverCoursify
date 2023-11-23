const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const dotenv = require('dotenv');
const {authenticateAdmin, authenticateUser} = require('./middleware/auth');
const mongoose = require('mongoose');
const {Mongoose,Schema} = require('mongoose');


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


const sahilData = [
  {
    name:"Ahmed Abdulaziz",
    data:"15 Apr 21, 12:30 PM",
    num_of_files:7,
    expert_time:"30 min",
    logo:__dirname+'\pubic\EY.png',
    child:[
      {
        description:"File name goes here on per original docs",
        words:15000,
        para:100,
        date:"15 Apr 21, 12:30 PM",
        expert_time:'20 min'
      },
      {
        description:"File name goes here on per original docs",
        words:15000,
        para:100,
        date:"15 Apr 21, 12:30 PM",
        expert_time:'20 min'
      },
      {
        description:"File name goes here on per original docs",
        words:15000,
        para:100,
        date:"15 Apr 21, 12:30 PM",
        expert_time:'20 min'
      },
      {
        description:"File name goes here on per original docs",
        words:15000,
        para:100,
        date:"15 Apr 21, 12:30 PM",
        expert_time:'20 min'
      },
      {
        description:"File name goes here on per original docs",
        words:15000,
        para:100,
        date:"15 Apr 21, 12:30 PM",
        expert_time:'20 min'
      },
      {
        description:"File name goes here on per original docs",
        words:15000,
        para:100,
        date:"15 Apr 21, 12:30 PM",
        expert_time:'20 min'
      },
      {
        description:"File name goes here on per original docs",
        words:15000,
        para:100,
        date:"15 Apr 21, 12:30 PM",
        expert_time:'20 min'
      },
      {
        description:"File name goes here on per original docs",
        words:15000,
        para:100,
        date:"15 Apr 21, 12:30 PM",
        expert_time:'20 min'
      },
      {
        description:"File name goes here on per original docs",
        words:15000,
        para:100,
        date:"15 Apr 21, 12:30 PM",
        expert_time:'20 min'
      }
    ]
  },
  {
    name:"Abdul Rashid",
    data:"11 Apr 21, 1:30 PM",
    num_of_files:10,
    expert_time:"45 min",
    logo:__dirname+'\pubic\mckinsey.png',
    child:[
      {
        description:"update the translation service",
        words:12000,
        para:80,
        date:"11 Apr 21, 1:30 PM",
        expert_time:'30 min'
      },
      {
        description:"update the translation service",
        words:12000,
        para:80,
        date:"11 Apr 21, 1:30 PM",
        expert_time:'30 min'
      },
      {
        description:"update the translation service",
        words:12000,
        para:80,
        date:"11 Apr 21, 1:30 PM",
        expert_time:'30 min'
      },
      {
        description:"update the translation service",
        words:12000,
        para:80,
        date:"11 Apr 21, 1:30 PM",
        expert_time:'30 min'
      },
      {
        description:"update the translation services",
        words:12000,
        para:80,
        date:"11 Apr 21, 1:30 PM",
        expert_time:'30 min'
      },
      {
        description:"update the translation service",
        words:12000,
        para:80,
        date:"11 Apr 21, 1:30 PM",
        expert_time:'30 min'
      },
      {
        description:"update the translation service",
        words:12000,
        para:80,
        date:"11 Apr 21, 1:30 PM",
        expert_time:'30 min'
      },
      {
        description:"update the translation service",
        words:12000,
        para:80,
        date:"11 Apr 21, 1:30 PM",
        expert_time:'30 min'
      },
      {
        description:"update the translation service",
        words:12000,
        para:80,
        date:"11 Apr 21, 1:30 PM",
        expert_time:'30 min'
      }
    ]
  }
]





mongoose.connect(process.env.MONGOURL,{ useNewUrlParser:"true", useUnifiedTopology:"true"});

const port =  process.env.PORT || 3000;

const adminSchema = new Schema({
  "username":String,
  "password":String
})

const courseSchema = new Schema({
  "title":String,
  "description":String,
  "price":Number,
  "imageLink":String,
  "published":Boolean
})

const userSchema = new Schema({
  "username":String,
  "password":String,
  "purchasedCourses": [{ type:mongoose.Schema.Types.ObjectId, ref: 'Course'}]
})


const Admin = mongoose.model('Admin',adminSchema);
const User = mongoose.model('User',userSchema);
const Course = mongoose.model('Course',courseSchema);



app.get('/',(req,res)=>{
  res.json({"message":"Coursify deployed successfully"});
})

app.get('/getdata',(req,res)=>{
  res.json(sahilData);
})
// Admin routes
app.post('/admin/signup', async(req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({username});
  if (admin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    const newAdmin =  new Admin({ username, password });
     await newAdmin.save();
    const token = jwt.sign({ username, role: 'admin' }, process.env.SECRETADMIN, { expiresIn: '1h' });
    res.json({ message: 'Admin created successfully', token });
  }
});
app.post('/admin/login', async(req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({username,password});
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, process.env.SECRETADMIN, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.post('/admin/courses', authenticateAdmin, async(req, res) => {
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json({ message: 'Course created successfully',courseId:newCourse.id,username:req.user});
});

app.get('/admin/courses', authenticateAdmin, async(req, res) => {
  const courses = await Course.find({});
  res.json({ courses });
});

app.get('/admin/courses/:id',authenticateAdmin,async(req,res) => {
  const id = (req.params.id);
  const course = await Course.findById(id);
  if(course){
    res.status(201).json(course);
  }
  else{
  res.status(401).send("No courses found");
  }
});

app.put('/admin/courses/:courseId', authenticateAdmin, async(req, res) => {
  const course  = await Course.findByIdAndUpdate(req.params.courseId,req.body,{new: true})
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});




app.delete('/admin/courses/:courseId', authenticateAdmin, async(req,res) => {
  const course = await Course.findByIdAndDelete(req.params.courseId);
  if(course){
    res.status(200).json(`course ID ${course.id} is deleted`);
  }
  else{
    res.status(404).json('Course not found')
  }
})


// User routes
app.post('/users/signup', async(req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({username});
  if (user) {
  res.status(403).send('User already exists');
  } 
  else {
    const newUser = new User({username,password});
    await newUser.save();
    const token = jwt.sign({ username, role: 'user' }, process.env.SECRETUSER, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', async(req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({username,password});
  if (user) {
    const token = jwt.sign({ username, role: 'user' }, process.env.SECRETUSER, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.get('/users/courses', authenticateUser, async(req, res) => {
    const courses = await Course.find({published:true});
    const user = await User.find({username : req.user.username})
    res.status(200).json({ courses, purchasedCourses:user[0].purchasedCourses });
});

app.post('/users/courses/:courseId', authenticateUser, async(req, res) => {
  const id = req.params.courseId;
  try{
  const course = await Course.findOne({ _id : id});
  const username = req.user.username;
  const user = await User.findOne({username});
  if(user){
    let check = false;
    for(let char of user.purchasedCourses){
      if(char == id){
        check = true;
        break;
      }
    }
    if(check){
      res.status(400).json({message: 'Course is already purchased'});
    }
    else{
      user.purchasedCourses.push(course);
      await user.save();
      res.status(201).json({message:'Course purchased successfully'})
   }
  }
  else{
    res.status(401).send({message: 'User does not exist'});
   }
}
  catch(err){
    res.status(400).json({'message': "Course is not found"});
  }
});

app.get('/users/purchasedCourses', authenticateUser, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (user) {
    res.status(200).json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.get('/users/courses/:id',authenticateUser,async(req,res) => {
  const id = (req.params.id);
  const course = await Course.findById(id);
  if(course){
    res.status(201).json(course);
  }
  else{
  res.status(401).send("No courses found");
  }
})

app.listen(port, () => console.log('Server running on port 3000'));

