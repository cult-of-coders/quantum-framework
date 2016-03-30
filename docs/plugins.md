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
```

Templating Listify
====================================

Will include "items" + "pagination" + "filters" on a template as helpers
and provide a standard template which you can re-use.

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
Q('collection-hooks name', {
    before: : {
        insert:
        update:
        remove: 
    }
    after: {
        insert:
        update:
        remove:
    }
});
```

It will automatically emit events:
"name.before.insert" passing the a simple eventObject hash containing userId and doc.

You can easily listen to this events:
For example you may want to send an email after a post is inserted.

```
QF.on('post.after.insert', function (event) { ... });
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
```

You can use collection.secureFilters(userId, filters, options) and it will use the same exposure methods.

Collection Plugin
=========================

Q('schema schema', { ... })

Q('collection name', {
    table: 'posts',
    helpers: ''
    schema: schemaName
})

Method Plugin
=========================

Q('method my.method.name', {
    allowedRoles: []
    handler: () => {
        // you can use this.userId and everything you can use in a method.
    }
});

// call it using Meteor.call(my.method.name)