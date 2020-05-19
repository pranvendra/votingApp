const client =  require("./client").client


const allPollsQuery = `
Select * from poll
`;


async function getPolls() {
    var polls = await client.query(allPollsQuery, (err, res) => {
        if (err) {
            console.error(err);
            return [];
        }
        console.log('Data insert successful');
        client.end();
    });
    return polls
}

const createPollTableQuery = `
CREATE TABLE poll(
	pollId serial PRIMARY KEY,
	pollName VARCHAR (355) UNIQUE NOT NULL,
	createdBy INTEGER REFERENCES account(user_id) NOT NULL,
	created_on TIMESTAMP NOT NULL
);
`

async function createPollTable() {
    var polls = await client.query(createPollTableQuery, (err, res) => {
        if (err) {
            console.error(err);
            return [];
        }
        console.log('Data insert successful');
        client.end();
    });
    return polls
}

async function createPoll(pollName, password) {
    var createPoll = `
    INSERT INTO poll (pollName, userId)
    VALUES ('${userName}', '${password}')
    `;
    var polls = await client.query(createPollTableQuery, (err, res) => {
        if (err) {
            console.error(err);
            return [];
        }
        console.log('Data insert successful');
        client.end();
    });
    return polls
}




module.exports = {
    getPolls,
    createPollTable
}