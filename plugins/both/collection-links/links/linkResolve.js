export class LinkResolve {
    constructor(linker, object) {
        this.linker = linker;
        this.object = object;
    }

    find() {
        const config = this.linker.linkConfig;

        return config.resolve(this.object);
    }

    fetch() {
        let data;

        const potentialCursor = this.find();
        if (potentialCursor && potentialCursor._mongo) {
            data = potentialCursor.fetch();
        } else {
            data = potentialCursor;
        }

        return data;
    }
}