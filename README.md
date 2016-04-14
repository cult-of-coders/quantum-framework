Quantum Framework
==============================================

The quantum framework is a framework based on meteor which enables the developer
to code fast and organized solving most of the common problems in meteor:

- Collection Security
- Easy-to-create paginated lists with optimized subscriptions
- Global Event Manager
- Plugin Support (Ability to extend existing plugins)
- Easy method creation for CRUD operations with role specifications, you can even create simple methods.
- Global User Role Manager
- Decouple units of logic into services, easy and global access integration.

Concepts
-----------------------

- Plugins
- Atoms
- Quantum instance

This framework is an aggregation of very commonly used modules within to enable fast and secure development
within the meteor framework. Yep we are dealing with a framework over a framework :)

You can use this framework without affecting your other components.

Plugins
---------------------------

A plugin's job is to parse a configuration and optionally provide a result of the parsing.
A plugin is composed of atoms that are registered within the quantum framework.

Each atom is uniquely identified by a *name* has a specific configuration and the result is an object
that holds it's name configuration and result.

To create an atom:
```
Q('pluginName atomName', {})
// or
Quantum.instance.add('pluginName', 'atomName', {})
```

Some plugins may store results that you may need, other plugins may not need to store any result, because you may never use it.
However if we are dealing with a plugin that stores a result, to access the result simply call:

```
Q('pluginName atomName') 
// or
Quantum.instance.use('pluginName', 'atomName')
```

A plugin can have different execution contexts. 
1. "instant" - It will build the atom and store the result upon declaration
2. "boot" - It will build the atoms on Meteor startup (boot.js)
3. "lazy" - It will only build the atom only when you request it.


Events
--------------------------
Global event manager throughout the application.

QF.on('eventName', function () { ... });
QF.emit('eventName', data);
QF.off('eventName', function () { ... });
QF.once('eventName', function () { ... });

You can eventify your objects by running: Quantum.Model.Utils.eventify(object)
In a constructor of your class you can use *this* instead of *object*
And it will expose the *on, emit, off, once* methods

Out-of-the-box plugins
-------------------------------

Read more about the available plugins in doc/plugins.md

Creating a ToDo List app that taps into the power of Quantum Framework
==========================================

0. In meteor/packages file add:
---------------------------------
```
cultofcoders:quantum-framework
cultofcoders:quantum-iron-routing
```

1. Creating the schema for your todos
----------------------------------

```
// lib/schema.js
Q('schema todo', {
    title: { type: String }
    isChecked: { type: Boolean }
})
```

2. Create the collection (client and server-side)
-----------------------
```
// lib/collection.js
Q('collection todo', {
    table: 'todos',
    schema: 'todo'
})
```

3. Expose the collection (server-side)
-------------
```
// server/collection.js
Q('collection-exposure todo', {})
```

4. Expose methods for manipulating the todo
------------
```
// server/collection.js
Q('collection-methods todo', {})
// will expose "todo.insert", "todo.update", "todo.remove" that works built-in with autoform.
```

5. Create the ToDo List Templates
-------------------------------------

```
// client/todo.html
<template name="ToDoList">
    {{> ToDoForm }}
    
    {{# each todos }}
        {{> ToDoItem }}
        <br />
    {{ else }}
        No todos yet!
    {{/ each }}
    
    {{> QuantumPaginator todos }}
</template>

<template name="ToDoItem">
    <div>
        <input type="checkbox" checked="{{ isChecked }}" /> 
        {{ title }}
        <a class="remove">Remove</a>
    </div>
</template>

<template name="ToDoForm">
    {{> quickForm formHelper }}
</template>
```

```
//client/todo.js
Q('template-listify ToDoList', {
    itemsVariable: 'todos', 
    collection: 'todo', 
    itemsPerPage: 5
})

Q('template ToDoItem', {
    events: {
        'click .remove': () => {
            Meteor.call('todo.remove', data('_id'));
        },
        'click [type="checkbox"]': () => {
            Meteor.call('todo.update', {
                $set: { isChecked: !data('isChecked') }
            }, data('_id'));

            data('isChecked', !data('isChecked'));
        }
    }
});

Q('template-formify ToDoForm', {
    methodsPrefix: 'todo', // used by collection-methods, or you can define them custom "todo.insert", "todo.update"
    formId: 'todo',
    schema: 'todo',
    events: {
        onSuccess: () => {} // optional events used by autoform.
    }
});
```




