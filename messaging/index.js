const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const cors = require('cors')
require('dotenv').config()

mongoose.connect(process.env.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(() => console.log('Database connexion error'))

const messageSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now },
})
const Message = mongoose.model('Message', messageSchema)
const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ origin: 'https://andritiana.tech' }))

app.post('/', async (req, res) => {
    console.log(req.body)
    try {
        const { fullname, email, message } = req.body
        await new Message({ fullname, email, message }).save()
        res.redirect('/')
    } catch (error) { res.status(500).send('Erreur lors de l\'enregistrement du message.') }
})

app.get('/', async (req, res) => {
    try { res.render('messages', { messages: await Message.find().sort({ date: -1 }) }) }
    catch (error) { res.status(500).send('Erreur lors de la requête du message.') }

})

app.listen(3000, () => console.log('Serveur démarré sur le port 3000'))
