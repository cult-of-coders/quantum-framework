Q('collection-exposure query_post', {});

Q('collection query_post').remove({});
Q('collection query_comment').remove({});
Q('collection query_group').remove({});
Q('collection query_author').remove({});

let authorId = Q('collection query_author').insert({name: 'John McSmithie'});

let postId = Q('collection query_post').insert({
    title: 'Hello',
    nested: {data: 'Yes'}
});
Q('collection query_post').insert({title: 'Goodbye'});

let groupId1 = Q('collection query_group').insert({name: 'Main Group'});
let groupId2 = Q('collection query_group').insert({name: 'Secondary Group'});

Q('collection query_group').insert({name: 'Anonymous Group'});


let commentId1 = Q('collection query_comment').insert({text: 'Sample', isBanned: false});
let commentId2 = Q('collection query_comment').insert({text: 'Sample', isBanned: false});
let commentId3 = Q('collection query_comment').insert({text: 'Sample', isBanned: true});
Q('collection query_comment').insert({text: 'Anonymous Comment'});

let post = Q('collection query_post').findOne(postId);

post.author().set(authorId);
post.groups().add(groupId1, {isAdmin: true});
post.groups().add(groupId2, {isAdmin: false});

post.comments().add([commentId1, commentId2, commentId3]);

// to properly test resolving
Q('collection query_comment').insert({resourceId: post._id});
