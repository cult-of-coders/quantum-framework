export class FieldNode {
    get types() {
        return ['field', 'link']
    }
    constructor(name, body) {
        this.name = name;
        this.body = body;
    }

    applyFields(fields) {
        fields[this.name] = this.body;
    }
}