const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const mongoose = require("mongoose");
const authConfig = require("./src/auth_config.json");
const User = require('./models/user');

const app = express();

const port = process.env.PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

if (
  !authConfig.domain ||
  !authConfig.audience ||
  authConfig.audience === "YOUR_API_IDENTIFIER"
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

app.get("/api/external", checkJwt, async (req, res) => {
  try {
    const { user: _user } = req;
    const email = _user['https://example.com/email']
    const dbModel = mongoose.model('User');
    const user = await dbModel.findOne({ email });
    // const user = await dbModel.findOneAndUpdate({ email }, { $push: { logins: { $each: [new Date()] , $slice: -30 } } }, { upsert: true });

    res.json(user);
  } catch (e) {
    console.log('Error: ' + e);
    res.send({ error: e });
  }
});

const dbUrl = 'mongodb+srv://zero2herouser:zero2heropass@cluster0.stmd8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose.connect(dbUrl, options).then(() => {
  console.info('Connected to MongoDB');
  app.listen(port, () => {
    console.info(`Listening to port ${port}`);
  });
});
