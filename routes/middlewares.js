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