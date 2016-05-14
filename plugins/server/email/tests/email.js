Q('email', {
    from: 'test@test.com',
    layout: 'tests/assets/Layout.html',
    test: console,
    helpers: {
        test() {
            return 'I am a helper';
        }
    },
    scss: 'tests/assets/something.scss'
});

Q('email QuantumSample', {
    template: 'tests/assets/Sample.html',
    from: 'sample@test.com',
    subject: 'Just a samplinho'
});

Meteor.methods({
    'get.asset'() {
        Q('email QuantumSample').send('me@me.com', {
            name: 'Theodor'
        }, {
            subject: 'Low Level Subject'
        })
    }
});