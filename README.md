                     
<h1 style="font-weight: bold;">FakeLibre</h1>

<p>
- <a href="#tech">Technologies</a>
- <a href="#started">Getting Started</a>
- <a href="#routes">API Endpoints</a>
- <a href="#colab">Collaborators</a>
- <a href="#contribute">Contribute</a> 
</p>


<p> FakeLibre is a backend ecommerce project for Coderhouse's backend programming course.</p>

<a href="https://fakelibre-coderhouse-deploy-production.up.railway.app/">Deploy on Railway</a>
 
<h2 id="technologies">Build with: </h2>

Node.js with Express, MongoDB and Mongoose.
Passport, Multer, Nodemailer, Socket.io
pdfkit, Winston, Faker, Chai & Supertest, Nodemon, Mocha, and more.
Swagger for documentation
 
<h2 id="started">🚀 Getting started</h2>

Clone this project.

```bash
git https://github.com/allthingsmustpass/fakelibre-ecommerce.git
```
 
<h3>Config .env variables</h2>

Configure the `.env` file.

```yaml
NODE_ENV=development     #development | production
PORT=port
MONGO_URI=mongoDBurl
SECRET=yoursecret
GITHUB_APP_ID=id
GITHUB_CLIENT_ID=client
GITHUB_CLIENT_SECRET=secret-git
APPLICATION_KEY=yourAppKey
NODEMAILER_HOST=yourHost
```
 
<h3>Nodemailer host</h3>

You can use Gmail <a href="https://support.google.com/accounts/answer/185839?hl=en&co=GENIE.Platform%3DAndroid" 2-Step Verification </a> to send emails. After activating it, generate an application password and paste it in the `APPLICATION_KEY` variable.


<h3>Install dependencies</h3>

Run `npm install`.


<h3>Starting</h3>

To start the project, just run:

```bash
cd fakelibre-ecommerce
npm start
```