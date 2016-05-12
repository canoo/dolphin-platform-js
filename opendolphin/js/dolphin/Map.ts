export default class Map<K,V> {

    private keys:K[];
    private data:V[];

    constructor() {
        this.keys = [];
        this.data = [];
    }

    put(key:K, value:V) {
        if (!this.containsKey(key)) {
            this.keys.push(key);
        }
        this.data[this.keys.indexOf(key)] = value;
    }

    get(key:K):V {
        return this.data[this.keys.indexOf(key)];
    }

    remove(key:K):boolean {
        if (this.containsKey(key)) {
            var index:number = this.keys.indexOf(key);
            this.keys.splice(index, 1);
            this.data.splice(index, 1);
            return true;
        }
        return false;
    }

    isEmpty():boolean {
        return this.keys.length == 0;
    }

    length():number {
        return this.keys.length;
    }

    forEach(handler:(key:K, value:V) => void) {
        for (var i = 0; i < this.keys.length; i++) {
            handler(this.keys[i], this.data[i]);
        }
    }

    containsKey(key:K):boolean {
        return this.keys.indexOf(key) > -1;
    }

    containsValue(value:V):boolean {
        return this.data.indexOf(value) > -1;
    }

    values():V[] {
        return this.data.slice(0);
    }

    keySet():K[] {
        return this.keys.slice(0);
    }

}
