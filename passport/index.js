const local = require('./localStrategy'); // 로컬 로그인 전략 파일
const kakao = require('./kakaoStrategy'); // 카카오 로그인 전략 파일
const { User } = require('../models');

/**
 * serializeUser : 사용자 정보 객체를 세션에 아이디로 저장
 * deserializeUser : 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것
 * => 세션에 불필요한 데이터를 담아두지 않기 위한 과정
 * 
 * 1. 로그인요청이 들어옴
 * 2. passport.authenticate메서드 호출
 * 3. 로그인 전략 수행
 * 4. 로그인 성공 시 사용자 정보 객체와 함께 req.login호출
 * 5. req.login 메서드가 passport.serializeUser 호출
 * 6. req.session에 사용자 아이디만 저장
 * 7. 로그인 완료
 * 
 * 로그인이후
 * 1. 모든 요청에 passport.session()미들웨어가 passport.deserializeUser메서드 호출
 * 2. req.session에 저장된 아이디로 디비에서 사용자 조회
 * 3. 조회된 사용자 정보를 req.user에 저장
 * 4. 라우터에서 req.user 객체 사용 가능
 * 
 * *전략* passport는 로그인 시의 동작을 전략이라는 용어로 표현하고 있다.
 * (로그인전략파일 : 로그인 과정을 어떻게 처리할지 설명하는 파일)
 */
module.exports = (passport) => {

    // req.session객체에 어떤 데이터를 저장할지 선택
    // user를 받아 done함수에 두번째인자로 user.id를 넘김
    // done의 첫번째 인자는 에러발생시 사용하는것
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 매요청시 실행됨
    //passport.session()미들웨어가 이 메서드를 호출
    passport.deserializeUser((id, done) => {
        User.findOne({
                where: { id },
                include: [{
                    model: User,
                    attributes: ['id', 'nick'], // 실수로 비밀번호를 조회하는 것을 방지하기 위해서
                    as: 'Followers',
                },{
                    model: User,
                    attributes: ['id','nick'],
                    as: 'Followings',
                }],
            }) // serializeUser에서 세션에 저장했던 아이디를 받아 디비에서 사용자 정보를 조회
            .then(user => done(null, user)) // 조회한정보를 req.user를 통해 로그인한 사용자의 정보를 가져올 수 있음
            .catch(err => done(err));
    });

    local(passport);
    kakao(passport);
};