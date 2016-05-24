describe('Query', function () {
    Q('query-mixin comment', {
        text: 1
    });

    it('Should subscribe to links properly', function (done) {
        let query = QF.use('service', 'query-builder').build('query_post', {
            $filter({filters, params}) {
                filters.title = params('title')
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

                query.params('title', 'Goodbye');
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