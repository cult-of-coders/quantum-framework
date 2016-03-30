Quantum UI
=================================

Renamed UI.dynamic to a friendlier name:
```
{{> include template='package.my_template' data=optionalDataOrGetsTheParentOne }}
```

Global helpers:
```
{{ tpl }}
{{ tpl_data }}
```

Global functions:
```
tpl() : short hand for Template.instance()
tpl_data() : short hand for Template.instance().data
```