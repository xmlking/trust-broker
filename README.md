## OAuth - JWT Server

Multi Identity Provider - OAuth, JSON Web Token, Facebook, Google 

### Prerequisite 
```bash
# install MongoDB
brew install mongodb

# install Node
brew install node

# install Babel
npm install -g babel

# generate public and private keys for JWT
openssl genrsa -out  ~/.ssh/oauth.rsa 1024
openssl rsa -in ~/.ssh/oauth.rsa -pubout > ~/.ssh/oauth.rsa.pub
```

### Getting Started

1. To start the MongoDB 

    ```bash
     mongod -f data/mongod.yml
    ```
    
2. To start the server.
    
    ```bash
    npm start
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