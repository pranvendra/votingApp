const client =  require("./client").client


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
    INSERT INTO poll (pollName, userId)
    VALUES ('${pollName}', '${uid}')
    `;
    var polls = await client.query(createPoll);
    return polls
}




module.exports = {
    getPolls,
    createPollTable,
    createPoll
}