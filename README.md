## Trust Broker - JWT Issuer

Multi Identity Provider / Broker - take username/password, APIKey, Facebook or Google identity; issue **JSON Web Token.**

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

### Tips

Use Chrome [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop) for REST API testing.