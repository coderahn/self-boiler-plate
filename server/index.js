const express     = require('express')
const app         = express()
const port        = 5000

const bodyParser  = require('body-parser');
const cookieParser = require('cookie-parser');
const {User}      = require('./models/User');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

const config = require('./config/key');
const {auth} = require('./middleware/auth');

//몽구스 접속
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://ash:1234@boilerplate.wgilg.mongodb.net/boilerplate?retryWrites=true&w=majority',{
  useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.get('/api/hello', (req, res) => {
  res.send('안녕하세요~')
})

//계정 등록
app.post('/api/users/register',(req,res) => {
  const user = new User(req.body);

  user.save((err,userInfo) => {
    if(err) return res.json({success:false, err})
    return res.status(200).json({
      success: true,
      fromRouter : true
    })
  });
})

//계정 로그인
app.post('/api/users/login', (req,res) => {
  //{User}랑 User랑 뭔차이일까?
  User.findOne({email:req.body.email},(err,user) => {
    if(!user){
      return res.json({
        loginSuccess : false,
        message : "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    user.comparePassword(req.body.password,(err,isMatch) => {
      if(!isMatch)
        return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})
        user.generateToken((err,user) => {
          if(err) return res.status(400).send(err);

          res.cookie("x_auth",user.token)
          .status(200).json({loginSuccess:true, userId : user._id})
        })
    })
  })
})

//Auth 라우터
app.post('/api/users/auth', auth, (req,res)=>{
  console.log("auth라우터");
  res.status(200).json({
    _id : req.user._id,
    isAdmin : req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastname : req.user.lastname,
    role : req.user.role,
    image : req.user.image
  })
})

//로그아웃 라우터
app.get('/api/users/logout', auth, (req,res) => {
  User.findOneAndUpdate({_id : req.user._id}
    ,{token : ""}
    ,(err, user) => {
      if(err) return res.json({success:false, err})
      return res.status(200).send({
        success:true,
        userId : user._id
      })
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

