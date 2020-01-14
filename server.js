const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const path = require('path')
const cors = require('cors')

const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')
const posts = require('./routes/api/posts')
const notes = require('./routes/api/notes')
const tags = require('./routes/api/tags')
const mediums = require('./routes/api/mediums')

const mongooselogs = require('./logs/mongoose')
const morganLogs = require('./logs/morgan')
const chalk = require('chalk')

const passport = require('passport')
const mongoose = require('mongoose')

const app = express()

require('dotenv').config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const DBURI = require('./config').DBURI
const port = process.env.PORT || 5000

mongoose.connect(DBURI, { useNewUrlParser: true }
).then(() => console.info(chalk.blue(`[mongo] mongo ✓`))
).catch(err => console.error(chalk.red(err)))

morganLogs()
mongoose.set('debug', mongooselogs)
app.use(cors())
app.use(helmet())

app.use(passport.initialize())
require('./routes/passport')(passport)

app.use("/", express.static(path.join(__dirname, 'client', 'build')))
app.use(require('method-override')())

app.use('/api', users)
app.use('/api/tags', tags)
app.use('/api/notes', notes)
app.use('/api/profiles', profiles)
app.use('/api/mediums', mediums)
app.use('/api/posts', posts)

app.listen(port, () => console.info(chalk.blue((`[express] port: ${port} ✓`))))
