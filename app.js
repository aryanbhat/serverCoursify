import express from 'express'
import jwt from "jsonwebtoken"
import cors from "cors"
import mongoose, { Mongoose, Schema } from 'mongoose'
const app = express();
app.use(express.json());
app.use(cors());



mongoose.connect("mongodb+srv://arynabhat329:lameloball@cluster0.w7zpswg.mongodb.net/COURSIFY",{ useNewUrlParser:"true", useUnifiedTopology:"true"});

const port =  process.env.PORT || 3000;
// Read data from file, or initialize to empty array if file does not exist

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

const SECRETADMIN = 'e6e1ed755963a7724b8b1c16c6a18f66c51f1c9cf02d240ea28fae6da1969d96a9c11d91f63750a32afe463ad968ee747553447b018b655e7bbe6279998fa299';
const SECRETUSER = '1c9dd059646391984d1466bd6e9ed16c40c149c92c1f785170f409d9121ec13e88963c619fb18446e86534bd5b98db2d154bb1e53ae245fa5db889e335712aa2'
const Admin = mongoose.model('Admin',adminSchema);
const User = mongoose.model('User',userSchema);
const Course = mongoose.model('Course',courseSchema);

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRETADMIN, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const authenticateUser = (req, res, next)=> {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRETUSER, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

app.get('/',(req,res)=>{
  res.json({"message":"Coursify deployed successfully"});
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
    const token = jwt.sign({ username, role: 'admin' }, SECRETADMIN, { expiresIn: '1h' });
    res.json({ message: 'Admin created successfully', token });
  }
});
app.post('/admin/login', async(req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({username,password});
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SECRETADMIN, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.post('/admin/courses', authenticateJwt, async(req, res) => {
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json({ message: 'Course created successfully',courseId:newCourse.id,username:req.user});
});

app.get('/admin/courses', authenticateJwt, async(req, res) => {
  const courses = await Course.find({});
  res.json({ courses });
});

app.get('/admin/courses/:id',authenticateJwt,async(req,res) => {
  const id = (req.params.id);
  const course = await Course.findById(id);
  if(course){
    res.status(201).json(course);
  }
  else{
  res.status(401).send("No courses found");
  }
})
app.put('/admin/courses/:courseId', authenticateJwt, async(req, res) => {
  const course  = await Course.findByIdAndUpdate(req.params.courseId,req.body,{new: true})
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});




app.delete('/admin/courses/:courseId', authenticateJwt, async(req,res) => {
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
    const token = jwt.sign({ username, role: 'user' }, SECRETUSER, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', async(req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({username});
  if (user) {
    const token = jwt.sign({ username, role: 'user' }, SECRETUSER, { expiresIn: '1h' });
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

export default app;