import chai from 'chai';
import bcrypt from 'bcryptjs';
import chaiHttp from 'chai-http';
import server from '../../../server/app';
import db from '../../../server/models/index';

chai.use(chaiHttp);

const { expect } = chai;

let { Users } = db;

describe('Dash', () => {
  before((done) => {
    bcrypt.hash('123testing', 10)
    .then(password => {
      Users.create({
            user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
            first_name: 'John',
            last_name: 'Doe',
            dob: new Date(),
            year_of_graduation: '2020',
            role: 'admin',
            password,
            phone_number: '07038015455',
            username: 'jamsgra',
            email: 'John.doe@gmail.com',
        })
        .then(() => done())
    })
  })

  let agent = chai.request.agent(server)

  before((done) => {
    agent
    .post('/login')
    .send({ username: 'jamsgra', password: '123testing' })
    .then(res => {
      expect(res).to.have.cookie('session');
      done();
    }).catch(err => console.log(err))
  })

  after((done) => {
    Users.destroy({
      where: {
        username: 'jamsgra'
      }
    }).then(() => done())
  })

  it('should return 404 without valid cookie', (done) => {
    chai.request(server)
      .get('/dash')
      .end((err, res) => {
        expect(res.body.err).to.equal("User not logged in");
        expect(res).to.have.status(404);
        done();
      })
  })

  it('should return 200 with valid cookie', (done) => {
    agent
      .get('/dash')
      .then((res) => {
        expect(res.body.msg).to.equal("Welcome to your dashboard");
        expect(res).to.have.status(200);
        done();
      }).catch(err => console.log(err))
  })
})
