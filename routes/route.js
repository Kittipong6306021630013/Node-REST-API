const express = require('express')
const router = express.Router()

//เรียกใช้งานโมเดล
const User = require('../models/user')
const multer = require('multer')
const { redirect, get } = require('express/lib/response')

//middleware
const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
    return res.redirect('/login');
    }
    next()
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/img/users')
    },
    filename: (req, file, cb) => {
        cb(null, 'file-' + Date.now() + '.' +
        file.originalname.split('.')[file.originalname.split('.').length-1])}
})
const upload = multer({ storage: storage })



//upload image and save in db
router.post('/upload',upload.single('ktb'),(req,res) => {
  console.log(req.file)
  const user_id = req.body.update_id
  const user = {
      image:req.file.filename
  }
  User.findByIdAndUpdate(user_id,user,{userFindAndModify:false}).exec(err=>{
        res.redirect('/elec_payment_ktb2')
  })
})

router.post('/upload-ktp',upload.single('ktp'),(req,res) => {
    console.log(req.file)
    const user_id = req.body.update_id
    const user = {
        image:req.file.filename
    }
    User.findByIdAndUpdate(user_id,user,{userFindAndModify:false}).exec(err=>{
        res.redirect('/elec_payment_ktp2')
    })
})
 
router.post('/upload-scb',upload.single('scb'),(req,res) => {
    console.log(req.file)
    const user_id = req.body.update_id
    const user = {
        image:req.file.filename
    }
    User.findByIdAndUpdate(user_id,user,{userFindAndModify:false}).exec(err=>{
        res.redirect('/elec_payment_scb2')
    })
})
  

//index
router.get('/',isLoggedIn,(req,res)=>{
    res.render('index',{user:req.session.user})
})


//create user
router.post('/register', async (req, res) => {
    const user = new User({
        userID: req.body.userID,
        password : req.body.password,
        name : req.body.name,
        room : req.body.room,
        elec_use:req.body.elec_use,
        roomate:req.body.roomate,
        Status: req.body.Status,
        image : req.body.image
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
        }catch (err) {
        res.status(400).json({ message: err.message })
        }
})


//login
router.get('/login',(req,res)=>{
    res.render('login')
})

//login post
router.post('/login',async (req, res) => {
    const{userID,password} = req.body
    const user = await User.findOne({
        userID,
        password
    })
    if (user){
        req.session.user = user
        return res.render('index',{user})
    }else{
        return res.render('login')
    }
})


router.get('/repass',(req,res)=>{
    res.render('repassword')
})

router.post('/repass',async (req,res) => {
    const email = req.body.email
    const user = await User.findOne({
        userID : email
    })
    if(user){ 
        req.user = user
        return res.render('repassword-end',{user})
    }else{
        return res.render('repassword')
    }
})


router.get('/repass-end',(req,res)=>{
    res.render('repassword-end',{user})

})


router.post('/repass-end',async (req,res) => {
    const repass = req.body.new_password
    const repass1 = req.body.new_password1
    const Updatepass = await User.findOne({
        _id : req.body.update_id,
        password : req.body.password
    })
   
    if(Updatepass){
        if(repass == repass1){
            const update = {
                password:repass
            }
            User.findByIdAndUpdate(req.body.update_id,update,{userFindAndModify:false}).exec(err=>{
                res.redirect('/repass-sucess')
            })
        
        }else{
            console.log("password not same")
        }
    }else{
        console.log("Password inccorrect")
    }
   
})

router.get('/repass-sucess',(req,res)=>{
    res.render('repassword-sucess')
})

router.get('/navbar',(req,res)=>{
    res.render('navbar',{user:req.session.user})
})

//views  
router.get('/elec_bills',isLoggedIn,(req,res)=>{
    res.render('elec-bills',{user:req.session.user})
})

router.get('/elec_payment',isLoggedIn,(req,res)=>{
    res.render('elec-payment',{user:req.session.user})
})

router.get('/elec_payment_ktb',isLoggedIn,(req,res)=>{
    res.render('elec-bills_krungthai',{user:req.session.user})
})

router.get('/elec_payment_ktb1',isLoggedIn,(req,res)=>{
    res.render('elec-bills_krungthai_1',{user:req.session.user})
})


router.get('/elec_payment_ktb2',isLoggedIn,(req,res)=>{
    res.render('elec-bills_krungthai_2',{user:req.session.user})
})

router.get('/elec_payment_ktp',isLoggedIn,(req,res)=>{
    res.render('elec-bills_krungthep',{user:req.session.user})
})

router.get('/elec_payment_ktp1',isLoggedIn,(req,res)=>{
    res.render('elec-bills_krungthep_1',{user:req.session.user})
})

router.get('/elec_payment_ktp2',isLoggedIn,(req,res)=>{
    res.render('elec-bills_krungthep_2',{user:req.session.user})
})

router.get('/elec_payment_scb',isLoggedIn,(req,res)=>{
    res.render('elec-bills_thaipanich',{user:req.session.user})
})

router.get('/elec_payment_scb1',isLoggedIn,(req,res)=>{
    res.render('elec-bills_thaipanich_1',{user:req.session.user})
})

router.get('/elec_payment_scb2',isLoggedIn,(req,res)=>{
    res.render('elec-bills_thaipanich_2',{user:req.session.user})
})

router.get('/logout',(req,res)=>{
    req.session = null
    res.redirect('/login')
})

module.exports = router