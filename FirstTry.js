const express = require("express");
const app = express();
const port = 8080;

const { google } = require("googleapis");
const request = require("request");
const cors = require("cors");
const urlParse = require("url-parse");
const queryParse = require("query-string");
const bodyParser = require("body-parser");
const axios = require("axios");


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.get("/getURLTing", (req, res)=> {
    const oauth2Client = new google.auth.OAuth2(
        //client id
        "967871350507-cq3v79nugrlp77sfs16l1jui33226g12.apps.googleusercontent.com",
        //client secret
        "XjI_BU1JIk454RAZNwPzHMwY",
        //Link to redirect
        "http://localhost:8080/"
    );
        const scopes = ["https://www.googleapis.com/auth/fitness.activity.read profile email openid"]

        const url = oauth2Client.generateAuthUrl({
            acces_type: "offline",
            scope: scopes,
            states: JSON.stringify({
                callbackUrl: req.body.callbackUrl,
                userID: req.body.userID   
            })
        })
        request(url,(err, response,body)=> {
            console.log("error: ", err);
            console.log("statusCode: ", response && response.statusCode);
            res.send({ url });
        })
});

app.get("/steps", async (req, res) => {
    const queryURL = new urlParse(req.url);
    const code = queryParse.parse(queryURL.query).code;
    const oauth2Client = new google.auth.OAuth2(
        //client id
        "967871350507-cq3v79nugrlp77sfs16l1jui33226g12.apps.googleusercontent.com",
        //client secret
        "XjI_BU1JIk454RAZNwPzHMwY",
        //Link to redirect
        "https://localhost:8080/"
    );

    const tokens = await oauth2Client.getToken(code);
    console.log(tokens);
})


app.get("/ting",(req, res) => res.send("Ping"));
app.listen(port, () => console.log('Escutando' +" "+ port));