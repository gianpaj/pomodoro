## Screenshots



# Week 4

## New packages

none

## New instructions

### Install MongoDB

1. Follow these instructions:

    https://www.mongodb.org/downloads

2. Start mongod process:

        mongod

## 1. Local development setup

Clone the repository from the branch of the third week

    git clone --branch w4 git@github.com:gianpaj/pomodoro.git

Install NPM dependencies

    npm install

Run the web server

    node app.js

(optional) Install `nodemon` to automatically restart the node app when a file is updated

    npm install nodemon --global

Run nodemon

    nodemon app.js

## 2. Eslint

This is the style rules for this project (`.eslintrc.json`). Remember everything is subjective and susceptible to taste.

```
$ eslint --init
? How would you like to configure ESLint? Answer questions about your style
? Are you using ECMAScript 6 features? No
? Where will your code run? Node, Browser
? Do you use CommonJS? Yes
? Do you use JSX? No
? What style of indentation do you use? Spaces
? What quotes do you use for strings? Single
? What line endings do you use? Unix
? Do you require semicolons? Yes
? What format do you want your config file to be in? JSON
```

### Directory Structure
```
.
├── LICENSE
├── README.md
├── app.js
├── config
│   └── passport.js
├── gulpfile.js
├── models
│   └── User.js
├── package.json
├── public
│   ├── css
│   │   └── main.css
│   └── js
│       └── main.js
├── test
│   └── app.js
└── views
    ├── flash.jade
    ├── home.jade
    ├── layout.jade
    ├── login.jade
    └── register.jade
```

### Testing
```
$ npm test

> pomodoro@1.1.0-setup test /temp/pomodoro
> PORT=2000 mocha --reporter spec --timeout 5000



Express server listening on port 2000 in development mode
Open your browser at http://localhost:2000
  GET /
    ✓ should return 200 OK (476ms)

  GET /wr0ngUrl
    ✓ should return 404


  2 passing (494ms)
```
