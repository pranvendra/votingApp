const client = require("./client").client
const format = require('pg-format');


async function createUser(userName, password) {
    const createUserQuery = `
    INSERT INTO public."user" ("userName", "password")
    VALUES ('${userName}', '${password}')
    `;
    try {
        var user = await client.query(createUserQuery);
        return user   
    } catch (error) {
        throw(error)
    }
};

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