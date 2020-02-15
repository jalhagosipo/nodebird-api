const jwt = require('jsonwebtoken');

/**
 * 로그인 여부를 검사하는 미들웨어
 * passport는 req객체에 isAuthenticated 메서드를 추가함
 */

exports.isLoggedIn = (req, res, next) => {
    if ( req.isAuthenticated()){
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        next();
    } else {
        res.redirct('/');
    }
}

/**
 * 토큰 검증 미들웨어
 */

exports.verifyToken = (req, res, next) => {
    try {
        // 요청 헤더에 저장된 토큰을 사용
        // 사용자가 쿠키처럼 헤더에 토큰을 넣어 보냄
        // verify함수로 토큰을 검증
        // 비밀키가 일치하지 않는다면 인증을 받을 수 없음
        // 유효기간이 지난경우도 catch로 이동
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        // 인증에 성공한 경우 토큰의 내용을 반환.
        // 토큰내용 : 사용자아이디, 닉네임, 발급자, 유효기간 등
        // 다음 미들웨어에서 쓸 수 있도록 반환
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') { // 유효기간 초과
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다',
        });
    }
};