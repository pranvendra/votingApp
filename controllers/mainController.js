const Poll = require('../models/Poll')


async function polls(req, res) {
    var polls = await Poll.getPolls()
    console.log(polls)
    return polls
}

function createTables(){
    Poll.createPollTable()
}

function createPoll(req, res){
    Poll.createPoll()

}

module.exports = {
    polls,
    createTables,
    createPoll
}