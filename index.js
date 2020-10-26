const express = require('express')
const path = require('path');
const app = express()
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, "/public")))

app.use(bodyParser.urlencoded({ extended: false }));

let credentials = [];

app.post("/login_route", (req, res) => {
  console.log(req.body);
  console.log(`tried to login with url params ${req.body.userName} and ${req.body.password}`);

  let credential = credentials.find(c => c.userName == req.body.userName);
  if (!credential) {
    console.log("There is no user with that name");
    return res.redirect("/index.html?error=Invalid credentials");
  }
  let valid = bcrypt.compareSync(req.body.password, credential.hash);
  if (!valid) {
    console.log("That password does not match");
    return res.redirect("/index.html?error=Invalid credentials");
  }

  res.sendFile(path.join(__dirname, '/private/private.html'));

})

app.post("/create_route", (req, res) => {
  console.log(req.body);
  let userName = req.body.userName;
  let password = req.body.password;

  if(credentials.find(c=>c.userName == userName)){
    console.log("That username is not available");
    return res.redirect("/index.html?error=That user name is not available")
  }


  let salt = bcrypt.genSaltSync(10);

  let hash = bcrypt.hashSync(password, salt);

  credentials.push({
    userName,
    password,
    salt,
    hash
  })

  console.log(credentials);

  res.redirect("/index.html")
})



app.listen(3000, () => console.log('Example app listening on http://localhost:3000'))

