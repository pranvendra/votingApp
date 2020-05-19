const client = require("./client").client

const createUserTable = `
CREATE TABLE user(
	userId serial PRIMARY KEY,
    userName VARCHAR (355) UNIQUE NOT NULL,
    password
	createdBy INTEGER REFERENCES account(user_id) NOT NULL,
	created_on TIMESTAMP NOT NULL
);`


async function createUserT() {
    await client.query(createUserTable, (err, res) => {
        if (err) {
            console.error(err);
            return [];
        }
    });
    return
}


module.exports = {
    createUserT,
}
