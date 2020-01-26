# DEPRECATED. We use CDK in this house, now! Left around for posterity
cd build
rm deploy.zip
zip -r deploy.zip index.js
echo "/-------------------------"
echo "|UPLOADING TO LAMBDA LAND|"
echo "-------------------------/"
aws lambda update-function-code --function-name $1 --zip-file fileb://./deploy.zip