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
        "https://localhost:8080/"
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
        "https://localhost:8080/steps"
    );
    const scopes = ["https://www.googleapis.com/auth/fitness.activity.read profile email openid"]

    const tokens = await oauth2Client.getToken(code);
    console.log(tokens);
    res.send("HELLO");

    let stepArray = [];

    try{
        const result = await axios({
            method: "POST",
            headers: {
                aythorization: "Bearer " + tokens.tokens.access_token
            },
            "Content-Type": "application/json",
            url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
            data: {
                aggregateBy:[{
                    dataTypeName: "com.google.step_count.delta",
                    dataSourceId: "derived:com.google.step_count.delta:com.google.andoid.gms:estimated_steps"
                }],
                bucketByTime: {durationMillis: 864000000},
                startTimeMillis: 1585785599000,
                endTimeMillis: 1585958399000,
            },
        });
        console.log(result);
    } catch (e){
        console.log(e);
    }
    try{
        for (const dataSet of stepArray){
            console.log(dataSet);
            for (const points of dataSet.dataSet){
                console.log(points);
            }
        }
    } catch (e){
        console.log(e);
    }
});


app.get("/ting",(req, res) => res.send("Ping"));
app.listen(port, () => console.log('Escutando' +" "+ port));