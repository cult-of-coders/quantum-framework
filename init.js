Q = function(string, config) {
    let parts = string.split(' ');
    if (parts.length === 1) {
        // it refers to the plugin
        if (config === undefined) {
            return Quantum.instance.plugin(string);
        } else {
            Quantum.instance.plugin(string)._configure(config);
        }
    } else {
        // if refers to the atom
        [pluginName, atomName] = parts;
        if (config === undefined) {
            return Quantum.instance.use(pluginName, atomName);
        } else {
            Quantum.instance.add(pluginName, atomName, config);
        }
    }

    [pluginName, atomName] = string.split(' ');
};

QF = Quantum.instance = new Quantum.Model.Body();
