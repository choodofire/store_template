# store_template

A website template for listing products for sale. MongoDB is used for data storage.

## Installation

```bash
# set correct Node
$ nvm use $(cat nodeV)

$ npm install
```

## Running the app

```bash
# prod
$ npm run start

# development
$ npm run start:dev
```

```docker
# build
$ docker build -t store_example .

# run
$ docker run -p 3000:3000 --name store_example store_example
```

```docker-compose
# build
$ docker-compose build

# up
$ docker-compose build
```