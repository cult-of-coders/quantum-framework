Template.registerHelper('hasRole', function() {
    var values;
    var slice = [].slice;
    values = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    let roles = QF.use('service',  'roles');

    return roles.has(Meteor.userId(), values);
});
