const request = require('request');

function LovooClient() {
    const host = 'https://www.lovoo.com';
    const api = 'https://www.lovoo.com/api_web.php';

    let lovooKey = null;
    let lovooCsrf = null;

    const loggedUser = {
        id: null,
        name: null,
        freetext: null,
        country: null,
        city: null,
        age: null,
        gender: null,
        email: null,
        credits: null,
        birthday: null,
        genderLooking: null,
    };

    const paths = {
        host: {
            login: '/login_check',
            self: '/self',
            write: '/api/users/%s/write'
        },
        api: {
            details: '/users/%s/details',
            pictures: '/users/%s/pictures',
            conversations: '/conversations?resultLimit=100',
            conversation: '/conversations/%s'
        }
    };

    const getHeaders = function() {
        let headers = {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
            'app': 'lovoo',
            'x-csrf-token': lovooCsrf,
            'cookie': 'lovoocsrf=' + lovooCsrf + '; lovoo=' + lovooKey + ';',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'origin': 'https://www.lovoo.com'
        };

        return headers;
    };


    const getSelf = function() {
        return new Promise((resolve, reject) => {
            request.get(host + paths['host']['self'], { headers: getHeaders() }, (error, request, body) => {
                if (error) {
                    reject(error);
                }
                try {
                    let selfJson = JSON.parse(body.split('var Self = ')[1].split(';')[0]);
                    loggedUser['id'] = selfJson.id;
                    loggedUser['age'] = selfJson.age;
                    loggedUser['city'] = selfJson.locations.home.city;
                    loggedUser['country'] = selfJson.locations.home.country;
                    loggedUser['email'] = selfJson.email;
                    loggedUser['freetext'] = selfJson.freetext;
                    loggedUser['gender'] = selfJson.gender;
                    loggedUser['name'] = selfJson.name;
                    loggedUser['gender'] = selfJson.gender;
                    loggedUser['genderLooking'] = selfJson.genderLooking;
                    loggedUser['credits'] = selfJson.credits;
                    loggedUser['birthday'] = selfJson.birthday;
                    resolve(loggedUser);
                } catch (e) {
                    reject(e);
                }
            });
        });
    };

    this.getPictures = function(userId) {
        return new Promise((resolve, reject) => {
            request.get(api + paths['api']['pictures'].replace('%s', userId), { headers: getHeaders() }, (error, request, body) => {
                if (error) {
                    reject(error);
                }
                try {
                    const responseImages = JSON.parse(body).response.result[0].images;
                    resolve(responseImages);
                } catch (e) {
                    reject(e);
                }
            });
        });
    };

    this.getDetails = function(userId) {
        return new Promise((resolve, reject) => {
            request.get(api + paths['api']['details'].replace('%s', userId), { headers: getHeaders() }, (error, request, body) => {
                if (error) {
                    reject(error);
                }
                try {
                    const responseDetails = JSON.parse(body).response.result.me;
                    resolve(responseDetails);
                } catch (e) {
                    reject(e);
                }
            });
        });
    };

    this.sendMessage = function(userId, message) {
        return new Promise((resolve, reject) => {
            request.post(host + paths['host']['write'].replace('%s', userId), { headers: getHeaders(), json: { text: message, userId: userId } }, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                const result = {
                    userId: userId,
                    message: message,
                };
                resolve(result);
            });
        });
    }

    this.getAllConversations = function() {
        return new Promise((resolve, reject) => {
            request.get(api + paths['api']['conversations'], { headers: getHeaders() }, (error, request, body) => {
                if (error) {
                    reject(error);
                }
                try {
                    const responseConversations = JSON.parse(body).response.result;
                    let betterResponse = [];

                    for (let i = 0; i < responseConversations.length; i++) {
                        betterResponse.push({
                            id: responseConversations[i].id,
                            countNewMessages: responseConversations[i].countNewMessages,
                            user: responseConversations[i].user.name,
                            userId: responseConversations[i].user.id,
                        });
                    }

                    resolve(betterResponse);
                } catch (e) {
                    reject(e);
                }
            });
        });
    };

    this.getConversation = function(conversationId) {
        return new Promise((resolve, reject) => {
            request.get(api + paths['api']['conversation'].replace('%s', conversationId), { headers: getHeaders() }, (error, request, body) => {
                if (error) {
                    reject(error);
                }
                try {
                    const responseConversation = JSON.parse(body).response.result;
                    const partner = {
                        id: JSON.parse(body).response.conversation.user.id,
                        name: JSON.parse(body).response.conversation.user.name
                    };
                    const messages = [];
                    for (let i = 0; i < responseConversation.length; i++) {
                        messages.push({
                            date: new Date(responseConversation[i].time * 1000),
                            message: responseConversation[i].content,
                            sender: responseConversation[i].direction == 2 ? { id: loggedUser['id'], name: loggedUser['name'] } : partner
                        });
                    }
                    resolve(messages);
                } catch (e) {
                    reject(e);
                }
            });
        });
    };

    this.getSelfInformations = function() {
        return loggedUser;
    };

    this.login = function(email, password) {
        return new Promise((resolve, reject) => {
            lovooKey = null;
            lovooCsrf = null;
            request.post(host + paths['host']['login']).form({ _username: email, _password: password, _remember_me: 'false' })
                .on('response', (response) => {
                    let headers = response.headers['set-cookie'];
                    for (var i = 0; i < headers.length; i++) {
                        if (headers[i].includes('lovoo=')) {
                            lovooKey = headers[i].split('lovoo=')[1].split(';')[0];
                        } else if (headers[i].includes('lovoocsrf=')) {
                            lovooCsrf = headers[i].split('lovoocsrf=')[i].split(';')[0];
                        }
                    }
                    if (lovooKey != null && lovooCsrf != null) {
                        getSelf().then((r) => resolve(r)).catch((e) => reject(e));
                    } else {
                        reject({ error: 'wrong credentials' });
                    }
                })
                .on('error', (error) => reject(error));
        });
    };

}

exports.LovooClient = LovooClient;