module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define('customer', {	
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        age: {
            type: Sequelize.INTEGER
        },
        address: {
            type: Sequelize.STRING
        },
        work: {
            type: Sequelize.STRING
        }
    })

    return Customer
}