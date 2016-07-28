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
            let atom = Quantum.instance.add(pluginName, atomName, config);
            if (atom.result) {
                return atom.result;
            }
        }
    }

    [pluginName, atomName] = string.split(' ');
};

MQ = function (plugin, config) {
  _.each(config, (atomConfig, atomName) => {
        QF.add(plugin, atomName, atomConfig);
    })
};

S = function(atomName, atomConfig) {
    if (atomConfig === undefined) {
        return QF.use('service', atomName);
    } else {
        return QF.add('service', atomName, atomConfig);
    }
};

QF = Quantum.instance = new Quantum.Model.Body();
