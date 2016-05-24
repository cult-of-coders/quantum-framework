Q('collection-exposure query_post', {});

Q('collection query_post').remove({});
Q('collection query_comment').remove({});

let postId = Q('collection query_post').insert({title: 'Hello'});
let groupId1 = Q('collection query_group').insert({name: 'Main Group'});
let groupId2 = Q('collection query_group').insert({name: 'Secondary Group'});

Q('collection query_post').insert({title: 'Goodbye'});

let commentId1 = Q('collection query_comment').insert({text: 'Sample', isBanned: false});
let commentId2 = Q('collection query_comment').insert({text: 'Sample', isBanned: false});
let commentId3 = Q('collection query_comment').insert({text: 'Sample', isBanned: true});

let post = Q('collection query_post').findOne(postId);

post.groups().add(groupId1, {isAdmin: true});
post.groups().add(groupId2, {isAdmin: false});

post.comments().add([commentId1, commentId2, commentId3]);