module.exports = (sequelize, DataTypes) => (
    sequelize.define('user',{
        email: {
            type: DataTypes.STRING(40),
            allowNull: true,
            unique: true,
        },
        nick: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local', // local이면 로컬로그인, kakao면 카카오로그인
        },
        snsId: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
    },{
        // createdAt, updatedAt, deletedAt 컬럼도 생성하도록 아래 조건 추가
        timestamps: true,
        paranoid: true,
    })
);