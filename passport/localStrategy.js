const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const { User } = require('../models');


/**
 * 아래 과정을 거쳐 done이 호출된 후에는 다시 passport.authenticate의 콜백 함수에서 나머지 로직이 실행된다.
 */
module.exports = (passport) => {

  passport.use(new LocalStrategy({
    // 필드에는 req.body의 속성명을 적어주면된다.
    // req.body.email에 이메일이, req.body.password에 비밀번호가 담겨들어오므로 각각 email과 password를 넣음
    usernameField: 'email',
    passwordField: 'password',
    
    // 실제 전략을 수행하는 async함수
    // 위에서 넣어준 email과 password는 매개변수로 들어감
    // done함수는 passport.authenticate의 콜백함수
  }, async (email, password, done) => {
    try {
      // 디비에서 일치하는 이메일이 있는지 찾는다.
      const exUser = await User.findOne({ where: { email } });
      
      // 있다면,
      if (exUser) {
        // bcrypt의 compare함수로 비밀번호를 비교한다.
        const result = await bcrypt.compare(password, exUser.password);

        // 비밀번호가 일치한다면,
        if (result) {

          // 사용자정보를 넣어서 보낸다.
          // 두번째인자를 사용하지 않는 경우는 로그인에 실패했을 때뿐
          done(null, exUser);
        } else {

          // 세번째 인자는 사용자 정의 에러가 발생하였을때 사용
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      // 서버에서 에러가 발생했을 경우 done의 첫번째 인자를 사용
      done(error);
    }
  }));
};