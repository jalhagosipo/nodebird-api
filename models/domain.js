module.exports = (sequelize, DataTypes) => (
    sequelize.define('domain', {
        // 인터넷 주소
      host: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      // 도메인 종류
      type: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      // 클라이언트 비밀키 : API를 사용할 때 필요한 비밀키
      clientSecret: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
    }, {
        // 데이터를 추가로 검증하는 속성
      validate: {
          // unknownType 이라는 검증기를 만듬
          // free, premium 둘 중 하나만 선택할 수 있음
        unknownType() {
          console.log(this.type, this.type !== 'free', this.type !== 'premium');
          if (this.type !== 'free' && this.type !== 'premium') {
            throw new Error('type 컬럼은 free나 premium이어야 합니다.');
          }
        },
      },
      timestamps: true,
      paranoid: true,
    })
  );