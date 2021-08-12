"use strict";
// Created by Quan Le Trong (https://github.com/quanltsimple)
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const ssm = new AWS.SSM();

// Get parameter from AWS SSM
const getSecret = async (secretName) => {
  console.log(`Getting secret for ${secretName}`);
  const params = {
    Name: secretName, 
    WithDecryption: true
  };
  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};

exports.authorizer = async (event, context, callback) => {
  // Parse token from header with token Bearer eyJhbGciOixxxxx
  const token = event.authorizationToken.split(" ")[1];
  const methodArn = event.methodArn;

  if (!token || !methodArn) {
    return callback(null, "Unauthorized");
  }

  // Your parameter name in AWS SSM Parameter Store
  const secretName = "yourapp-parameter";
  const publicKey = await getSecret(secretName);

  let verified;
  try {
    // Verify Token with Algorithms
    // Change your algorithms: RS256, HS256, ....
    jwt.verify(token, publicKey.toString(), {algorithms: ["RS256"]});
    verified = true;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      //Processing error
    }
    console.log(JSON.stringify(e));
    verified = false;
  }

  if (verified) {
    callback(null, generatePolicy("me", "Allow", methodArn));
  }

  callback(null, generatePolicy("me", "Deny", methodArn));
};

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;

  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];

    const statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};
