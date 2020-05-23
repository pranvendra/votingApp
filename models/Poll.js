const client =  require("./client").client
const format = require('pg-format');


async function getPolls() {
    const allPollsQuery = `
    Select * from poll
    `;
    try {
        var polls = await (await client.query(allPollsQuery)).rows   
        return polls
    } catch (error) {
        console.error(error)
        throw(error)
    }
}
async function pollDetails(pollId){
    const pollDetailQuery = `
    Select * from poll where pollId = ${pollId}
    `;
    try {
        var polls = await (await client.query(pollDetailQuery)).rows[0]   
        return polls
    } catch (error) {
        console.error(error)
    }
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
    try {
        var polls = await client.query(createPoll);
        return polls   
    } catch (error) {
        throw(error)
    }
}

async function createOption(option, userId, pollId){
    let optionArr = []
    option.split("|").map(function(item) {
        let item1 = item.trim();
        if(item){
            optionArr.push(item1)
        }
    });
    optionArr = [...new Set(optionArr)]; 
    let arr = []
    optionArr.forEach(ar => {
        arr.push([userId, pollId, ar])
    })
    var createOption = format(`INSERT INTO option (createdBy, pollId, optionName)
    VALUES %L RETURNING optionid`, arr)
    try {
        var optionid = await client.query(createOption)
        return  optionid.rows[0]['optionid']
    } catch (error) {
        throw(error)
    }
}


async function vote(optionId, pollId, userId){
    let addVote = format(`
    INSERT INTO vote(optionId, createdBy, pollId)
    VALUES (${optionId}, ${userId}, ${pollId})
    `);
    try {
        await client.query(addVote)
        return   
    } catch (error) {
        throw(error)
    }
}

async function getVotes(pollId){
    let getVotes = format(`
    SELECT * from vote where pollId = ${pollId}
    `);
    try {
        let votes = await client.query(getVotes)
        return votes   
    } catch (error) {
        throw(error)
    }
}

async function getOptions(pollId){
    let getOptions = format(`
        SELECT * from option where pollId = ${pollId}
    `);
    try {
        let options = await client.query(getOptions)
        return options['rows']   
    } catch (error) {
        throw(error)
    }
}

async function removePoll(pollId){
    let removeOption = format(`
    delete from option where pollId = ${pollId}
    `)
    let removeVote = format(`
    delete from vote where pollId = ${pollId}
    `)
    let removePollQuery = format(`
    delete from poll where pollId = ${pollId}
    `)
    try {
        await client.query(removeVote)
        await client.query(removeOption)
        await client.query(removePollQuery)   
    } catch (error) {
        throw(error)
    }
    return
}


module.exports = {
    getPolls,
    pollDetails,
    createPollTable,
    createPoll,
    createOption,
    vote,
    getVotes,
    getOptions,
    removePoll
}