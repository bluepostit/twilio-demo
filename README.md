# Twilio Demo

This demonstrates one-on-one video chat in a Rails app using Twilio.

## Install

```bash
git clone https://github.com/bluepostit/twilio-demo.git && cd twilio-demo
cp env-example .env
bundle install
yarn install
rails db:create db:migrate db:seed
```

## Configure

- Create an account at [Twilio](https://www.twilio.com)
- Visit the dashboard to create/find your account SID.
- Create an API key and API secret for your app [here](https://www.twilio.com/console/project/api-keys).
- Fill in the relevant values in your `.env` file.

## Run

- In order to test this app, you will need to access the server from two different devices (or to use two different webcams on the same device). There are two ways to do this:

### 1. Public deployment
You can deploy the app to a server which is publicly accessible, eg. on Heroku.

### 2. ngrok
Or you can use [ngrok](https://ngrok.com/) to create a secure temporary public tunnel to your running Rails application on `localhost`.
- Create an account on [ngrok.com](https://ngrok.com/)
- Follow the instructions to download and run `ngrok` on your computer.
- Follow the instructions to sign in (authenticate) with `ngrok`.
- Make sure your Rails app is running.
- In another terminal window, run:
    ```bash
    ngrok http 3000
    ```
- Examine the output from `ngrok`. You should see a few tunnel URLs listed. One of the URLs begins with **https**, something like `https://<some characters>.ngrok.io`. Open this URL in your second device (mobile phone's browser, other computer, etc.)
- When the page loads, you will see an error message from Rails explaining that the request was blocked for security reasons. Follow the instructions on the page to allow access to the temporary `ngrok` subdomain to your app. You will need to add the given line to the file `/config/environments/development.rb`, just before the final `end` in the file.

### Sign in
- You should now be able to access your app on your second device.
- Sign in on each device as a different user:
  - Bob - email: `bob@bob.com`, password: `123456`
  - Sue - email: `sue@sue.com`, password: `123456`

#### On each device:
- On the home page (`/`), you should see a link to the profile page of the other user(s). Bob will see a link to Sue's profile page, and vice versa. Click on the link.
- You should see a video call page. Click on the green 'Call' button to connect.
- Your browser should ask for permission to use your webcam for video and audio. Allow it.
- You should now be connected to yourself on a video call. You should see your own webcam's feed in a small box in the bottom-right corner of the video container, and your chat partner's webcam feed in the main part of the video container.
- Enjoy your chat!


---

Rails app generated with [lewagon/rails-templates](https://github.com/lewagon/rails-templates), created by the [Le Wagon coding bootcamp](https://www.lewagon.com) team.
