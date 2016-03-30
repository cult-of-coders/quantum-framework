Template.registerHelper('hasRole', function() {
    var values;
    var slice = [].slice;
    values = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return Quantum.Roles.has(Meteor.userId(), values);
});
