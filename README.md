# MealPlanana

MealPlanana is a MERN Stack web app that allows users to share recipes and plan out their meals on a calendar.  
It is currently being hosted [here](https://mealplanana.herokuapp.com/).

# Table of contents

- [Features](#features)
- [Technologies](#technologies)
- [Local Setup](#setup)
- [Credit](#credit)
- [More info](#more-info)

# Features

- View recipes + search via recipe title, tag, or author
- Create new recipes
- Rate recipes
- Add recipes to a meal + customize meal details
- View all meals in calendar

# Technologies

- React v17.0.1
- Redux v4.0.5 (to store state)
- Node v15.11.0
- Express v4.17.1
- MongoDB Atlas (to store data)
- ESLint v7.20.0 (to keep code clean)
- AWS S3 bucket (to store images)
- Heroku (to host/deploy app online)

# Setup

If you haven't already, download [node](https://nodejs.org/en/download/).

> Node comes with npm (Node Package Manager) which is used to download necessary packages/dependencies, and allows you to run the program.

### Installing packages to your local machine

First [clone](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) the repository to your local machine, and install the necessary packages with the `npm i` command. (`npm i` is short for _npm install_. If `npm i` doesn't work, try using `npm ci`)

> You may find it easier to have two terminals open at once so you can run the frontend and backend at the same time.

#### For the frontend:

```shell
$ cd MealPlanana/frontend
$ npm i
```

#### And likewise for the backend:

```shell
$ cd MealPlanana/backend
$ npm i
```

### Adding the config file

At this point, you should have all the packages needed to run the program.

However, you will still need to create/edit the file `MealPlanana/backend/src/config.js`. The contents of this file contains [Redux](https://www.smashingmagazine.com/2018/07/redux-designers-guide/) variables as well as the credentials for the _MongoDB Cluster_ and _AWS Bucket_. The file might look something like this:

```js
export const {
  PORT = 5000,
  NODE_ENV = "development",

  MONGO_URI = "mongodb+srv://<username>:<password>@<host>[:port]/<db>[?options]",

  SESS_NAME = "<sessionName>",
  SESS_SECRET = "<sessionPassword>",
  SESS_LIFETIME = <time>,

  AWS_BUCKET_NAME = "<bucket>",
  AWS_ACCESS_KEY_ID = "<key-id>",
  AWS_SECRET_ACCESS_KEY = "<bucket-key>",
  AWS_REGION = "<region>",
  AWS_Uploaded_File_URL_LINK = "https://s3-<region>.amazonaws.com/<bucket>/",
} = process.env;
```

For security purposes, the `config.js` file does not include our actual database credentials. Only authorized users are given this information.

A workaround would be to create your own [cluster](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/) and [bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html), and to insert your credentials to the `config.js` file.

> Note: Another alternative is to store all data locally, which would involve changing some code.

### Run the program

Now we are ready to start running!

#### In the backend folder, run

```shell
$ npm run dev
```

which, according to our `package.json` file, is equivalent to

```shell
$ nodemon index.js
```

> (For more info about nodemon, click [here](https://www.npmjs.com/package/nodemon))

#### In the frontend folder, run

```shell
$ npm start
```

This should open a page on your default web browser, and after everything loads, the app should be ready to use! Go bananas with it!

# Credit

A Winter 2021 CS 97 project, taught by Professor Eggert at UCLA.  
Made by: Joshua Aymett, Alex Haddad, Joshua Lee, Ivan Ma, and Bryce Stulman

# More info

Interested in learning how to do this yourself? Here are some resources we found helpful:

- [Web App Ideas](https://www.freecodecamp.org/news/every-time-you-build-a-to-do-list-app-a-puppy-dies-505b54637a5d/)
- [Building a Basic MERN App](https://codingthesmartway.com/the-mern-stack-tutorial-building-a-react-crud-application-from-start-to-finish-part-1/)
- [Intro to Redux](https://www.youtube.com/watch?v=93p3LxR9xfM)
- [Group Collaboration Organization Tool](https://trello.com/)
- And lastly, Medium articles and Stack Overflow posts are your best friend!

Happy Coding!
