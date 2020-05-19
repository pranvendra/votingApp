const Poll = require('../models/Poll')

function polls(uId) {
    console.log("controller -> polls")
}

function createTables(){
    Poll.createPollTable()
}


module.exports = {
    polls,
    createTables
}