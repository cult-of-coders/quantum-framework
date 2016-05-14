const less = Npm.require('less');
const Future = Npm.require('fibers/future');

QF.add('service', 'quantum.email.atom', {
    factory: true,
    definition: class {
        constructor(Assets, atom) {
            this.Assets = Assets;
            this.atom = atom;
            this.config = atom.config;
            this.plugin = QF.plugin('email');
        }

        /**
         * Send the Email to the Destination
         *
         * @param to
         * @param data
         * @param emailConfig
         * @param attachments
         * @returns {*}
         */
        send(to, data, emailConfig, attachments) {
            let config = _.extend({}, this.config, emailConfig);
            let html = this._applyStyles(
                this._getHtml(emailConfig, data)
            );

            let subject = this._getSubject(emailConfig, data);

            // for debugging purposes we either dump to console, either send all emails to a single user
            let testConfig = this.plugin.config('test');
            if (testConfig === console) {
                return this._dumpToConsole(to, subject, data, attachments, html);
            } else if (testConfig instanceof String) {
                to = testConfig;
            }

            return Email.send({
                subject: subject,
                to: to,
                from: config.from,
                html: html,
                attachments: attachments
            });
        }

        /**
         *
         * @param emailConfig
         * @param data
         * @private
         */
        _getSubject(emailConfig, data) {
            let resultify = (value) => {
                return (value instanceof Function) ? value(data) : value;
            };

            if (emailConfig.subject) {
                return resultify(emailConfig.subject);
            }

            return resultify(this.config.subject);
        }

        _dumpToConsole(to, subject, data, attachments, html) {
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Data: ${JSON.stringify(data)}`);
            console.log(`Attachments: ${JSON.stringify(attachments)}`);
            console.log(`Content:`);
            console.log(`=====================================================`);
            console.log(html);
            console.log(`=====================================================`);
        }

        _getHtml(emailConfig, data) {
            let templateName = this.atom.name;
            let helpers = this._getHelpers(emailConfig);
            let content = this.Assets.getText(this.config.template);

            SSR.compileTemplate(templateName, content);
            Template[templateName].helpers(helpers);

            let layoutText = this._getLayoutText(emailConfig);
            if (layoutText) {
                let layoutName = 'Layout' + Random.id();
                SSR.compileTemplate(layoutName, layoutText);
                Template[layoutName].helpers(helpers);

                let childHtml = SSR.render(templateName, data);

                return SSR.render(layoutName, {childHtml: childHtml}, data);
            } else {
                return SSR.render(templateName, data);
            }
        }

        /**
         * @param emailConfig
         * @returns {String}
         */
        _getLayoutText(emailConfig) {
            if (emailConfig.layout === null) return;

            if (emailConfig.layout) {
                return Assets.getText(emailConfig.layout);
            }

            if (this.config.layout) {
                if (this.config.layout === null) return;

                return this.Assets.getText(this.config.layout);
            }

            if (this.plugin.config('layout')) {
                return this.plugin.config('reader').getText(this.plugin.config('layout'));
            }
        }

        /**
         *
         * @param emailConfig
         * @returns {*}
         */
        _getHelpers(emailConfig) {
            let helpers =  emailConfig.helpers || {};
            if (this.config.helpers) _.extend(helpers, this.config.helpers);
            if (this.plugin.config('helpers')) _.extend(helpers, this.plugin.config('helpers'));

            return helpers;
        }

        _applyStyles(html) {
            let styleContent = '';

            if (this.plugin.config('less')) {
                styleContent += this.plugin.config('reader').getText(this.plugin.config('less'));
            }

            if (this.config.less) {
                styleContent += '\n' + this.Assets.getText(this.config.less);
            }

            if (styleContent === '') return html;

            const f = new Future;
            less.render(styleContent, {}, f.resolver());
            let output = f.wait();

            let styledHtml = `<style>${output.css}</style>` + html;

            return juice(styledHtml);
        }
    }
});