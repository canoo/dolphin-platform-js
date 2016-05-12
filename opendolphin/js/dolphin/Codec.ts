export default class Codec {

    encode(commands:any) {
        return JSON.stringify(commands); // todo dk: look for possible API support for character encoding
    }

    decode(transmitted:any) {
        if (typeof transmitted == 'string') {
            return JSON.parse(transmitted);
        } else {
            return transmitted;
        }
    }
}
