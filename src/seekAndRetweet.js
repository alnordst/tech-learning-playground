'use strict'

const cron = require('cron')
const fsPromises = require('fs').promises
const Long = require('long')
const path = require('path')
const sequential = require('promise-sequential')
const Twitter = require('twitter')

const configPath = path.join(__dirname, '..', 'twitter-config.json')

let client
let fullConfigs
let job

/* Initialize cron job. */
let init = function() {
  return readConfigs().then(configs => {
    job = new cron.CronJob(configs.frequency, run, null, true)
  })
}

let run = function() {
    readConfigs()
      .then(initClient)
      .then(buildQuery)
      .then(seek)
      .then(retweet)
      .then(logLast)
      .then(updateFrequency)
      .catch(err => console.log(err))
}

/* Read config file.*/
let readConfigs = function() {
  return fsPromises.readFile(configPath)
    .then(data => {
      fullConfigs = JSON.parse(data)
      return fullConfigs.seekAndRetweet
    })
}

/* Initialize twitter client. */
let initClient = function(data) {
  client = new Twitter({
    consumer_key: fullConfigs.authentication.consumerKey,
    consumer_secret: fullConfigs.authentication.consumerSecret,
    access_token_key: fullConfigs.authentication.accessToken,
    access_token_secret: fullConfigs.authentication.accessTokenSecret
  })
  return data
}

/* Build query object based on config data. */
let buildQuery = function(configs) {
  let terms = []
  for(var query of configs.queries) {
    terms.push(query.term)
  }
  let fullQuery = {
    q: terms.join(' OR '),
    result_type: 'recent'
  }
  if(configs.lastReadId)
    fullQuery.since_id = configs.lastReadId

  return fullQuery
}

/* Search Twitter. */
let seek = function(query) {
  return client.get('search/tweets', query)
}

/* Retweet given tweets. */
let retweet = function(response) {
  return sequential(response.statuses.map(tweet => {
    return () => { 
      console.log(tweet.id_str)
      return client.post('statuses/retweet/' + tweet.id_str, {})
        .catch(err => { console.log(err, tweet.id_str) })
    }
  })).then(() => {
    return response.statuses
  })
}

/* Log last retweeted tweet id in config file. */
let logLast = function(tweets) {
  let lastLogged = fullConfigs.seekAndRetweet.lastReadId
  let lastTweet = tweets.reduce((acc, tweet) => {
    let idLong = Long.fromString(tweet.id_str)
    return idLong.gt(acc) ? idLong : acc
  }, lastLogged ? Long.fromString(lastLogged) : Long.UZERO).toString()

  fullConfigs.seekAndRetweet.lastReadId = lastTweet

  return fsPromises.writeFile(configPath, JSON.stringify(fullConfigs, null, 2))
}

/* Update frequency of cron job based on configs. */
let updateFrequency = function() {
  job.setTime(new cron.CronTime(fullConfigs.seekAndRetweet.frequency))
  job.start()
}

init()
