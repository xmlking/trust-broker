## Trust Broker - JWT Issuer

Multi Identity Provider / Broker - take username/password, APIKey, Facebook or Google identity; issue **JSON Web Token.**


### Features 

1. Support authenticate strategies ranging from 
  1. verifying a username and password with DB or LDAP
  2. delegated authentication using OAuth or 
  3. federated authentication using OpenID Connect.
2. Account locking 
  1. user's account will be "locked" after some number of consecutive failed login attempts.
  2. user's account will become unlocked once a sufficient amount of time has passed.
  3. system will expose the reason for a failed login attempt to the application.
  
### Prerequisite 

```bash
# install MongoDB
brew install mongodb

# install Node
brew install node

# install Babel
npm install -g babel

# generate public and private keys for JWT
openssl genrsa -out  .ssh/auth.rsa 1024
openssl rsa -in .ssh/auth.rsa -pubout > .ssh/auth.rsa.pub

# generate ssl key and cert for HTTPS
openssl genrsa 1024 > .ssh/server.pem

openssl req -new -key .ssh/server.pem -out .ssh/csr.pem
openssl x509 -req -days 365 -in .ssh/csr.pem -signkey .ssh/server.pem -out .ssh/server.crt
```

### Getting Started

1. To start the MongoDB 

    ```bash
    mongod -f data/mongod.yml
    ```
    
2. To start the server.
    
    ```bash
    npm start
    # to run with dev env settings
    NODE_ENV=DEV npm start
    # to run with prod env settings
    NODE_ENV=PROD npm start
    ```
    
### Test

```bash
$ curl localhost:8080/api/v1/users
# You don't have a signed token dude :(
$ curl -X POST -H "Content-Type: application/json" localhost:8080/auth/login -d '{"username": "admin", "password": "admin"}'
# {"token": "verylongtokenstring :)"}
$ curl -X POST -H "Authorization: Bearer verylongtokenstring :)" localhost:8080/api/v1/users -d '{"username": "sumo", "password": "sumo"}'
# You are logged in dude! Welcome!
```

verify signature at http://jwt.io/

### Development 
create `config/local.yml` file to keep your sensitive config data for local development environment. 

*Don't check-in this file into Source Code Control System.*

```yml
# mongodb
mongo:
  options:
#    user: myUserName
#    pass: myPassword

# Passport
passport:
  facebook:
    clientID: 1231231313
    clientSecret: fsfsfsfsfsfsfsf
    callbackURL: https://localhost:8443/auth/facebook/callback
```

### Tips

Use Chrome [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop) for REST API testing.

Since you are using self-signed SSL Certs, first try to access URL in chrome first and accept the cert, before trying in Postman.  