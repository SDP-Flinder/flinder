const request = require('supertest');
const app = require('../app');
const {MongoClient} = require('mongodb');

describe("POST /users", () => {

    describe("Given a correct username and password", () => {

        test("Response should have statusCode 200", done => {
            request(app).post("/users/authenticate").send({
                username: 'admin',
                password: 'admin'
            })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        test("Response content-type should be json", done => {
            request(app).post("/users/authenticate").send({
                username: 'admin',
                password: 'admin'
            })
            .then(response => {
                expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
                done();
            });
        });

        test("Response should contain user's id", done => {
            request(app).post("/users/authenticate").send({
                username: 'admin',
                password: 'admin'
            })
            .then(response => {
                expect(response.body.id).toBeDefined();
                done();
            });
        });

        test("Response should contain user's username", done => {
            request(app).post("/users/authenticate").send({
                username: 'admin',
                password: 'admin'
            })
            .then(response => {
                expect(response.body.username).toBeDefined();
                done();
            });
        });

        test("Response should contain user's firstName", done => {
            request(app).post("/users/authenticate").send({
                username: 'admin',
                password: 'admin'
            })
            .then(response => {
                expect(response.body.firstName).toBeDefined();
                done();
            });
        });

        test("Response should contain user's lastName", done => {
            request(app).post("/users/authenticate").send({
                username: 'admin',
                password: 'admin'
            })
            .then(response => {
                expect(response.body.lastName).toBeDefined();
                done();
            });
        });

        test("Response should contain a token", done => {
            request(app).post("/users/authenticate").send({
                username: 'admin',
                password: 'admin'
            })
            .then(response => {
                expect(response.body.token).toBeDefined();
                done();
            });
        }); 
    });


    describe("Given an incorrect username and password", () => {

        test("Response should have statusCode 400", done => {
            request(app).post("/users/authenticate").send({
                username: 'incorrect',
                password: 'incorrect'
            })
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
        });

        test("Response should have message 'incorrect-username-password'", done => {
            request(app).post("/users/authenticate").send({
                username: 'incorrect',
                password: 'incorrect'
            })
            .then(response => {
                expect(response.body.message).toEqual('incorrect-username-password');
                done();
            });
        });
    });

  });


// >>> Keep me around <<<
// describe('MongoDB insert user', () => {
//     let connection;
//     let db;
  
//     beforeAll(async () => {
//       connection = await MongoClient.connect(global.__MONGO_URI__, {
//         useNewUrlParser: true,
//       });
//       db = await connection.db(global.__MONGO_DB_NAME__);
//     });
  
//     afterAll(async () => {
//       await connection.close();
//       await db.close();
//     });
  
//     it('should insert a document into collection', async () => {
//       const users = db.collection('users');
  
//       const mockUser = {_id: 'some-user-id', name: 'John'};
//       await users.insertOne(mockUser);
  
//       const insertedUser = await users.findOne({_id: 'some-user-id'});
//       expect(insertedUser).toEqual(mockUser);
//     });
//   });