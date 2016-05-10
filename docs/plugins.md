Schema Plugin
========================

```
Q('schema todo', {
    title: {
        type: String
    },
    isChecked: {
        type: Boolean,
        defaultValue: false
    }
});
```

Service plugin
======================

```
Q('service todo', {
    object: {
        doSomething: function(test) { .. }
    }
});

Q('service todo').doSomething(123);
```

or

```
Q('service todo', {
    definition: class {
        doSomething: function(test) { .. }
    }
});

Q('service todo').doSomething(123);
```

or factory:

```
Q('service todo', {
    definition: class {
        constructor(a,b,c) { .. }
    }
    factory: true
});

let instance = Q('service todo').build(1,2,3);
```

# Meteor Paginator

Example usage:

```
// this syntax is just an example to make someone unfamiliar to the framework understand easier
// please use: Q('template myTemplate', { onCreated: () }
// or if you want built in use, read more about Templating Listify

Template.myTemplate.onCreated(function() {
    this._paginator = Q('service quantum.paginator').build(mongoCollection, {
        subscriptionName: subscriptionName,
        countMethod: "mycountMethod",
        pageSize: 10
    }, {
        main: ReactiveVar({}), // optional filters
        options: ReactiveVar({}) // optional filters options
    });
});

Template.myTemplate.helpers({
    elements() {
        return Template.instance()._paginator.find({});
    }
})
```

In the template
```
<template name="myTemplate">
    {{# each elements }}
        {{ name }}
    {{/ each }}
    {{> QuantumPaginator elements }}
</template>
```

Templating Listify
====================================

Creating paginated list in no-time.
```
Q('template-listify templateName', {
    collection: 'collection-name' // requires to be exposed using collection-exposure.
    itemsVariable: 'items' // default
    itemsPerPage: 10 // default
    filters: function // default
    options: function
})
```

If you want to reactively change the filters. You have access to:
- _list_filters : ReactiveVar that stores the filters
- _list_options : ReactiveVar that stores the options
 
Template Formify
==========================
```
Q('template-formify TemplateName', {
    methodsPrefix: 'todo', // you must have todo.insert, todo.update
    formId: 'todo',
    schema: 'string',
    events: {
        onSuccess: fn,
        onSubmit: fn,
        onError: ...
    },
});
```

```
{{> quickForm (formHelper doc) }}
```

Template Crudify
=======================

Crudify uses Formify and Listify for complete integration but it can work without it.
```
Q('template-crudify ToDoCrud', { // ToDoCrud is the prefix for templates: ToDoCrudList, ToDoCrudEdit, ToDoCrudCreate
    collection: 'todo',
    routing: ['todo_crud', '/todo-crud'], // [routeNamePrefix, routePathPrefix]
    listify: { // read more about it in the template-listify plugin. no need to provide collection here.
        itemsVariable: 'todos', // default: items
        itemsPerPage: 3, // default
    },
    formify: { // (optional) you can use your own form. read more about it in the template-formify plugin.
        methodsPrefix: 'todo',
        formId: 'todo.form',
        schema: 'todo'
    },
    list: true // whether or not to have a list. (optional)
    edit: true //(optional) It will create the route /routePathPrefix/:_id/
    create: true //(optional)
});
```

DataStore Plugin
========================================

```
Q('datastore business', {
    monthlyFee: 40,
    currency: 'USD'
})


Q('datastore business').monthlyFee
```

Collection Security Plugin
===============================

Q('collection-security collectionName', {
    allow: {
        insert: (userId, doc) => {}
        update: (userId, doc, fields, modifier) => {}
        remove: (userId, doc) => {}
    }
    deny: {
        insert: (userId, doc) => {}
        update: (userId, doc, fields, modifier) => {}
        remove: (userId, doc) => {}
    }
})

This is equivallent to:
```
Q('collection collectionName').allow({})
Q('collection collectionName').deny({})
```

But the reason if it's existence is to decouple the logical concept of security and provide extensability to allow more options
like wrapping up the allows, and inserts to certain roles:

For example, you may want to listen to when an object is denied something to make a log.
You would do something like: 

```
Q('collection-security').extend({
    wrap: { // schema of the new config.
        type: Boolean
        optional: true
    }
}, function (atom) { // handling new config.
    let config = atom.config;
    if (config.allow) {
        if (config.allow.insert) {
            config.allow.insert = _.wrap(config.allow.insert, (func, userId, doc) => {
                if (!func(userId, doc)) {
                    // do something, you have atom.name which can link to the collection name.
                }
            });
        }
    }
});
```

