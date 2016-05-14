/**
 * Returns template instance.
 *
 * @returns {Blaze.TemplateInstance}
 */
tpl = function() {
    return Template.instance()
};

/**
 *
 * @param key
 * @param formId
 * @returns {*}
 */
formField = function (key, formId) {
    return AutoForm.getFieldValue(key, formId);
};

Template.registerHelper('tpl', function () {
    return tpl();
});

Template.registerHelper('dump', function (...args) {
    return console.log(...args);
});

Template.registerHelper('formField', function (key, formId) {
    return formField(key, formId);
});

Template.registerHelper('ifFormField', function (value, key, formId) {
    return value === formField(key, formId);
});

Template.registerHelper('selectize', function(object) {
    return _.map(object, function(value, label) {
        return {
            value: value,
            label: label
        };
    });
});

Template.registerHelper('setting', function(name) {
    return Meteor.settings["public"][name];
});

Template.registerHelper('slugify', function(value) {
    return slugify(value, '-');
});

Template.registerHelper('querify', function(name, val) {
    return name + '=' + val;
});

Template.registerHelper('nl2br', function(value) {
    if (value) {
        return value.replace(/\n/g, '<br />');
    } else {
        return '';
    }
});

Template.registerHelper('truncate', function(value, limit) {
    var newText;
    if (!value) {
        return '';
    }
    newText = value.substr(0, limit);
    if (value.length > limit) {
        newText = newText + '...';
    }
    return newText;
});