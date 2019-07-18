"use strict";
const doc = require("dynamodb-doc");
const dynamo = new doc.DynamoDB();
const AWS = require("aws-sdk");

exports.handler = (event, context, callback) => {
  // console.log('Received event:', JSON.stringify(event, null, 2));

  // Code template courtesy of AWS Tutorials 👍
  const done = err => {
    if (err) {
      console.error(err);
    }

    return callback(null, {
      statusCode: err ? "400" : "200",
      body: err ? "something went wrong 😭" : "ok 👍",
      headers: {
        "Content-Type": "text/plain; charset=utf8"
      }
    });
  };

  switch (event.httpMethod) {
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
      break;
    case "POST":
      handlePost(event, done);
  }
};

function handlePost(event, done) {
  let parsedBody = {};
  try {
    parsedBody = JSON.parse(event.body);
  } catch (e) {
    done(e);
  }

  const name = parsedBody.name || "An Anonymous Hacker";
  const email = parsedBody.email || "fake@protonmail.com";
  const company = parsedBody.company || "";
  const phone = parsedBody.phone || "";
  const message = parsedBody.message || "";

  var sns = new AWS.SNS();
  const snsParams = {
    Message: templateMessage({ name, email, company, phone, message }),
    Subject: `[smog] ${name} sent you a message.`,
    TopicArn: "arn:aws:sns:us-west-2:907905092719:smog"
  };

  console.log("created snsParams:", JSON.stringify(snsParams, null, 2));

  // 'callback hell' :lul:
  // funny how you get spoiled (by async/await in this case).
  sns.publish(snsParams, err => {
    if (err) {
      done(err);
    }
    console.log("Published to SNS topic.");

    const dynamoParams = {
      TableName: "smog",
      Item: {
        hash: "a",
        createdAt: Date.now(),
        name: name,
        email: email,
        company: company,
        phone: phone,
        message: message
      }
    };

    console.log("created dynamoParams:", JSON.stringify(dynamoParams, null, 2));
    dynamo.putItem(dynamoParams, done);
  });
}

const templateMessage = ({ name, email, company, phone, message }) => `
Name: ${name}
Email: ${email}
${company && `Company: ${company}`}
${phone && `Phone: ${phone}`}
Message: "${message}"
`
