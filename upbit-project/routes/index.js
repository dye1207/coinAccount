var express = require("express");
var router = express.Router();

const axios = require("axios");
const { v4 } = require("uuid");
const { sign } = require("jsonwebtoken");
const secret = require("../config/secret");


const access_key = secret.upbit_access_key
const secret_key = secret.upbit_secret_key;
const server_url = secret.upbit_server_url;

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const payload = {
      access_key: access_key,
      nonce: v4(),
    };

    const token = sign(payload, secret_key);

    const options = {
      method: "GET",
      url: server_url + "/v1/accounts",
      headers: { Authorization: `Bearer ${token}` },
    };

    const upbitRes = await axios(options);

    res.json(upbitRes.data);
  } catch (error) {
    console.log("error: ", error);
    res.sendStatus(500);
  }
});

router.get("/current-price", async function (req, res, next) {
  try {
    const payload = {
      access_key: access_key,
      nonce: v4(),
    };

    const token = sign(payload, secret_key);
    
    console.log('req.query: ', req.query);
    const url = server_url + `/v1/ticker?markets=${req.query.marketList}`
    // const url = server_url + `/v1/ticker?markets=KRW-ETH,KRW-ETC,KRW-DOGE,KRW-XEM,KRW-NEO,KRW-ADA,KRW-TRX,KRW-GAS,KRW-HIFI,KRW-IQ,KRW-VET,KRW-BTT,KRW-ORBS`
    console.log('url: ', url);
    // 'https://api.upbit.com/v1/ticker?markets=KRW-BTC
    const options = {
      method: "GET",
      url,
      headers: { Authorization: `Bearer ${token}` },
    };

    const upbitRes = await axios(options);

    res.json(upbitRes.data);
  } catch (error) {
    // console.log("error: ", error);
    res.sendStatus(500);
  }
});
// https://api.upbit.com/v1/market/all
router.get("/market-all", async function (req, res, next) {
  try {
    const payload = {
      access_key: access_key,
      nonce: v4(),
    };

    const token = sign(payload, secret_key);
    
    const options = {
      method: "GET",
      url: server_url + "/v1/market/all",
      headers: { Authorization: `Bearer ${token}` },
    };

    const upbitRes = await axios(options);

    res.json(upbitRes.data);
  } catch (error) {
    console.log("error: ", error);
    res.sendStatus(500);
  }
});

module.exports = router;
