QF.add('service', 'quantum.utils', {
    definition: class {
        getSchema(option) {
            if (typeof(option) == 'string') {
                return QF.use('schema', option);
            }

            if (typeof(option) == 'object') {
                return new SimpleSchema(option);
            }

            if (option === undefined) {
                return option;
            }

            if ((!option instanceof SimpleSchema)) {
                throw new Meteor.Error('invalid-schema', 'You need to provide a valid schema.')
            }

            return option;
        }
    }
});