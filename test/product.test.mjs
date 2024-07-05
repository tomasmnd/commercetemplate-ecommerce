import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';
import path from 'path';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Products Router', () => {
  // Test para la ruta POST de creación de productos con carga de archivos!
  it('should create a new product with file upload', (done) => {
    const newProduct = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 9.99,
      code: 'TEST001',
      stock: 10,
      category: 'Test Category'
    };

    chai.request(app)
      .post('/api/products')
      .set('Content-Type', 'multipart/form-data')
      .field('title', newProduct.title)
      .field('description', newProduct.description)
      .field('price', newProduct.price)
      .field('code', newProduct.code)
      .field('stock', newProduct.stock)
      .field('category', newProduct.category)
      .attach('img', path.join(__dirname, 'test-image.jpg'), 'test-image.jpg')
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Producto creado correctamente');
        done();
      });
  });

    // Test para validar que se manejen correctamente los errores cuando se intenta cargar un archivo no válido
    it('should return an error when trying to upload an invalid file', (done) => {
        const newProduct = {
        title: 'Test Product',
        description: 'This is a test product',
        price: 9.99,
        code: 'TEST001',
        stock: 10,
        category: 'Test Category'
        };

        chai.request(app)
        .post('/api/products')
        .set('Content-Type', 'multipart/form-data')
        .field('title', newProduct.title)
        .field('description', newProduct.description)
        .field('price', newProduct.price)
        .field('code', newProduct.code)
        .field('stock', newProduct.stock)
        .field('category', newProduct.category)
        .attach('img', path.join(__dirname, 'test-file.txt'), 'test-file.txt')
        .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal('El archivo debe ser una imágen válida: jpg|jpeg|png|bmp|gif');
            done();
        });
    });

  // Test para validar que se manejen correctamente los errores cuando se intenta crear un producto con datos incompletos o faltantes
  it('should return an error when trying to create a product with incomplete data', (done) => {
    const incompleteProduct = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 9.99
    };

    chai.request(app)
      .post('/api/products')
      .send(incompleteProduct)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.contain('Insufficient data');
        done();
      });
  });

  // Test para verificar que solo los usuarios con el rol adecuado puedan crear productos
  it('should return an error when a non-authorized user tries to create a product', (done) => {
    const newProduct = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 9.99,
      code: 'TEST001',
      stock: 10,
      category: 'Test Category'
    };

    // Simula una solicitud de un usuario sin el rol que corresponda...
    chai.request(app)
      .post('/api/products')
      .send(newProduct)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.contain('No tienes permiso');
        done();
      });
  });

  // Prueba para validar que se manejen correctamente los errores cuando se intenta actualizar un producto que no existe
  it('should return an error when trying to update a non-existent product', (done) => {
    const productId = 'invalid-product-id';
    const updatedProduct = {
      title: 'Updated Product',
      description: 'This is an updated product',
      price: 19.99,
      code: 'UPDATED',
      stock: 20,
      category: 'Updated Category'
    };

    chai.request(app)
      .put(`/api/products/${productId}`)
      .send(updatedProduct)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.contain('Producto no encontrado');
        done();
      });
  });

  // Prueba para verificar que solo los usuarios con el rol adecuado puedan actualizar productos AAAAH.
  it('should return an error when a non-authorized user tries to update a product', (done) => {
    const productId = 'valid-product-id';
    const updatedProduct = {
      title: 'Updated Product',
      description: 'This is an updated product',
      price: 19.99,
      code: 'UPDATED',
      stock: 20,
      category: 'Updated Category'
    };

    // Simula una solicitud de un usuario sin el rol adecuado
    chai.request(app)
      .put(`/api/products/${productId}`)
      .send(updatedProduct)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.contain('No tienes permiso!');
        done();
      });
  });

  // Prueba para validar que se manejen correctamente los errores cuando se intenta eliminar un producto que no existe
  it('should return an error when trying to delete a non-existent product', (done) => {
    const productId = 'invalid-product-id';

    chai.request(app)
      .delete(`/api/products/${productId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.contain('Producto no encontrado!');
        done();
      });
  });

  // Prueba para verificar que solo los usuarios con el rol adecuado puedan eliminar productos
  it('should return an error when a non-authorized user tries to delete a product', (done) => {
    const productId = 'valid-product-id';

    // Simula una solicitud de un usuario sin el rol adecuado
    chai.request(app)
      .delete(`/api/products/${productId}`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.contain('No tienes permiso');
        done();
      });
  });
});
