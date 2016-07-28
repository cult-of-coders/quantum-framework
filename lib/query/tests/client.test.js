describe('Query', function () {
    Q('query-mixin comment', {
        text: 1
    });

    it('Should return static data with helpers', function (done) {
        let service = QF.use('service', 'query-static');

        service.fetch('query_post', {
            title: 1,
            groups: {}
        }, (err, res) => {
            assert.lengthOf(res, 2);
            _.each(res, element => {
                assert.equal(element.testModelFunction(), element._id);
                assert.isArray(element.groups);

                _.each(element.groups, group => {
                    assert.equal(group.testModelFunction(), group._id);
                })
            });

            done();
        });
    });

    it('Should return static data without helpers', function (done) {
        let service = QF.use('service', 'query-static');

        service.fetchData('query_post', {
            title: 1,
            groups: {}
        }, (err, res) => {
            assert.lengthOf(res, 2);
            _.each(res, element => {
                assert.isUndefined(element.testModelFunction);
                assert.isArray(element.groups);

                _.each(element.groups, group => {
                    assert.isUndefined(group.testModelFunction);
                })
            });

            done();
        });
    });

    it('Should subscribe to links properly', function (done) {
        let query = QF.use('service', 'query-builder').build('query_post', {
            $filter({filters, params}) {
                filters.title = params.get('title')
            },
            title: 1,
            comments: {
                $filters: {isBanned: false},
                $mixin: 'comment'
            },
            groups: {}
        });

        query.init({
            params: {
                'title': 'Hello'
            }
        });

        Tracker.autorun(c => {
            if (query.activeSubscription && query.activeSubscription.ready()) {
                assert.lengthOf(Q('collection query_post').find().fetch(), 1);
                let post = Q('collection query_post').findOne();

                assert.lengthOf(post.comments().fetch(), 2);
                assert.lengthOf(post.groups().fetch(), 2);
                c.stop();

                query.params.set('title', 'Goodbye');
                setTimeout(() => {
                    Tracker.autorun(c => {
                        if (query.activeSubscription && query.activeSubscription.ready()) {
                            assert.lengthOf(Q('collection query_post').find().fetch(), 1);
                            let post = Q('collection query_post').findOne();
                            assert.equal('Goodbye', post.title);
                            assert.lengthOf(post.comments().fetch(), 0);
                            assert.lengthOf(post.groups().fetch(), 0);

                            c.stop();
                            query.stop();
                            done();
                        }
                    })
                }, 100)
            }
        })
    })
});