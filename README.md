# AR Studio game backend with Azure Functions [![Build Status](https://travis-ci.org/deadlyfingers/ARStudioAzureFunctions.svg?branch=master)](https://travis-ci.org/deadlyfingers/ARStudioAzureFunctions)

Note: [AR Studio](https://developers.facebook.com/products/ar-studio) requires a Mac so we everything here is written for Mac user, but everything should run ok on Windows once available.

## Prerequistes for testing and running localhost on Mac
- [Node 8.5.0 or better](https://nodejs.org/en/)
- [Azure Functions core tools for Mac](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local#brew)
- [MongoDB for running local db on Mac](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-community-edition)
- [ngrok for serving localhost as https (required for AR Studio)](https://ngrok.com/download)

## Test on device using localhost
1. Start mongodb  
  `mongod`
2. Start Azure Functions locally  
  `func host start --debug VSCode`
3. Start ngrok https server  
  `ngrok http 7071`
4. Clone the [AR Studio game project](https://github.com/deadlyfingers/ARStudioGame) and add your *ngrok domain* to whitelisted domains. (Refer to the [readme](https://github.com/deadlyfingers/ARStudioGame/blob/master/README.md) for config instuctions.)

## API
The API is available as [Postman collection](https://raw.githubusercontent.com/deadlyfingers/ARStudioAzureFunctions/master/postman_collection.json) which can be imported into [Postman app](https://www.getpostman.com/).
- LobbyCreate
- LobbyJoin
- MatchReady
- MatchStatus
- MatchTurn

## Testing 
`npm test`

## Deployment
1. Fork this repo
2. Sign in to [Azure portal](https://portal.azure.com)
2. Create new **Azure Function**
3. Once your **Azure Function** is provisioned then update your **Function app settings** to use **version 2 (beta)**
![azurefunctions-v2-beta](https://user-images.githubusercontent.com/1880480/43584718-1b5f9a5a-965b-11e8-8206-2910cefcfc9e.png)
4. Create new **Azure Cosmos DB** and select MongoDB from the API options. Once it's provisioned then select '**Connection String**' under **Settings** and copy your connection details including *HOST*, *PORT*, *USERNAME*, *PRIMARY PASSWORD* 
5. Back in your **Azure Function** add the following environment variables using your connection details:
    - **MongoDBHost**
    - **MongoDBPort**
    - **MongoDBUser**
    - **MongoDBPass**
6. To deploy your Function app select  
  **Platform Features > Deployment Options > Setup > GitHub**  
  and choose your forked repo.