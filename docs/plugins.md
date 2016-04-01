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
    this._paginator = Q('service ui.paginator').build(mongoCollection, {
        subscriptionName: subscriptionName,
        countMethod: "mycountMethod",
        pageSize: 10
    }, {
        main: ReactiveVar({}), // filters
        options: ReactiveVar({}) // filters options
    });
    
    // use it in a helper:
    this._paginator.find({})
    
    // display the navigation within your template:
    {{> QuantumPaginator }}
});
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
        update: (userId, doc) => {}
    }
    deny: ...
})

Collection Methods Plugin
=======================

```
Q('collection-methods name', {
    prefix: '' # default collection name
    allowedRoles: []
    insert: true
    remove: true
    update: true
});
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
            return {
               userId: userId
            }
        }
    }
    fieldsByRoles: {
        'ADMIN': {},
        'USER': {this: 1, that: 1},
    }
    composition: {
        children: [
            {
                find: ...
                children: ....
            }
        ]
    }
})

Meteor.susbcribe(subriptionName, {filters: ...}})
```

You can use collection.secureFilters(userId, filters, options) and it will use the same exposure methods.
You might use this collection as a child composition in another exposure. So if you want auto filter securing,
just use findSecure instead of find.

Collection Plugin
=========================

Q('schema schema', { ... })

Q('collection name', {
    mongo: 'posts',
    model: {
        toString(): { return this.name + ' ' + this._id  }
    }
    extend: {
        findActivePosts: () => { return this.find({status: 'active'}); }
    }
    schema: schemaName
})

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