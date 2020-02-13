const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email }});
        if(exUser){
            req.flash('joinError','이미 가입된 이메일입니다.');
            return res.redirect('/join');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    }catch(error){
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        // login에 제공하는 user객체가 serializeUser로 넘어간다.
        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
});

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout(); // req.user객체를 제거
    req.session.destroy();
    res.redirect('/');
});

/**
 * /auth/kakao로 접근하면 카카오 로그인과정이 시작됨
 * /auth/kako에서 카카오 로그인창으로 리다이렉트를 하고,
 * 결과를 /auth/kakao/callback으로 받는다.
 * 
 * 로컬과 다른점: authenticate메서드에 콜백 함수를 제공하지 않는다.
 * 카카오 로그인은 내부적으로 req.login을 호출하므로 직접호출할 필요x
 * 
 */
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    // 실패했을때 이동위치
    failureRedirect: '/',
}), (req, res) => {
    // 성공했을때 이동위치
    res.redirect('/');
})

module.exports = router;