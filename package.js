Package.describe({
    name: 'cultofcoders:quantum-framework',
    version: '1.1.5',
    summary: 'The Quantum Framework',
    git: 'https://github.com/cult-of-coders/quantum-framework.git',
    documentation: 'README.md'
});

Npm.depends({
    'less': '2.7.1'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');

    var packages = [
        'cultofcoders:quantum-core@1.1.1',
        'meteor-base',
        'mobile-experience',
        'mongo',
        'templating',
        'blaze-html-templates',
        'session',
        'jquery',
        'email',
        'tracker',
        'check',
        'random',
        'reactive-var',
        'standard-minifiers',
        'es5-shim',
        'ecmascript',
        'accounts-base',
        'aldeed:autoform@5.8.1',
        'alanning:roles@1.2.15',
        'raix:handlebar-helpers@0.2.5',
        'matb33:collection-hooks@0.8.1',
        'reywood:publish-composite@1.4.2',
        'aldeed:collection2@2.9.1',
        'aldeed:simple-schema@1.5.3',
        'dburles:collection-helpers@1.0.4',
        'meteorhacks:ssr@2.2.0'
    ];

    api.use(packages);
    api.imply(packages);

    api.use([
        'sacha:juice@0.1.4'
    ]);

    // others
    api.addFiles([
        'init.js',
        'lib/any.js'
    ]);

    // plugins
    api.addFiles([
        'plugins/both/datastore.js',
        'plugins/both/schema.js',
        'plugins/both/enum.js',
        'plugins/both/service.js',
        'plugins/both/collection.js',
        'plugins/both/collection-hooks.js',
        'plugins/both/collection-behavior.js',
        'plugins/both/user.js',
        'plugins/both/method.js',
        'plugins/both/collection-mutators.js'
    ]);

    api.addFiles([
        'services/roles.js',
        'services/quantum.utils.js'
    ]);

    api.addFiles([
        'plugins/server/collection-exposure/filter-manipulator.js',
        'plugins/server/collection-exposure/collection-exposure.js',
        'plugins/server/email/atom.schema.js',
        'plugins/server/email/mailer.service.js',
        'plugins/server/email/email.js'
    ], 'server');

    api.addFiles([
        'plugins/client/template.js',
        'plugins/client/template-handler.js',
        'plugins/client/template-behavior.js',
        'plugins/client/template-state.js',
        'plugins/client/template-service.js',
        'plugins/client/paginator/paginator-service.js',
        'plugins/client/paginator/paginator.html',
        'plugins/client/paginator/paginator.js',
        'plugins/client/crudify.js',
        'plugins/client/template-listify.js',
        'plugins/client/template-formify.js'
    ], 'client');

    api.addFiles([
        'templateHelpers/roles.js',
        'templateHelpers/general.js'
    ], 'client');

    api.addFiles('boot.js');

    api.export(['tpl'], 'client');
    api.export(['Q', 'MQ', 'QF', 'Any']); // used by schema
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('cultofcoders:quantum-framework');
});
