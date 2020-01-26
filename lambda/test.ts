#! /usr/bin/env ts-node

import { Lambda } from 'aws-sdk'

const lambda = new Lambda({ region: 'us-west-2' })

/**
 * Invokes the lambda created by a SmogStack for testing, or whatever.
 * The test.curl file is a better "test" because it actually makes an http request and
 * goes through the API gateway.
 */
async function testSmogStackInProd() {
  const params: Lambda.InvocationRequest = {
    // replace with your generated function name after running npm run deploy.
    FunctionName: 'SmogStack-AutoSmogFunctionsmogdemo2973E593-17UQ9IJLMC78L',
    Payload: JSON.stringify({
      httpMethod: 'POST',
      body: Object.entries({
        name: 'TimmyTypescriptTestScript',
        attending: true,
        message: 'sdk Invocation looks good 👍'
      })
        .map((entry) => entry.join('='))
        .join('&')
    })
  }

  console.log('Lambda invoke params:', params)

  lambda.invoke(params, (err, data) => {
    if (err) {
      console.error(err)
    }

    console.info('Invocation done! Lambda returned:')
    console.log(data)
  })
}

testSmogStackInProd()
