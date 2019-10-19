const express = require("express");
const mongodb = require("mongodb");
const bcrypt = require("bcryptjs");
const port = process.env.PORT;
const jwt_key = process.env.jwt_key;

const jwt = require("jsonwebtoken");
const dataB = "BUU";
const col_name = "users";
const env = "./db";
const auth = require("./auth");

const app = express();
app.use(express.json());

// console.log(`MONGODB_URL: ${process.env.MONGODB_URL}`)
app.post("/register", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let studenId = req.body.studentId;
  let EncryptPW = await bcrypt.hash(req.body.password, 8);

  const o = {
    name: name,
    email: email,
    studenId: studenId,
    password: EncryptPW
  };
  const client = await require(env);

  const db = client.db(dataB);
  const result = await db
    .collection(col_name)
    .insertOne(o)
    .catch(err => {
      /***************************** */
      console.error(`Cannot Isert data to user collection : ${err}`);
      res.status(400).json({ error: err });
      console.log(`insert result: ${result}`);
      return;
    });
  let r = { _id: o._id, name: o.name, email: o.email, studenId: o.studenId };
  res.status(201).json(r);
});

app.post("/sign-in", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  const client = await require(env);
  let db = client.db(dataB);
  let user = await db
    .collection(col_name)
    .findOne({ email: email })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  if (!user) {
    res.status(400).json({ error: user });
    return;
  }
  let token = await jwt.sign({ email: user.email, id: user._id }, jwt_key);
  // let passwordIsValid = await bcrypt.compare(password,user.password)
  // if(!passwordIsValid){
  //     res.status(401).json({error : `Username or Password not match`})
  //     return
  // }
  res.status(200).json({ token: token });
});

app.get("/me", auth, async (req, res) => {
  let decoded = req.decoded;

  const client = await require(env);
  let db = client.db(dataB);
  let user = await db
    .collection(col_name)
    .findOne({ _id: mongodb.ObjectID(decoded.id) })
    .catch(err => {
      console.error(`Cannot find data to user collection : ${err}`);
      res.status(500).json({ error: err });
    });
  if (!user) {
    res.status(400).json({ error: `User not found` });
    return;
  }
  delete user.password;
  res.json(user);
});

app.put("/me", auth, async (req, res) => {
    let decoded = req.decoded;
    const client = await require(env);
    let db = client.db(dataB);
    let user = await db
      .collection(col_name)
      .updateOne({ _id: mongodb.ObjectID(decoded.id)} , {$set : {"email" : req.body.email}})
      .catch(err => {
        console.error(`Cannot Update Email : ${err}`);
        res.status(500).json({ error: err });
      });
    if (!user) {
      res.status(400).json({ error: `Id not found` });
      return;
    }
    res.json(user);
  });
  

app.listen(port, () => {
  console.log(`Auth API listening on port ${port}!`);
}); // start server
