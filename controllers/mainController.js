const Poll = require('../models/Poll')
const _ = require('lodash')

async function polls(req, res) {
    var polls = await Poll.getPolls()
    let myUid = req.user.userId
    restPolls = _.partition(polls, ['createdby', myUid])
    return restPolls
}

function createTables(){
    Poll.createPollTable()
}

async function createPoll(req){
    let name = req.body.pollName
    let option = req.body.option
    let userId = req.body.userId
    pollId = await Poll.createPoll(name, userId)
    await Poll.createOption(option, userId, pollId.rows[0]['pollid'])
    return 
}
//need to test
async function addOption(req){
    let option = req.body.option
    let userId = req.body.userId
    let pollId = req.body.pollId
    var optionId = await Poll.createOption(option, userId, pollId)
    return optionId
}


async function vote(req){
    let optionId = req.body.optionId
    let pollId = req.body.pollId
    let userId = req.body.userId
    try {
        await Poll.vote(optionId, pollId, userId)
    } catch (error) {
        throw(error)
    }
    return
}

async function viewPoll(req){
    let pollId = req.params['pollId'] // need to check value
    let pollDetails = await Poll.pollDetails(pollId)
    let votes = await Poll.getVotes(pollId)
    let options = await Poll.getOptions(pollId)
    optionDict = {}
    for (option of options){
        optionDict[option['optionid']] = {'optionName':option['optionname'], 'vote':0}
    }
    for (voteVal of votes.rows){
        optionDict[voteVal['optionid']]['vote'] += 1
    }
    return {optionDict:optionDict, options:options, pollName:pollDetails['pollname'], pollId:pollDetails['pollid']}
}

async function getOptions(req, res){
    let pollId = req.params['pollId'] // need to check value
    let options = await Poll.getOptions(pollId)
    return options
}

async function removePoll(req){
    let pollId = req.params['pollId']
    Poll.removePoll(pollId)
    return
}

function createColors(num){
    colorArr = [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
    ]
    var result = []
    for(i=0; i<num; i+=1){
        if (i < colorArr.length){
            result.push(colorArr[i])
        }
        else{
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            result.push('rgb(' + r + ',' + g + ',' + b + ')');
        }
    }
    return result
}

function createConfig(dynamicColor, polls){
    var voteVal = []
    var labels = []
    for(optionId in polls['optionDict']){
        labels.push(polls['optionDict'][optionId]['optionName'])
        voteVal.push(polls['optionDict'][optionId]['vote'])
    }
    var config = {
        type: 'pie',
        data: {
            datasets: [{
                data: voteVal,
                backgroundColor: dynamicColor,
                label: polls['pollName']
            }],
            labels: labels
        },
        options: {
            responsive: true
        }
    }
    return config
}

module.exports = {
    polls,
    createTables,
    createPoll, 
    addOption,
    vote,
    viewPoll,
    getOptions,
    removePoll,
    createColors,
    createConfig
}