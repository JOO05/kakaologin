const express = require('express');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const { makeToken } = require('../../utill/jwt.js');
const { auth } = require('../../middleware/auth.js');
const alertmove = require('../../utill/alertmove.js');

const router = express.Router();

const kakaoOpt = {
  clientId: process.env.KAKAO_REST_API_KEY,
  redirectUri: process.env.REDIRECT_URI,
};

router.get('/kakao', (req, res) => {
  const kakaoLoginURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoOpt.clientId}&redirect_uri=${kakaoOpt.redirectUri}&response_type=code`;
  res.redirect(kakaoLoginURL);
});

router.get('/kakao/callback', async (req, res) => {
  let token;
  try {
    const url = 'https://kauth.kakao.com/oauth/token';
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: kakaoOpt.clientId,
      redirectUri: kakaoOpt.redirectUri,
      code: req.query.code,
    });
    const header = { 'content-type': 'application/x-www-form-urlencoded' };
    const response = await axios.post(url, body, header);
    token = response.data.access_token;

  } catch (err) {
    console.log(err);
    console.log('에러1');
    res.send('에러1');
  }

  try {
    const url = 'https://kapi.kakao.com/v2/user/me';
    const Header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(url, Header);
    console.log(response.data)
    const { email } = response.data.kakao_account;
    
    const payload = { email };
    const accessToken = makeToken(payload);
    const cookiOpt = { maxAge: 1000 * 60 * 60 * 24 };
    res.cookie('accessToken', accessToken, cookiOpt);

    res.send(alertmove('/', `${email}님 로그인 되었습니다^^`));
  } catch (err) {
    console.log(err);
  }
});

router.get('/info', auth, (req, res) => {
  const { user } = req;

  res.render('info.html', { user });
});

module.exports = router;