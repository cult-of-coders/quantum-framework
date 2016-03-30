Package.describe({
    name: 'cultofcoders:quantum-framework',
    version: '0.0.1',
    summary: 'Aggregates the quantum framework core and plugins.',
    git: 'https://github.com/cult-of-coders/quantum-framework.git',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');

    var packages = [
        'coffeescript',
        'ecmascript',
        'cultofcoders:quantum-core@0.0.1',
        'manuel:viewmodel@4.0.6',
        'aldeed:autoform@5.8.1',
        'alanning:roles@1.2.15',
        'raix:handlebar-helpers@0.2.5',
        'aldeed:template-extension@4.0.0',
        'yasaricli:slugify@0.0.7',
        'matb33:collection-hooks@0.8.1',
        'reywood:publish-composite@1.4.2',
        'aldeed:collection2@2.9.1',
        'dburles:collection-helpers@1.0.4'
    ];

    api.use(packages);
    api.imply(packages);

    // plugins
    api.addFiles([
        'plugins/both/datastore.js',
        'plugins/both/schema.js',
        'plugins/both/service.js',
        'plugins/both/collection.js'
    ]);


    api.addFiles([
        'plugins/server/collection-methods.js',
        'plugins/server/collection-security.js',
        'plugins/server/collection-hooks.js',
        'plugins/server/collection-exposure/filter-manipulator.js',
        'plugins/server/collection-exposure/collection-exposure.js'
    ], 'server');

    api.addFiles([
        'plugins/client/collection-exposure.js',
        'plugins/client/template.js',
        'plugins/client/viewmodel.js',
        'plugins/client/template-behaviors.js',
        'plugins/client/paginator/paginator-service.coffee',
        'plugins/client/paginator/paginator.html',
        'plugins/client/paginator/paginator.coffee',
        'plugins/client/template-listify.js',
        'plugins/client/template-formify.js'
    ], 'client');

    // others
    api.addFiles([
        'lib/roles.js'
    ]);

    api.addFiles([
        'templateHelpers/roles.js',
        'templateHelpers/general.js',
        'views/include.html',
        'views/include.js'
    ], 'client');

    api.addFiles('boot.js');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('cultofcoders:quantum-framework');
});
