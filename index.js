const express = require('express')
require('dotenv').config()
const app = express()
const path = require('path')
const User = require('./models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected '))
  .catch((err) => console.log(err))

app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extented: true }))

app.get('/', (req, res) => {
  res.send('home')
})

app.get('/register', (req, res) => {
  res.render('register')
})
app.post('/register', async (req, res) => {
  if (req.body.email) {
    req.body.phone == null
  } else req.body.email == null

  const { password, username, email, phone } = req.body
  const hash = await bcrypt.hash(password, 12)

  const user = new User({
    username,
    password: hash,
    email,
    phone,
  })

  await user.save()
  res.redirect('/login')
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.get('/edit', (req, res) => {
  res.render('edit.ejs')
})

app.get('/forget', (req, res) => {
  res.render('forget.ejs')
})

//LOGIN POST
app.post('/register', async (req, res) => {
  console.log(req.body)
  if (req.body.email) {
    await User.find({ email: req.body.email })
      .then((data) => {
        if (req.body.password == data.password) {
          req.session.user = data
          res.redirect('/register')
        }
      })
      .catch((e) => {
        console.log(e)
        res.send('error')
      })
  }
  //   } else
  if (req.body.phone) {
    await User.find({ phone: req.body.phone })
      .then((data) => {
        if (req.body.password == data.password) {
          req.session.user = data
          res.redirect('/register')
        }
      })
      .catch((e) => {
        console.log(e)
        res.send('error')
      })
  } else res.send('Enter your username password')
})

app.post('/updateuser/:id', async (req, res) => {
  console.log('Updating')
  await User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        email: req.body.email,
        password: req.body.password,
      },
    },
    { new: true }
  )
    .then((result) => {
      console.log(result)
      if (result) {
        console.log('UserUpdated')
        res.redirect('/signin')
      } else {
        res.send('error')
      }
    })
    .catch((e) => {
      res.send('error in catch')
    })
})
app.post('/deleteuser/:id', async (req, res) => {
  await User.findOneAndDelete({ _id: req.params.id })
    .then((result) => {
      if (result) {
        console.log('User deleted')
        res.redirect('/login')
      } else {
        res.send('error')
      }
    })
    .catch((e) => {
      console.log(e)
      res.send('error in catch')
    })
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})