Collection Methods Plugin
=======================

Using this will expose methods for inserting, removing and updating a collection object.

```
Q('collection-methods prefixForMethods', {
    collection: 'name' # default collection name
    allowedRoles: [],
    insert: true, // Meteor.call('prefixForMethods.insert') will return the id of inserted document.
    remove: true, // Meteor.call('prefixForMethods.remove', _id)
    update: true, // Meteor.call('prefixForMethods.update', modifier, _id)
    update_simple: true // Meteor.call('prefixForMethods.update_simple', _id, {x: 'test'})
    firewall: function(context, doc, modifier) { 
        // available contexts: 'insert', 'update', 'remove' (update_simple is the same firewall as update)
        // modifier will only be available for update and update_simple
        // doc won't have an id yet if the context is 'insert'
        // you can use code  as if you were in the method (this.userId)
        // you can restrict removing something that does not belong to a user like:
        if (context == 'remove' &&  doc.userId != this.userId) {
           throw 'Not Allowed'
        }
    }
});
```

User Plugin
==========================
First make sure you have already loaded a user schema.
We recommend this:

```
Q('schema user', _.extend(Q('user').defaultUserSchema(), {
   others: {type: String} 
}));
```

The *defaultUserSchema* already has the default Meteor users variable including profile.
We suggest that you store additional information in profile, this way you don't have to extend it.

```
Q('schema user', Q('user').defaultUserSchema());
```

Since plugins are polymorphic, they can act as modules and factories. In this case it can be viewed as a module since
we don't use it to create atoms.

```
Q('user', {
    collection: { // (optional) see collection plugin, automatically updates 'schema' and 'collection' name to 'user'
        model: {} // for extending the Meteor.user object
        extend: {} // for extending Meteor.users
    } // it will create a 'user' collection that you can use: Q('collection user')
    roleHierarchy: { // (optional) read more about quantum roles in roles.md
        'ADMIN': ['MODERATOR'] // this way you can only check for MODERATOR role, and if it's an ADMIN it will be true
    }
})
```
Collection Hooks Plugin
============================

```
Q('collection-hooks collectionName', {
    before: : {
        insert: function() {...}
        update: 1
        remove: 1
    }
    after: {
        insert:
        update:
        remove:
    }
});
```

All fields are optional. If you just want to use the events from any of them just pass true or any value excepting a function.

Events are like this:
"collectionName.before.insert" passing the a simple eventObject:
- userId - Who did the action
- doc - The current state of the document being filtered and updated.

You can easily listen to this events:
For example you may want to send an email after a post is inserted.

```
QF.on('post.after.insert', function (event) { sendEmailTo(event.userId, {post: event.doc});
```

Collection Exposure Plugin
========================

```
Q('collection-exposure collectionName', {
    name: ... // What you will be subscribing to, the publication name.
    filtersByRoles: {
        'ADMIN': null,
        'USER': function (userId) {
            return {   // no matter what filters the users specifies it will override them with these
               userId: userId
            }
        }
    }
    fieldsByRoles: {
        'ADMIN': {},
        'USER': {this: 1, that: 1},
    }
    composition: [
        {
            find: ...
            children: ....
        }
    ]
})

Meteor.susbcribe(subriptionName, {filters: ...}})
```

You can use collection.secureFilters(userId, filters, options) and it will use the same exposure methods.
You might use this collection as a child composition in another exposure. So if you want auto filter securing,
just use findSecure instead of find.

Collection Plugin
=========================

```
Q('schema schemaName', { ... })

Q('collection name', {
    model: {
        fullname() { 
            return this.profile.firstName + ' ' + this.profile.lastName  
        }
    },
    extend: {
        findActivePosts() { 
            return this.find({status: 'active'}); 
        }
    },
    schema: schemaName,
    existingCollection: Meteor.users // optional
})
```

The model you specify will expose those methods on every document retrieved via collection.

The extend argument allows you to extend the functionality of the collection object.

Method Plugin
=========================

Q('method my.method.name', {
    allowedRoles: []
    handler: () => {
        // you can use this.userId and everything you can use in a method.
    }
});


// call it using Meteor.call(my.method.name)


Notifications
========================

Q('notifications', {
    smtp_url: '',
    layoutTemplate: ''
    defaultFrom: '...'
    defaultTo: '...' // false if not in dev mode.
}) 

Q('notifications templateName', {
    assetPath: '...'
    schema() {  }
})

Q('notifications templateName').sendEmail(
    {to: 'xxx', bcc: [], cc: [], attachments: []}, 
    post
)