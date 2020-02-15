const express = require('express');
const uuidv4 = require('uuid/v4');
const { User, Domain } = require('../models');

const router = express.Router();

router.get('/', (req, res, next) => {
  // Error: WHERE parameter "id" has invalid "undefined" value
  // 위 에러가발생. where에서 undefined가 안 들어가는 문제.
  User.findOne({
    where: { id: req.user && req.user.id  || null },
    include: { model: Domain },
  })
    .then((user) => {
        // 루트로 접속시 로그인화면을 보여줌
      res.render('login', {
        user,
        loginError: req.flash('loginError'),
        domains: user && user.domains,
      });
    })
    .catch((error) => {
      next(error);
    });
});

// 폼으로부터 온 데이터를 도메인 모델에 저장
router.post('/domain', (req, res, next) => {
  Domain.create({
    userId: req.user.id,
    host: req.body.host,
    type: req.body.type,
    clientSecret: uuidv4(),
  })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;