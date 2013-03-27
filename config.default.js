module.exports = {
  mongo_connect: {
    //host: 'localhost', 
    host: '10.10.20.75',      
    port: 27017,
    db: 'grad_form',
  },
  upload: {
    mongodb:{
     //host: 'localhost',
     host: '10.10.20.75', 
     port: 27017,
     db: 'grad_form',
     autoReconnect: true,
     poolSize: 4
    }
  },
  authorization: {
    mongodb:{
     //host: 'localhost',  
     host: '10.10.20.75',   
     port: 27017,
     db: 'grad_form',
     collection_name: 'nook_ac_1',
     autoReconnect: true,
     poolSize: 4
    }
  },
  site: {
    baseUrl: 'http://localhost:9012/',
    port: 9012,
    cookieSecret: 'cookiesecret',
    sessionSecret: 'sessionsecret'
  }
};
