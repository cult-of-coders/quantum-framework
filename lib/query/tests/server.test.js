describe('Query Server Tests', function () {
   it('should return the propper data', function () {
       let fetcher = QF.use('service', 'query-fetcher');

       let data = fetcher.fetch('query_post', {
           $filters: {'title': 'Hello'},
           title: 1,
           author: {},
           nested: {
               data: 1
           },
           comments: {
               text: 1
           },
           groups: {
               name: 1
           },
           comment_resolve: {}
       }, {applyCollectionModel: true});

       assert.equal(1, data.length);
       let post = data[0];

       assert.isString(post.testModelFunction());
       assert.equal('Yes', post.nested.data);
       assert.equal(3, post.comments.length);
       assert.equal(2, post.groups.length);
       assert.isObject(post.author);
       assert.equal('John McSmithie', post.author.name);

       assert.lengthOf(post.comment_resolve, 1);
   })
});