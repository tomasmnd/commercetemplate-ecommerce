const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Sessions Router', () => {
  // Test para validar que se manejen correctamente los errores cuando se intenta iniciar sesión con credenciales inválidas
  it('should return an error when trying to login with invalid credentials', (done) => {
    const credentials = {
      email: 'example@example.com',
      password: 'pass'
    };

    chai.request(app)
      .post('/api/sessions/login')
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Invalid credentials');
        done();
      });
  });

  // Validar que se manejen correctamente los errores cuando se intenta registrar un usuario con datos incompletos o faltantes
  it('should return an error when trying to register a user with incomplete data', (done) => {
    const incompleteUser = {
      first_name: 'Rabin',
      last_name: 'Coderhouse',
      email: 'ejemplo@example.com'
    };

    chai.request(app)
      .post('/api/sessions/register')
      .send(incompleteUser)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.contain('Insufficient data');
        done();
      });
  });

  // Test para validar que se manejen correctamente los errores cuando se intenta restablecer la contraseña con un enlace inválido
  it('should return an error when trying to reset password with an invalid link', (done) => {
    const invalidLink = 'invalid-reset-link';

    chai.request(app)
      .get(`/api/sessions/reset/${invalidLink}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Invalid link');
        done();
      });
  });
});
