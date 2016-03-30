Quantum Framework
==============================================

1. Concepts

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



Out-of-the-box plugins
-------------------------------

Read more about the available plugins in doc/plugins.md

Creating a ToDo List app that uses all these plugins
-------------------------------

1. Creating the schema for your todos

```
Q('schema todo', {
    title: { type: String }
    isChecked: { type: Boolean }
})
```

2. Create the collection (client and server-side)
```
Q('collection todo', {
    table: 'todos',
    schema: 'todo'
})
```

3. Expose the collection (server-side)
```
Q('collection-expose todo', {})
```

4. Expose methods for manipulating the todo
```
Q('collection-methods todo', {})
```

5. Create the ToDo List
```
<template name="ToDoList">
    {{# each todos }}
        {{> ToDoItem }}
    {{/ each }}
</template>
<template name="ToDoItem">
    <div {{b 'if: editMode' }}>
        <input type="checkbox" checked="{{ isChecked }}" /> {{ title }}
        
        <a {{b 'click: remove' }}>Remove</a>
        <a {{b 'click: edit' }}>Edit</a>
    </div>
</template>
<template name="ToDoForm">
    {{> quickForm ... }}
</template>
```

```
Q('template-listify ToDoList', {itemsVariable: 'todos', collection: 'todo', itemsPerPage: 5 })

Q('viewmodel ToDoItem', {
    remove: {
        Meteor.call('todo.remove', this.id());
    }
    edit: {
        this.editMode
    }
})
```



