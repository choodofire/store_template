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
$ docker build -t vinylshop .

# run
$ docker run -p 3000:3000 --name vinylshop vinylshop
```

```docker-compose
# build
$ docker-compose build

# up
$ docker-compose build
```