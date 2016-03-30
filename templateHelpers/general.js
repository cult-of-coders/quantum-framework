tpl = function() {
    return Template.instance()
};

tpl_data = function() {
    return Template.instance().data || {};
};

Template.registerHelper('_tpl', function () {
    return tpl();
});

Template.registerHelper('_data', function () {
    return tpl_data();
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