# A Node.js project using restify, mongoose and JWT

> CRUD with relational database

## So in a nutshell

  > Setting models (relational DB)

  > Protecting routes using JWT

  > Hashing password before saving


## How to use
  
  Make sure to set up a ".env" config file to set up variables like 
  
    
```bash
NODE_ENV = development
PORT = 3000
BASE_URL =  http://localhost:3000
MONGODB_URI =  mongodb+srv://<username>:<passwor>XXXXXX
JWT_SECRET = XXXX
ALLOWED_URL = the url of access
```
  then run these commands 
  
```bash
npm i

npm start

#with nodemon (restart server with every save)
npm run dev

```

