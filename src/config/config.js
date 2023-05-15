let dbConfig={
    user: 'danielamijares',
    password: '0iKCyNhACULOLk6j',
    dbName: 'usersDB',
    dbUrl: function (){
        return `mongodb+srv://${this.user}:${this.password}@cluster0.tkh2dhw.mongodb.net/`
    }
}

module.exports = dbConfig;