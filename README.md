# Ionic App using AWS Cognito for Authentication (Includes MFA)

### setup

1. Create or Sign In to your AWS Cognito environment
2. Create an AWS Cognito User Pool
3. Add an App Client to the AWS Cognito User Pool created in step 2(above). Note: Make sure to uncheck the checkbox "Generate client secret".

### Ionic app setup
1. Clone repo: 'git clone https://github.com/b-jae-duncan/ionic5-cognito-example'
2. Copy the file variables.ts.sample to variables.ts and add the following: 
   * userPoolId: 'your-region_1gfVMWz3c',
   * clientId: 'your-client-id',
3. Open a terminal and navigate to the project folder and run
```bash
$ npm install
```
4. To run the Ionic App in the browser:

```bash
$ ionic serve --lab
```

