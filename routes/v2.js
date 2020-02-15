const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

// cors요청 허용 -> 비밀키 노출로 다른 도메인들이 API서버에 요청할 수 있다는 문제가 있음
// router.use(cors());
// 위 한줄은 아래 주석코드와 같은 역할을 한다. 아래 방식은 미들웨어의 작동 방식을 커스터마이징하고 싶을 때 하는 방법이다.
// router.use((req, res, next) => {
//   cors()(req, res, next);
// });

router.use(async (req, res, next) => {
  // 도메인 모델로 클라이언트의 도메인req.get('origin')과 호스트가 일치하는 것이 있는지 검사
  const domain = await Domain.findOne({
    where: { host: url.parse(req.get('origin')).host },
  });
  if(domain) {
    // origin 속성에 허용할 도메인만 따로 적어줬다. * 처럼 모든 도메인을 허용하는 대신 기입한 도메인만 허용한다.
    cors({ origin: req.get('origin') })(req, res, next);
  } else {
    next();
  }
});

router.post('/token', apiLimiter, async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ['nick', 'id'],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
      });
    }
    const token = jwt.sign({
      id: domain.user.id,
      nick: domain.user.nick,
    }, process.env.JWT_SECRET, {
      expiresIn: '30m', // 30분
      issuer: 'nodebird',
    });
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

router.get('/test', verifyToken, apiLimiter, (req, res) => {
  res.json(req.decoded);
});

router.get('/posts/my', apiLimiter, verifyToken, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
    .then((posts) => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    });
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: '검색 결과가 없습니다',
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

module.exports = router;