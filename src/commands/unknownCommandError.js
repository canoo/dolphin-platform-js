
export default class UnknownCommandError extends Error {
    constructor(commandType) {
        super('Command of type ' + commandType + ' can not be handled');
    }
}