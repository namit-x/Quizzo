import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Details from './models/details.js'
import Questions from './models/Questions.js'
import Image from './models/Image.js'
import multer from 'multer'
import dotenv from 'dotenv'

const storage = multer.memoryStorage();
const upload = multer({ storage });
dotenv.config()


await mongoose.connect(process.env.MONGO_URI_INFO_ATLAS)

const connectQNA = async () => {
  try {
    const QNAdb = await mongoose.createConnection(process.env.MONGO_URI_QNA_ATLAS);

    const QNACollection = await QNAdb.collection('QNA');

    // Format the questions and insert them
    const formattedQuestions = Questions.map((question) => ({
      question: question.question.value,
      optionA: question.optionA.value,
      optionB: question.optionB.value,
      optionC: question.optionC.value,
      optionD: question.optionD.value,
      solution: question.solution.value,
      interest: question.interest,
    }));

    await QNACollection.deleteMany({});
    await QNACollection.insertMany(formattedQuestions);

    // Return a custom object with findMany functionality
    return {
      findMany: async (query = {}) => {
        return await QNACollection.find(query).toArray();
      },
      findOne: async (query = {}) => {
        return await QNACollection.findOne(query);
      },
      QNACollection, // Include the original collection if additional operations are needed
    };
  } catch (err) {
    console.log('Database Error: ', err);
    return null;
  }
};

export const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// Signup route
app.post('/api/signup', async (req, res) => {
  let data = req.body

  let exists = await Details.findOne({ username: data.username }).exec()
  if (exists) {
    res.send('There\'s already an account with these details.')
  }
  else {
    let credentials = new Details(data)
    try { await credentials.save() } catch (err) { console.log(err) }

    res.send('Success')
  }
})

// Login route
app.post('/api/login', async (req, res) => {
  let data = req.body

  // console.log('This is the received data: ',data)
  let exists = await Details.findOne({ username: data.username }).exec()
  // console.log('This is the data in DB: ',exists)
  if (!exists) {
    res.send('Incorrect Credentials')
  }
  else {
    if (data.password === exists.password) {
      res.send('Match Found')
    }
    else if (data.password != exists.password) {
      res.send('Incorrect password')
    }
  }
})

// Dashboard/After login route
app.post('/api/dashboard', async (req, res) => {
  let key = req.body
  let user = await Details.findOne({ username: key.user }).exec()
  res.json(user)
})

app.post('/api/questions', async (req, res) => {
  let domain = req.body.domain;

  let QNAdb = await connectQNA()

  let questions = await QNAdb.findMany({ interest: domain })
  res.send(questions)
})

// Image upload route
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;

    let data = { name: originalname, data: buffer, contentType: mimetype }
    data.userID = req.body.userID
    const newImage = new Image(data);

    await newImage.save();

    res.status(200).send('Image uploaded and saved to the database!');
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Failed to upload image');
  }
});

// Image Reterival route
app.post('/api/reterive', async (req, res) => {
  let key = req.body;
  try {
    let userPhoto = await Image.findOne({ userID: key.user }).exec()
    if (userPhoto) {
      res.set('Content-Type', userPhoto.contentType);
      res.status(200).send(userPhoto.data)
    }
    else {
      res.status(404).send('Image not found');
    }
  }
  catch (err) {
    console.log(err)
  }
})

// Marked Questions
app.post('/api/markedQuestions', async (req, res) => {
  try {
    let ansByUser = req.body
    let marks = 0

    let QNAConnection = await connectQNA()
    let ansSheet = []
    for (let i = 0; i < ansByUser.length; i++) {
      let key = ansByUser[i].question
      let mcq = await QNAConnection.findOne({ question: key })
      let que = { question: mcq.question, answer: mcq.solution }
      ansSheet.push(que)
    }

    for (let i = 0; i < ansByUser.length; i++) {
      if (ansSheet[i].answer == ansByUser[i].marked) {
        marks++
      }
      // console.log(`Right Answer: ${ansSheet[i].answer} Your Answer: ${ansByUser[i].marked}`)
    }
    res.send(`${marks}`)
  }
  catch (err) { console.log(err) }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
