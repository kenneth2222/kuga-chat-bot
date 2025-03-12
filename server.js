const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json()) 
require('dotenv').config()

const {GoogleGenerativeAI} = require('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY)

app.post('/gemini', async (req, res) => {
//    console.log(req.body.history)
//    console.log(req.body.message)

//    const model = genAI.getGenerativeModel({model: "gemini-pro"})
   const model = genAI.getGenerativeModel({model: "gemini-1.5-pro"})
    const chat = model.startChat({
        history: req.body.history,
        message: req.body.message
    })

    const msg = req.body.message

    const result = await chat.sendMessage(msg)
    const response = result.response.text();
    //const text = response.text()
    //res.send(text)
    res.send(response)
})

app.get('/list-models', async (req, res) => {
    try {
        const models = await genAI.listModels();
        res.json(models);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))