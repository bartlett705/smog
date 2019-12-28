'use strict'
import AWS from 'aws-sdk'
const dynamo = new AWS.DynamoDB.DocumentClient()
import querystring from 'querystring'

type Done = (err?: Error, cookieStrings?: string[]) => void

// tslint:disable-next-line: ban-types
exports.handler = (event: any, context: any, callback: Function) => {
  // console.log('Received event:', JSON.stringify(event, null, 2));

  // Code template courtesy of AWS Tutorials 👍
  const done: Done = (err) => {
    if (err) {
      console.error(err)
    }

    return callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? failureTemplate() : succesTemplate(),
      headers: {
        'Content-Type': 'text/html; charset=utf8'
      }
    })
  }

  switch (event.httpMethod) {
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`))
      break
    case 'POST':
      handlePost(event, done)
  }
}

function handlePost(event: { body: string }, done: Done) {
  console.log('raw body:', event.body)
  let parsedBody: Partial<{
    comment: string
    name: string
    email: string
    company: string
    phone: string
    message: string
  }> = {}
  try {
    parsedBody = querystring.parse(event.body)
  } catch (e) {
    done(e)
    return
  }

  console.log('parsed body:', JSON.stringify(parsedBody, null, 2))

  if (parsedBody.comment && parsedBody.comment.length) {
    done(new Error('Honeypot field had nonzero length; bailing.'))
  }

  const name = parsedBody.name || 'An Anonymous Hacker'
  const email = parsedBody.email || 'fake@protonmail.com'
  const company = parsedBody.company || "US Gov't."
  const phone = parsedBody.phone || '867-5309'
  const message = parsedBody.message || 'pongHi'

  const sns = new AWS.SNS()
  const snsParams = {
    Message: templateMessage({ name, email, company, phone, message }),
    Subject: `[smog] ${name} sent you a message.`,
    TopicArn: 'arn:aws:sns:us-west-2:721348449844:contact-form-submit'
  }

  console.log('created snsParams:', JSON.stringify(snsParams, null, 2))

  // 'callback hell' :lul:
  // funny how you get spoiled (by async/await in this case).
  sns.publish(snsParams, (err) => {
    if (err) {
      done(err)
    } else {
      console.log('Published to SNS topic.')
    }

    const dynamoParams = {
      TableName: 'contact-form',
      Item: {
        hash: 'a',
        createdAt: Date.now(),
        name,
        email,
        company,
        phone,
        message
      }
    }

    console.log('created dynamoParams:', JSON.stringify(dynamoParams, null, 2))
    dynamo.put(dynamoParams, (dynamoErr) => {
      if (dynamoErr) {
        done(dynamoErr)
      } else {
        console.log('Wrote to DynamoDB')
      }

      done(null)
    })
  })
}

/** renders data into a nice string for the SNS message */
const templateMessage = ({ name, email, company, phone, message }: { [i: string]: string}) => `
Name: ${name}
Email: ${email}
${company && `Company: ${company}`}
${phone && `Phone: ${phone}`}
Message: "${message}"
`

/** renders a success landing page */
const succesTemplate = () =>
  pageTemplate(`
<h4>Thanks for reaching out. We'll be in touch soon.</h4>
`)

/** renders an error landing page */
const failureTemplate = () =>
  pageTemplate(
    '<h4>Whoops, something went wrong.</h4><h5>Sorry about that. You can email us directly at contact@corvidsec.com</h5>'
  )

/** renders html for a 'landing page' to serve in response to form POST request */
const pageTemplate = (children: string) =>
  `<html>
  <head>
    <title>Thanks for visiting Corvid Security</title>
  <style>
    body {
      font-family: sans-serif;
      background-color: #0f0f0f;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    pre {
      background-color: 2a2a2a;
      border: 1px dotted black;
      border-radius: 0.25rem;
      padding: 0.5rem;
      max-width: 50%;
      margin-left: 1rem;
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
        <a href="https://www.corvidsec.com">Back to the site</a>
      </footer>
    </body>
  </html>`