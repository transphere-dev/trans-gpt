
# TransGPT

TransGPT is a GPT-powered comimc translation tool for tranlators to improve their efficiency by automating certain steps in their workflow.



## Tech Stack

**Client:** React, Next.js (13) , Chakra UI

**Server:** Node.js (v16.17.1), Python (3.10)

**Database:** PostgreSQL


## Features

- GPT chat
- Glossary translation
- Translation
- OCR Text extraction
- Speech bubble detection
- DeepL translation
- Google Translate


## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file

Read more on Environment variables in Next.js 13 [here](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)

```
OPENAI_API_KEY = xxxxxx
NEXT_PUBLIC_SERVER_URL = xxxxxx
NEXT_PUBLIC_PORT = xxxxxx
NEXT_PUBLIC_VERSION_DATE = Aug 2
DATABASE_URL=
PORT=
EMAIL_VERIFICATION_SECRET=
EMAIL_FROM=
EMAIL_USER=
EMAIL_PASSWORD=
SECRET_KEY=
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/John-Oula/trans-gpt
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

Install python packages

```bash
  pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/
```

Start the Next.js development server

```bash
  cd .. && npm run dev
```


Open a new terminal and start the backend server

```bash
  cd server && node app.js
```


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


## Usage/Examples
### Translation, Chat and Glossary modules
![image](https://github.com/John-Oula/trans-gpt/assets/44803250/afbe3271-cf28-4b86-8e70-6004b1c99642)

### GPT Chat functionality
![image](https://github.com/John-Oula/trans-gpt/assets/44803250/a06127bd-a7cc-4f59-bd93-0515c0b650c1)

### Glossary translation with GPT & highlighting

![image](https://github.com/John-Oula/trans-gpt/assets/44803250/c889a929-dabc-454b-b539-df8907f8ec0f)

### Same translation without glossary
![image](https://github.com/John-Oula/trans-gpt/assets/44803250/1d6c83b6-614e-4dc4-9394-6e9a683fc454)

### OCR Comic speech bubble text extraction translation with GPT-4
![image](https://github.com/John-Oula/trans-gpt/assets/44803250/f14f5556-73b0-4243-ba48-e89dddd01b51)

### System message design interface
![image](https://github.com/John-Oula/trans-gpt/assets/44803250/4c85f4ef-1b60-4213-8dea-c11e78b71330)

### System message output example
In the screenshot below, an additional requirement was added to instruct GPT to give an analysis of its translations. This show's that GPT's output is greatly influenced by system message and prompt design.

![image](https://github.com/John-Oula/trans-gpt/assets/44803250/d68cc739-9c4e-4648-8e9c-7dbd9ab6aa85)



## Further Improvement

- More focus should be put in prompt engineering to realize better GPT output

- Improve the speed of batch OCR text extraction. 

- Add an admin management panel to manage glossaries preferrebly with [react-admin](https://marmelab.com/react-admin/NextJs.html)

- Develop a mechanism to count and control the number of tokens used, especially with the "Translate All" feature. Check this [repository](https://github.com/niieani/gpt-tokenizer)

- Support internationalization

- Support for `.rar` file upload and extraction. Currently supports .zip files

- [Fine-tuning](https://platform.openai.com/docs/guides/fine-tuning) GPT. Fine-tuning lets you get more out of the models available through the Open AI's API by providing:

    - Higher quality results than prompt design
    - Ability to train on more examples than can fit in a prompt
    - Token savings due to shorter prompts
    - Lower latency requests

## Authors

- [John Oula](https://www.github.com/John-Oula)


## Support

For support, email johnoula@antratechstudios.com.

