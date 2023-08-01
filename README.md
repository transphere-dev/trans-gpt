
# TransGPT

TransGPT is a GPT-powered comimc translation tool for tranlators to improve their efficiency by automating certain steps in their workflow.



## Tech Stack

**Client:** React, Next.js (13) , Chakra UI

**Server:** Node.js (v16.17.1), Python (3.10)

**Database:** PostgreSQL


## Environment Variables

To run this project, you will need to add the following environment variables to your `.env.development` file

```
OPEN_API_KEY = xxxx
NEXT_PUBLIC_SERVER_URL = 
NEXT_PUBLIC_PORT = 
```
Server environment variables `server/.env`

```
DATABASE_URL= xxxx
PORT=8080
EMAIL_VERIFICATION_SECRET = xxxx
EMAIL_FROM = xxxx
EMAIL_USER = xxxxxx
EMAIL_PASSWORD = xxxx
SECRET_KEY = xxxxxxx
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/transphere-dev/trans-gpt
```

Go to the project directory

```bash
  cd trans-gpt
```

Install dependencies

```bash
  npm install 
```
Go to the server directory and install dependencies

```bash
  cd server && npm install
```

Start the Next.js development server

```bash
  cd .. && npm run dev
```


Open a new terminal and start the backend server

```bash
  cd server && node app.js
```


## Features

- GPT chat
- Glossary translation
- Translation
- OCR Text extraction
- Speech bubble detection
- DeepL translation
- Google Translate


## Deployment

To deploy this project run

```bash
 npm install pm2 -g
 cd trans-gpt
```
Build the app
```bash
  npm run build
```
Start pm2
```bash
  pm2 start ecosystem.config.js
  pm2 save
```


## Authors

- [John Oula](https://www.github.com/John-Oula)


## Further Improvement

- Experiment on Prompt design

- Improve batch OCR text extraction

- Add a management panel to manage gloassaries preferrebly with react-admin

- Develop a mechanism to control and limit the number of tokens used, especially with the "Translate All" feature

- Support internationalization

- Support for `.rar` file upload and extraction


## Support

For support, email johnoula@antratechstudios.com.

