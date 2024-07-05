const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Carts Router', () => {
  // Prueba para validar que se manejen correctamente los errores cuando se intenta agregar un producto a un carrito que no existe
  it('should return an error when trying to add a product to a non-existent cart', (done) => {
    const cartId = 'invalid-cart-id';
    const productId = 'valid-product-id';
    const quantity = 2;

    chai.request(app)
      .post(`/api/carts/${cartId}/products?pid=${productId}&quantity=${quantity}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Cart not found');
        done();
      });
  });

  // Prueba para validar que se manejen correctamente los errores cuando se intenta eliminar un producto de un carrito que no existe
  it('should return an error when trying to delete a product from a non-existent cart', (done) => {
    const cartId = 'invalid-cart-id';
    const productId = 'valid-product-id';

    chai.request(app)
      .delete(`/api/carts/${cartId}/products/${productId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Cart not found');
        done();
      });
  });

  // Prueba para validar que se manejen correctamente los errores cuando se intenta actualizar la cantidad de un producto en un carrito que no existe
  it('should return an error when trying to update a product quantity in a non-existent cart', (done) => {
    const cartId = 'invalid-cart-id';
    const productId = 'valid-product-id';
    const quantity = 5;

    chai.request(app)
      .put(`/api/carts/${cartId}/products/${productId}?quantity=${quantity}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Cart not found');
        done();
      });
  });
});
