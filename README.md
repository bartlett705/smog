Notes
- [ ] Lambda execution role
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:CreateLogGroup",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "sns:Publish",
                "dynamodb:PutItem"
            ],
            "Resource": [
                "arn:aws:sns:us-west-2:907905092719:smog",
                "arn:aws:dynamodb:us-west-2:907905092719:table/smog"
            ]
        }
    ]
}
- [x] Lambda -> SNS
- [x] Lambda -> Dynamo
    (see code)
- [x] API Gateway -> Lambda
        Used API gateway template - need to go back and see if I can simplify by only specifying POST
- [x] SNS -> Email
        subscribe via console
- [x] DynamoDB table
        Create table w/ composite primary key hash (S) and createdAt (N)
        https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey