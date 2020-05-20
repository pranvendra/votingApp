const client =  require("./client").client
const format = require('pg-format');


async function getPolls() {
    const allPollsQuery = `
    Select * from poll
    `;
    var polls = await (await client.query(allPollsQuery)).rows
    return polls
}

const createPollTableQuery = `
CREATE TABLE poll(
	pollId serial PRIMARY KEY,
	pollName VARCHAR (355) UNIQUE NOT NULL,
	createdBy INTEGER REFERENCES user(userId) NOT NULL
);
`

async function createPollTable() {
    var polls = await client.query(createPollTableQuery);
    return polls
}

async function createPoll(pollName, uid = 1) {
    var createPoll = `
    INSERT INTO poll(pollName, createdBy)
    VALUES ('${pollName}', ${uid})
    RETURNING pollid
    `;
    var polls = await client.query(createPoll);
    return polls
}

async function createOption(option, userId, pollId){
    let arr = []
    option.split("|").map(function(item) {
        let item1 = item.trim();
        arr.push([userId, pollId, item1])
    });
    var createOption = format(`INSERT INTO option (createdBy, pollId, optionName)
    VALUES %L`, arr)
    await client.query(createOption)
    return
}


module.exports = {
    getPolls,
    createPollTable,
    createPoll,
    createOption
}