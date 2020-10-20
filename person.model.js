module.exports = (sequelize, Sequelize) => {
    const Person = sequelize.define('person', {	
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        age: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        work: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {
        timestamps: false
    })

    return Person
}