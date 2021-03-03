const {MongoClient} = require('mongodb');
//https://blog.crowdbotics.com/build-chatbot-dialogflow-nodejs-webhooks/
const express = require('express')
// will use this later to send requests
const http = require('http')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	res.status(200).send('Server is working.')
})


app.post('/getUniversityQuestion', (req, res) => {
	const questionToSearch =
		req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.question
			? req.body.result.parameters.question
			: ''

	const reqUrl = encodeURI(
		`mongodb+srv://ebizdom:VL93iD4V26A3XUJC@cluster0.th7ff.mongodb.net/store?retryWrites=true&w=majority`
	)
	http.get(
		reqUrl,
		responseFromAPI => {
			let completeResponse = ''
			responseFromAPI.on('data', chunk => {
				completeResponse += chunk
			})
			responseFromAPI.on('end', () => {
				const questions = JSON.parse(completeResponse)
				console.log(questions)
				let dataToSend = questionToSearch
				dataToSend = `${questions.question} was released in the year ${questions.answer}. It is directed by ${
					questions.question
				} and stars ${questions.question}.
                }`

				return res.json({
					fulfillmentText: dataToSend,
					source: 'UniversityQuestion'
				})
			})
		},
		error => {
			return res.json({
				fulfillmentText: 'Could not get results at this time',
				source: 'UniversityQuestion'
			})
		}
	)
})

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`)
})
