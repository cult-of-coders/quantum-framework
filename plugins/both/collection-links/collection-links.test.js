describe('Collection Links', function () {
    Q('collection test.uploads', {

    });

    Q('collection post', {
        links: {
            'comments': {
                type: '*',
                collection: 'comment',
                field: 'commentIds'
            },
            'metaComments': {
                type: '*',
                collection: 'comment',
                metadata: {}
            },
            category: {
                type: '1'
            },
            metaCategory: {
                metadata: {},
                collection: 'category',
                type: '1'
            },
            pictures: {
                resolve(object) {
                    return Q('collection test.uploads').find({
                        resourceId: object._id
                    })
                }
            }
        }
    });

    Q('collection comment', {
        links: {
            'post': 'post comments',
            'metaPost': 'post metaComments'
        }
    });

    Q('collection category', {
        links: {
            'posts': 'post category'
        }
    });

    it('Test Many', function () {
        let postId = Q('collection post').insert({'text': 'abc'});
        let commentId = Q('collection comment').insert({'text': 'abc'});

        let post = Q('collection post').findOne(postId);
        post.comments().add(commentId);
        assert.lengthOf(post.comments().find().fetch(), 1);

        post.comments().remove(commentId);
        assert.lengthOf(post.comments().find().fetch(), 0);
    });

    it('Tests One', function () {
        let postId = Q('collection post').insert({'text': 'abc'});
        let categoryId = Q('collection category').insert({'text': 'abc'});

        let post = Q('collection post').findOne(postId);
        post.category().set(categoryId);
        assert.lengthOf(post.category().find().fetch(), 1);

        post.category().unset();
        assert.lengthOf(post.category().find().fetch(), 0);
    });

    it('Tests One Meta', function () {
        let postId = Q('collection post').insert({'text': 'abc'});
        let categoryId = Q('collection category').insert({'text': 'abc'});

        let post = Q('collection post').findOne(postId);

        post.metaCategory().set(categoryId, {date: new Date()});

        assert.lengthOf(post.metaCategory().find().fetch(), 1);
        let metadata = post.metaCategory().metadata();

        assert.isObject(metadata);
        assert.instanceOf(metadata.date, Date);

        post.metaCategory().metadata({
            updated: new Date()
        });

        post = Q('collection post').findOne(postId);
        assert.instanceOf(post.metaCategory().metadata().updated, Date);

        post.metaCategory().unset();
        assert.lengthOf(post.metaCategory().find().fetch(), 0);
    });

    it('Tests Many Meta', function () {
        let postId = Q('collection post').insert({'text': 'abc'});
        let commentId = Q('collection comment').insert({'text': 'abc'});

        let post = Q('collection post').findOne(postId);

        post.metaComments().add(commentId, {date: new Date});
        assert.lengthOf(post.metaComments().find().fetch(), 1);

        // verifying reverse search
        let metaComment = Q('collection comment').findOne(commentId);
        assert.lengthOf(metaComment.metaPost().find().fetch(), 1);

        let metadata = post.metaComments().metadata(commentId);

        assert.isObject(metadata);
        assert.instanceOf(metadata.date, Date);

        post.metaComments().metadata(commentId, {updated: new Date});

        post = Q('collection post').findOne(postId);
        metadata = post.metaComments().metadata(commentId);
        assert.instanceOf(metadata.updated, Date);

        post.metaComments().remove(commentId);
        assert.lengthOf(post.metaComments().find().fetch(), 0);
    });

    it('Tests virtual findings', function () {
        let postId = Q('collection post').insert({'text': 'abc'});
        let commentId = Q('collection comment').insert({'text': 'abc'});

        let post = Q('collection post').findOne(postId);
        let comment = Q('collection comment').findOne(commentId);

        post.comments().add(comment);
        assert.lengthOf(comment.post().find().fetch(), 1);

        Q('collection comment').remove(comment._id);
        post = Q('collection post').findOne(postId);
        assert.notInclude(post.commentIds, comment._id);
    });

    it('Tests proper resolver', function () {

        let postId = Q('collection post').insert({'text': 'abc'});
        let uploadId = Q('collection test.uploads').insert({'resourceId': postId});

        let post = Q('collection post').findOne(postId);

        assert.lengthOf(post.pictures().fetch(), 1);
    })
});