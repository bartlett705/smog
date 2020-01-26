'use strict'
import { Callback, Context, Handler } from 'aws-lambda'
import AWS from 'aws-sdk'
const dynamo = new AWS.DynamoDB.DocumentClient()
import querystring from 'querystring'
import { Discord } from './discord'

const discord = new Discord(process.env.CHANNEL_ID, process.env.DISCORD_TOKEN, {
  content: 'Smog Lambda sent a message with no content 🤔'
})

const handler: Handler = (event, context: Context, callback: Callback) => {
  // console.log('Received event:', JSON.stringify(event, null, 2));

  // Code template courtesy of AWS Tutorials 👍
  const done: Callback = (err, rsvpStatus: boolean) => {
    if (err) {
      console.error()
      console.error('exited due to exception:', err)
      console.log('returning failure template')
    }

    return callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? failureTemplate() : succesTemplate(rsvpStatus),
      headers: {
        'Content-Type': 'text/html; charset=utf8'
      }
    })
  }

  switch (event.httpMethod) {
    default:
      done(new Error(`Unsupported http method "${event.httpMethod}"`))
      break
    case 'POST':
      handlePost(event, done)
  }
}

export interface RSVP {
  comment: string
  name: string
  attending: string
  message: string
}
function handlePost(event: { body: string }, done: Callback) {
  console.log('raw body:', event.body)

  let parsedBody: Partial<RSVP> = {}
  try {
    parsedBody = querystring.parse(event.body)
  } catch (e) {
    done(e)
    return
  }

  console.log('parsed body:', JSON.stringify(parsedBody, null, 2))

  if (parsedBody.comment && parsedBody.comment.length) {
    // super minimal anti-bot protection
    done(new Error('Honeypot field had nonzero length; bailing.'))
  }

  // assumed to be a select element.
  const attending = parsedBody.attending === 'true' ? true : false
  // dynamo gets mad if you insert empty strings, it seems? So, we set some defaults.
  const name = parsedBody.name || 'An Anonymous Coward'
  const message = parsedBody.message || 'None.'

  const dynamoParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      hash: 'a',
      createdAt: Date.now(),
      createdAtISO: new Date().toISOString(),
      name,
      attending,
      message
    }
  }

  console.log('created dynamoParams:', JSON.stringify(dynamoParams, null, 2))
  dynamo.put(dynamoParams, (dynamoErr) => {
    const dataString = templateMessage({
      name,
      attending,
      message
    })
    if (dynamoErr) {
      discord.postMessage({
        content: `Error writing to dynamo! ${dataString}`
      })
      done(dynamoErr)
    } else {
      console.log('Wrote to DynamoDB')
      discord.postMessage({ content: `RSVP Received :tada: ${dataString}` })
    }
    done(null, attending)
  })
}

/** renders data into a nice string for the discord message */
const templateMessage = ({
  name,
  attending,
  camping,
  partySize,
  message
}: {
  [i: string]: string | number | boolean
}) => `
**Name**: ${name}
**Attending?** ${attending ? 'Yes' : 'No'}
**Message:** "${message}"
`

/** renders a success landing page */
const succesTemplate = (rsvpStatus: boolean) =>
  pageTemplate(
    `<h2>🎊 Thanks for RSVPing 🎊</h2>
      <h4> ${
        rsvpStatus
          ? '🎉 See you in the desert! 🎉'
          : 'We will miss you at the party!'
      } </h4>`,
    'https://shindig.mosey.systems'
  )

/** renders an error landing page */
const failureTemplate = () =>
  pageTemplate(
    "<h4>Whoops, something went wrong.</h4><h5>Sorry about that. Maybe try again? Otherwise I probably bungled something. Email me at <a href=mailto:shindig@mosey.systems>shindig@mosey.systems</a></h5> and we'll get it sorted.",
    'https://shindig.mosey.systems/contact'
  )

/** renders html for a 'landing page' to serve in response to form POST request */
const pageTemplate = (children: string, returnLink: string) =>
  `<html>
  <head>
    <title>Stance Industries Merger</title>
  <style>
    body {
      font-family: sans-serif;
      background-color: #ff6700;
      color: #713327;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    footer {
      position: relative;
      top: 5rem;
    }
  </style>
  </head>
    <body>
      ${children}
      <footer>
      <a href="${returnLink}">Back to the site</a>
      </footer>
    </body>
  </html>`

export { handler }
