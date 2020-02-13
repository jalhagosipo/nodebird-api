module.exports = (sequelize, DataTypes) => (
    sequelize.define('post',{
        content: {
            type: DataTypes.STRING(140),
            allowNull: false,
        },
        img: { // 이미지 경로
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    },{
        timestamps: true,
        paranoid: true,
    })
);
// 게시글 등록자의 아이디를 담은 컬럼은 나중에 관계를 설정할 때 시퀄라이즈가 알아서 생성해줌