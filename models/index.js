const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Domain = require('./domain')(sequelize, Sequelize);

// user와 post는 1:N 이므로. 시퀄라이즈는 post모델에 userid컬럼을 추가함
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);
// post와 hashtag는 N:M
// N:M -> 중간에 관계 테이블이 생성됨. 시퀄라이즈가 분석하여 PostHashtag라는 이름으로 테이블을 자동생성함. 컬럼은 postId와 hashtagId
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
// 같은 테이블끼리도 N:M
// 같은 테이블일 때는 모델이름과 컬럼이름을 따로 정해줘야함
// through 옵션으로 생성할 모델이름을 Follow로 함.
// as 는 시퀄라이즈가 join 작업시 사용하는 이름.
// as를 바탕으로 getFollowings, addFollower등 메서드를 자동추가함.
db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers',
  through: 'Follow',
});
db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings',
  through: 'Follow',
});

// 사용자 한명이 여러 도메인을 소유할 수도 있기 때문에 일대다
db.User.hasMany(db.Domain);
db.Domain.belongsTo(db.User);

module.exports = db;