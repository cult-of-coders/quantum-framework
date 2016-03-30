/**
 * Returns template instance.
 *
 * @returns {Blaze.TemplateInstance}
 */
tpl = function() {
    return Template.instance()
};

/**
 * Set get store data from a hash.
 *
 * @param keyOrObject
 * @param optionalValue
 * @returns {*}
 */
data = function(keyOrObject, optionalValue) {
    if (!tpl()._reactiveData) {
        tpl()._reactiveData = new ReactiveVar(Template.instance().data || {})
    }

    let _data = tpl()._reactiveData.get();

    // wants to get the whole data
    if (keyOrObject === undefined) {
        return _data;
    }

    // wants to set the whole data
    if (typeof(keyOrObject) === 'object') {
        tpl()._reactiveData.set(keyOrObject);
    }

    // wants to get a key
    if (optionalValue === undefined) {
        return _data[keyOrObject];
    }

    // wants to set the key
    _data[keyOrObject] = optionalValue;
    tpl()._reactiveData.set(_data);
};


Template.registerHelper('tpl', function () {
    return tpl();
});

Template.registerHelper('data', function (...args) {
    return data(...args);
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
Template.registerHelper('formatDate', function(date) {
    return moment(date).format('DD/MM/YYYY');
});

Template.registerHelper('formatDateCustom', function(date, format) {
    return moment(date).format(format);
});

Template.registerHelper('formatDateSince', function(date) {
    return moment(date).fromNow();
});

Template.registerHelper('formatNumber', function(number) {
    if (number === 0) {
        return 'No time logged';
    }

    return (number.toFixed(2)) + "h";
});

Template.registerHelper('fieldValue', function(field) {
    return AutoForm.getFieldValue(field);
});

Template.registerHelper('ifFieldValue', function(field, value) {
    return AutoForm.getFieldValue(field) === value;
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