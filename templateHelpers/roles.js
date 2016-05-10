Template.registerHelper('hasRole', function(roles) {
    var values;
    var slice = [].slice;
    values = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Quantum.Roles.has(Meteor.userId(), values);
});
