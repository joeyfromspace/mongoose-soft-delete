var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var expect      = require('chai').expect;
var faker       = require('faker');
var softDelete  = require('../lib/mongoose-soft-delete');

var db          = 'mongodb://localhost:27017/mongoose-soft-delete-test';

before(function(done) {
  mongoose.connect(db, { server: { socketOptions: { keepAlive: 1 } } });
  var TestSchema = Schema({
    name: String
  });

  TestSchema.plugin(softDelete);
  mongoose.model('Test', TestSchema);
  mongoose.model('Test').remove({}, done);
});

describe('Schema', function() {
  it('should have the isDeleted path on the schema', function(done) {
    var Model = mongoose.model('Test');
    expect(Model.schema.paths).to.have.property('isDeleted');
    expect(Model.schema.paths.isDeleted.instance).to.equal('Boolean');
    return done();
  });
});

describe('Models', function() {
  it('should have isDeleted property', function(done) {
    var Model = mongoose.model('Test');
    var model = new Model({
      name: faker.internet.userName(),
      isDeleted: true
    });
    model.save(function(err, doc) {
      expect(doc.isDeleted).to.equal(true);
      done();
    });
  });

  it('should not be returned on a regular find query', function(done) {
    var Model = mongoose.model('Test');
    Model.find({}).exec(function(err, models) {
      expect(models.length).to.equal(0);
      return done();
    });
  });

  it('should return models on explicit find queries', function(done) {
    var Model = mongoose.model('Test');
    Model.find({ isDeleted: true }).exec(function(err, models) {
      expect(models.length).to.equal(1);
      return done();
    });
  });

  it('should not be returned on findOne queries', function(done) {
    var Model = mongoose.model('Test');
    Model.findOne({}).exec(function(err, model) {
      expect(model).to.equal(null);
      return done();
    });
  });

  it('should return models on explicit findOne queries', function(done) {
    var Model = mongoose.model('Test');
    Model.findOne({ isDeleted: true }).exec(function(err, model) {
      expect(model).to.have.property('_id');
      return done();
    });
  });


  it('should set isDeleted:true on model remove', function(done) {
    var Model = mongoose.model('Test');
    var model = new Model({
      name: faker.internet.userName()
    });

    model.save(function(err, doc) {
      doc.remove(function() {
        Model.findById(doc._id).exec(function(err, doc) {
          expect(doc).to.equal(null);
          return done();
        });
      });
    });
  });
});
