Q('schema quantum.email.atom', {
    from: {type: String},
    template: {type: String},
    layout: {type: String, optional: true},
    scss: {type: String, optional: true},
    helpers: {type: Object, blackbox: true, optional: true},
    route: {type: Function, optional: true},
    schema: {type: Any, optional: true},
    subject: {type: Any}
});