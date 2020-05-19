const Poll = require('../models/Poll')

function polls(uId) {
    console.log("controller -> polls")
    return "hello world"
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