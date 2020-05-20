const Poll = require('../models/Poll')


async function polls(req, res) {
    var polls = await Poll.getPolls()
    console.log(polls)
    return polls
}

function createTables(){
    Poll.createPollTable()
}

async function createPoll(req, res){
    let name = req.body.pollName
    let option = req.body.option
    let userId = req.body.userId
    pollId = await Poll.createPoll(name, userId)
    await Poll.createOption(option, userId, pollId.rows[0]['pollid'])
    return res.redirect('/')
}

module.exports = {
    polls,
    createTables,
    createPoll
}