const request = require('supertest');
const app = require('../app');
const {MongoClient} = require('mongodb');
let token;
let userID;

beforeAll((done) => {
    request(app)
    .post('/users/authenticate')
    .send({
        username: 'admin',
        password: 'admin',
    })
    .end((err, response) => {
        token = response.body.token; // save the token!
        userID = response.body.id;
        done();
    });
});

async function setReceiveNotification(state) {
    await request(app)
    .put(`/users/${userID}`)
    .send({
        receiveNotifications: state
    })
    .end((err, response) => {
        return response.body; // save the token!
        done();
    });
}

async function postNotification(title, message) {
    await request(app)
    .post('/notification')
    .set('Authorization', `Bearer ${token}`)
    .send({
        userID: userID,
        title: title,
        message: message,
    })
    .end((err, response) => {
        return response.body; // save the token!
        done();
    });
}

describe("POST /notification", () => {
    // token not being sent - should respond with a 401
    test('It should require authorization', () => {
        return request(app)
            .post('/notification')
            .send({
                userID: token.sub,
                title: 'Notification Title',
                message: 'Notification Message',
            })
            .then((response) => {
                expect(response.statusCode).toBe(401);
            });
      });

   // send the token - should respond with a 200
   test('It responds with JSON', () => {
    return request(app)
        .post('/notification')
        .set('Authorization', `Bearer ${token}`)
        .send({
            userID: userID,
            title: 'Notification Title',
            message: 'Notification Message',
        })
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json');
            expect(response.body.message).toBe('success-notification-added');
        });
    });
});

describe('GET /notification', () => {
    // token not being sent - should respond with a 401
    test('It should require authorization', () => {
        return request(app)
        .get('/notification')
        .then((response) => {
            expect(response.statusCode).toBe(401);
        });
    });

    // Make sure user is receiving notifications
    setReceiveNotification(true);

    // Make sure user is has a notification
    postNotification("Test", "Just making sure you have a notification")

    // send the token - should respond with a 200
    test('It responds with JSON', () => {
        return request(app)
        .get('/notification')
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json');
        });
    });

    // Make sure user is NOT receiving notifications
    setReceiveNotification(false);

    test('It responds with empty array', () => {
        return request(app)
        .get('/notification')
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json');
            expect(response.body).toHaveLength(0);
        });
    });
});
