const client = require("./client").client


async function createUser(userName, password) {
    const createUserQuery = `
    INSERT INTO users (email, password)
    VALUES ('${userName}', '${password}')
    `;

    await client.query(createUserQuery, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data insert successful');
        client.end();
    });
}

async function findUser(userName){
    var findUserQ = `select * from user where userName = ${userName}`
    var user = await client.query(findUserQ, (err, res) => {
        if (err) {
            console.error(err);
            return [];
        }
    });
    return user
}



module.exports = {
    createUser,
    findUser
}