'use strict'

const cron = require('cron')
const fsPromises = require('fs').promises
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
      .then(aftermath)
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

  return {
    q: terms.join(' OR '),
    result_type: 'recent',
    count: 100
  }
}

/* Search Twitter. */
let seek = function(query) {
  return client.get('search/tweets', query)
}

/* Retweet given tweets. */
let retweet = function(response) {
  let retweetCount = 0
  return sequential(response.statuses.map(tweet => {
    return () => { 
      return client.get('statuses/show/' + tweet.id_str, {})
        .then(status => {
          if(status.retweeted)
            return Promise.resolve()
          else
            return client.post('statuses/retweet/' + status.id_str, {})
              .then(() => { retweetCount++ })
              .catch(err => { console.log(err, tweet.id_str, tweet.retweeted) })
        })
    }
  })).then(() => {
    return retweetCount
  })
}

/* Update frequency of cron job based on configs. */
let aftermath = function(retweetCount) {
  job.setTime(new cron.CronTime(fullConfigs.seekAndRetweet.frequency))
  job.start()

  console.log('Completed cycle at:', (new Date()).toLocaleString(), ' - Retweeted', retweetCount, 'item(s)')
}

init()
