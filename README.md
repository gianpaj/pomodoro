## Screenshots



# Week 1

## 1. Local development setup

Clone the repository from the brach of the first week

    git clone --branch w1.1-setup git@github.com:gianpaj/pomodoro.git

Install NPM dependencies

    npm install

Run the web server

    node app.js

(optiona) Install `nodemon` to automatically restart the node app when a file is updated

    npm install nodemon --global

Run nodemon

    nodemon app.js

## 2. Eslint

This are the style rules for this project (`.eslintrc.json`). Remember everything is subjective and susceptible to taste.

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
├── gulpfile.js
├── package.json
├── public
│   ├── css
│   │   └── main.css
│   └── js
│       └── main.js
├── test
│   └── app.js
└── views
    ├── home.jade
    └── layout.jade
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