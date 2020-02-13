const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {

  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID, // 카카오에서 발급해주는 아이디
    callbackURL: '/auth/kakao/callback', // 카카오로부터 인증 결과를 받을 라우터 주소
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const exUser = await User.findOne({ where: { snsId: profile.id, provider: 'kakao' } });
      if (exUser) {
        // 기존에 카카오로 로그인한 사용자인지 조회 후 있다면 done호출
        done(null, exUser);

      } else {

        // 없다면, 회원가입 진행
        // 인증후 callbackURL에 적힌 주소로 accessTocken, refreshToken,profile을 보내줌
        const newUser = await User.create({
          email: profile._json && profile._json.kaccount_email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};