var _   =   require('underscore');

module.exports = function(schema, options) {

  options = _.extend({
    isDeleted: 'isDeleted'
  });

  schema.add((function(fields) {
    fields[options.isDeleted] = { type: Boolean, default: false, index: true};
    return fields;
  })({}));

  schema.pre('find', function(next) {
    var query = this;

    // If a query explicitly asks for deleted records, let it pass. Useful for backend admin interfaces etc.
    if (query._conditions.isDeleted === true) {
      return next();
    }

    query.where({ isDeleted: false });
    return next();
  });

  schema.pre('findOne', function(next) {
    var query = this;

    if (query._conditions.isDeleted === true) {
      return next();
    }

    query.where({ isDeleted: false });
    return next();
  });

  schema.methods.remove = function(callback) {
    this.isDeleted = true;
    this.save(function(err) {
      return callback(err);
    });
  };
};
