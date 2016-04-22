Package.describe({
    name: 'cultofcoders:quantum-framework',
    version: '1.0.23',
    summary: 'Aggregates the quantum framework core and plugins.',
    git: 'https://github.com/cult-of-coders/quantum-framework.git',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');

    var packages = [
        'cultofcoders:quantum-core@1.0.6',
        'meteor-base',
        'mobile-experience',
        'mongo',
        'templating',
        'blaze-html-templates',
        'session',
        'jquery',
        'tracker',
        'check',
        'reactive-var',
        'standard-minifiers',
        'es5-shim',
        'coffeescript',
        'ecmascript',
        'accounts-base',
        'manuel:viewmodel@4.0.6',
        'aldeed:autoform@5.8.1',
        'alanning:roles@1.2.15',
        'raix:handlebar-helpers@0.2.5',
        'yasaricli:slugify@0.0.7',
        'matb33:collection-hooks@0.8.1',
        'reywood:publish-composite@1.4.2',
        'aldeed:collection2@2.9.1',
        'aldeed:simple-schema@1.5.3',
        'dburles:collection-helpers@1.0.4',
        'momentjs:moment@2.12.0'
    ];

    api.use(packages);
    api.imply(packages);

    // others
    api.addFiles([
        'init.js',
        'lib/roles.js',
        'lib/any.js'
    ]);

    // plugins
    api.addFiles([
        'plugins/both/datastore.js',
        'plugins/both/schema.js',
        'plugins/both/enum.js',
        'plugins/both/service.js',
        'plugins/both/collection.js',
        'plugins/both/collection-behavior.js',
        'plugins/both/user.js'
    ]);


    api.addFiles([
        'plugins/server/method.js',
        'plugins/server/collection-methods.js',
        'plugins/server/collection-security.js',
        'plugins/server/collection-hooks.js',
        'plugins/server/collection-exposure/filter-manipulator.js',
        'plugins/server/collection-exposure/collection-exposure.js',
    ], 'server');

    api.addFiles([
        'plugins/client/collection-exposure.js',
        'plugins/client/template.js',
        'plugins/client/viewmodel.js',
        'plugins/client/template-behavior.js',
        'plugins/client/paginator/paginator-service.coffee',
        'plugins/client/paginator/paginator.html',
        'plugins/client/paginator/paginator.coffee',
        'plugins/client/template-listify.js',
        'plugins/client/template-crudify.js',
        'plugins/client/template-formify.js'
    ], 'client');

    api.addFiles([
        'templateHelpers/roles.js',
        'templateHelpers/general.js'
    ], 'client');

    api.addFiles('boot.js');

    api.export(['tpl', 'tplData', 'data', 'form'], 'client');
    api.export(['Q', 'QF', 'Any']); // used by schema
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('cultofcoders:quantum-framework');
});
