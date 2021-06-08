import { Injectable } from '@angular/core';
import * as AWSCognito from "amazon-cognito-identity-js";
import { Variables } from "./variables"

@Injectable({
  providedIn: 'root',
})
export class CognitoServiceService {
  poolData = new Variables().PARAMS.COGNITO_POOL;
  constructor() {}

  signUp(username, password, phone) {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this.poolData);

      let userAttribute = [];
      userAttribute.push(
        new AWSCognito.CognitoUserAttribute({
          Name: 'phone_number',
          Value: phone,
        })
      );

      userPool.signUp(
        username,
        password,
        userAttribute,
        null,
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolved(result);
          }
        }
      );
    });
  }

  confirmUser(verificationCode, userName) {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this.poolData);

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: userName,
        Pool: userPool,
      });

      cognitoUser.confirmRegistration(
        verificationCode,
        true,
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolved(result);
          }
        }
      );
    });
  }

  resendConfirmationCode(userName) {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this.poolData);

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: userName,
        Pool: userPool,
      });

      cognitoUser.resendConfirmationCode(function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolved(result);
        }
      });
    });
  }

  authenticate(username, password) {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this.poolData);

      const authDetails = new AWSCognito.AuthenticationDetails({
        Username: username,
        Password: password,
      });

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: username,
        Pool: userPool,
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          console.log('onSuccess');
          resolved(result);
        },
        onFailure: (err) => {
          reject(err);
        },
        mfaRequired: (result) => {
          console.log('mfaRequired');
          resolved(result);
        },
        newPasswordRequired: (userAttributes) => {
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.

          // the api doesn't accept this field back
          // userAttributes.email = email;
          // delete userAttributes.email_verified;
          console.log('newPasswordRequired');
          cognitoUser.completeNewPasswordChallenge(password, userAttributes, {
            onSuccess: (result) => {
              resolved(result);
            },
            onFailure: function (error) {
              reject(error);
            },
          });
        },
      });
    });
  }

  sendMFACode(verificationCode, userName) {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this.poolData);

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: userName,
        Pool: userPool,
      });

      cognitoUser.sendMFACode(verificationCode, {
        onSuccess: (result) => {
          console.log('onSuccess');
          resolved(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  getCurrentUser() {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this.poolData);

      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            if (session.isValid()) {
              resolved(session);
            } else {
              console.log(
                "CognitoUtil: Got the id token, but the session isn't valid"
              );
              reject();
            }
          }
        });
      }
    });
  }

  isAuthenticated() {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this.poolData);
      let cognitoUser = userPool.getCurrentUser();

      if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
          if (err) {
            reject(err);
          } else {
            resolved(session.isValid());
          }
        });
      } else {
        resolved(false);
      }
    });
  }

  signOut() {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this.poolData);
      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser != null) {
        cognitoUser.signOut();
        resolved(true);
      } else {
        reject();
      }
    });
  }
}
