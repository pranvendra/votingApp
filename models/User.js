const client = require("./client").client
const format = require('pg-format');


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
    // await client.connect()
    var findUserQ = format(`select * from public."user" where "userName" = '${userName}'`)
    console.log(findUserQ)
    var user = await client.query(findUserQ)
    return user.rows[0]
}



module.exports = {
    createUser,
    findUser
}