export default class EventBus<T> {
    private eventHandlers = [];
    onEvent(eventHandler: (event : T) => void ) {
        this.eventHandlers.push(eventHandler);
    }
    trigger(event : T ) {
        this.eventHandlers.forEach(handle => handle(event));
    }
}
