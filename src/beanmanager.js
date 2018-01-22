import  Map from 'core-js/library/fn/map';
import {exists, checkMethod, checkParam} from './utils';
import { LoggerFactory } from './logging';

export default class BeanManager {

    constructor(classRepository) {
        checkMethod('BeanManager(classRepository)');
        checkParam(classRepository, 'classRepository');

        this.classRepository = classRepository;
        this.addedHandlers = new Map();
        this.removedHandlers = new Map();
        this.updatedHandlers = new Map();
        this.arrayUpdatedHandlers = new Map();
        this.allAddedHandlers = [];
        this.allRemovedHandlers = [];
        this.allUpdatedHandlers = [];
        this.allArrayUpdatedHandlers = [];

        let self = this;
        this.classRepository.onBeanAdded((type, bean) => {
            let handlerList = self.addedHandlers.get(type);
            if (exists(handlerList)) {
                handlerList.forEach((handler) => {
                    try {
                        handler(bean);
                    } catch (e) {
                        BeanManager.LOGGER.error('An exception occurred while calling an onBeanAdded-handler for type', type, e);
                    }
                });
            }
            self.allAddedHandlers.forEach((handler) => {
                try {
                    handler(bean);
                } catch (e) {
                    BeanManager.LOGGER.error('An exception occurred while calling a general onBeanAdded-handler', e);
                }
            });
        });
        this.classRepository.onBeanRemoved((type, bean) => {
            let handlerList = self.removedHandlers.get(type);
            if (exists(handlerList)) {
                handlerList.forEach((handler) => {
                    try {
                        handler(bean);
                    } catch (e) {
                        BeanManager.LOGGER.error('An exception occurred while calling an onBeanRemoved-handler for type', type, e);
                    }
                });
            }
            self.allRemovedHandlers.forEach((handler) => {
                try {
                    handler(bean);
                } catch (e) {
                    BeanManager.LOGGER.error('An exception occurred while calling a general onBeanRemoved-handler', e);
                }
            });
        });
        this.classRepository.onBeanUpdate((type, bean, propertyName, newValue, oldValue) => {
            let handlerList = self.updatedHandlers.get(type);
            if (exists(handlerList)) {
                handlerList.forEach((handler) => {
                    try {
                        handler(bean, propertyName, newValue, oldValue);
                    } catch (e) {
                        BeanManager.LOGGER.error('An exception occurred while calling an onBeanUpdate-handler for type', type, e);
                    }
                });
            }
            self.allUpdatedHandlers.forEach((handler) => {
                try {
                    handler(bean, propertyName, newValue, oldValue);
                } catch (e) {
                    BeanManager.LOGGER.error('An exception occurred while calling a general onBeanUpdate-handler', e);
                }
            });
        });
        this.classRepository.onArrayUpdate((type, bean, propertyName, index, count, newElements) => {
            let handlerList = self.arrayUpdatedHandlers.get(type);
            if (exists(handlerList)) {
                handlerList.forEach((handler) => {
                    try {
                        handler(bean, propertyName, index, count, newElements);
                    } catch (e) {
                        BeanManager.LOGGER.error('An exception occurred while calling an onArrayUpdate-handler for type', type, e);
                    }
                });
            }
            self.allArrayUpdatedHandlers.forEach((handler) => {
                try {
                    handler(bean, propertyName, index, count, newElements);
                } catch (e) {
                    BeanManager.LOGGER.error('An exception occurred while calling a general onArrayUpdate-handler', e);
                }
            });
        });


    }


    notifyBeanChange(bean, propertyName, newValue) {
        checkMethod('BeanManager.notifyBeanChange(bean, propertyName, newValue)');
        checkParam(bean, 'bean');
        checkParam(propertyName, 'propertyName');

        return this.classRepository.notifyBeanChange(bean, propertyName, newValue);
    }


    notifyArrayChange(bean, propertyName, index, count, removedElements) {
        checkMethod('BeanManager.notifyArrayChange(bean, propertyName, index, count, removedElements)');
        checkParam(bean, 'bean');
        checkParam(propertyName, 'propertyName');
        checkParam(index, 'index');
        checkParam(count, 'count');
        checkParam(removedElements, 'removedElements');

        this.classRepository.notifyArrayChange(bean, propertyName, index, count, removedElements);
    }


    isManaged(bean) {
        checkMethod('BeanManager.isManaged(bean)');
        checkParam(bean, 'bean');

        // TODO: Implement dolphin.isManaged() [DP-7]
        throw new Error("Not implemented yet");
    }


    create(type) {
        checkMethod('BeanManager.create(type)');
        checkParam(type, 'type');

        // TODO: Implement dolphin.create() [DP-7]
        throw new Error("Not implemented yet");
    }


    add(type, bean) {
        checkMethod('BeanManager.add(type, bean)');
        checkParam(type, 'type');
        checkParam(bean, 'bean');

        // TODO: Implement dolphin.add() [DP-7]
        throw new Error("Not implemented yet");
    }


    addAll(type, collection) {
        checkMethod('BeanManager.addAll(type, collection)');
        checkParam(type, 'type');
        checkParam(collection, 'collection');

        // TODO: Implement dolphin.addAll() [DP-7]
        throw new Error("Not implemented yet");
    }


    remove(bean) {
        checkMethod('BeanManager.remove(bean)');
        checkParam(bean, 'bean');

        // TODO: Implement dolphin.remove() [DP-7]
        throw new Error("Not implemented yet");
    }


    removeAll(collection) {
        checkMethod('BeanManager.removeAll(collection)');
        checkParam(collection, 'collection');

        // TODO: Implement dolphin.removeAll() [DP-7]
        throw new Error("Not implemented yet");
    }


    removeIf(predicate) {
        checkMethod('BeanManager.removeIf(predicate)');
        checkParam(predicate, 'predicate');

        // TODO: Implement dolphin.removeIf() [DP-7]
        throw new Error("Not implemented yet");
    }


    onAdded(type, eventHandler) {
        let self = this;
        if (!exists(eventHandler)) {
            eventHandler = type;
            checkMethod('BeanManager.onAdded(eventHandler)');
            checkParam(eventHandler, 'eventHandler');

            self.allAddedHandlers = self.allAddedHandlers.concat(eventHandler);
            return {
                unsubscribe: function () {
                    self.allAddedHandlers = self.allAddedHandlers.filter((value) => {
                        return value !== eventHandler;
                    });
                }
            };
        } else {
            checkMethod('BeanManager.onAdded(type, eventHandler)');
            checkParam(type, 'type');
            checkParam(eventHandler, 'eventHandler');

            let handlerList = self.addedHandlers.get(type);
            if (!exists(handlerList)) {
                handlerList = [];
            }
            self.addedHandlers.set(type, handlerList.concat(eventHandler));
            return {
                unsubscribe: () => {
                    let handlerList = self.addedHandlers.get(type);
                    if (exists(handlerList)) {
                        self.addedHandlers.set(type, handlerList.filter(function (value) {
                            return value !== eventHandler;
                        }));
                    }
                }
            };
        }
    }


    onRemoved(type, eventHandler) {
        let self = this;
        if (!exists(eventHandler)) {
            eventHandler = type;
            checkMethod('BeanManager.onRemoved(eventHandler)');
            checkParam(eventHandler, 'eventHandler');

            self.allRemovedHandlers = self.allRemovedHandlers.concat(eventHandler);
            return {
                unsubscribe: () => {
                    self.allRemovedHandlers = self.allRemovedHandlers.filter((value) => {
                        return value !== eventHandler;
                    });
                }
            };
        } else {
            checkMethod('BeanManager.onRemoved(type, eventHandler)');
            checkParam(type, 'type');
            checkParam(eventHandler, 'eventHandler');

            let handlerList = self.removedHandlers.get(type);
            if (!exists(handlerList)) {
                handlerList = [];
            }
            self.removedHandlers.set(type, handlerList.concat(eventHandler));
            return {
                unsubscribe: () => {
                    let handlerList = self.removedHandlers.get(type);
                    if (exists(handlerList)) {
                        self.removedHandlers.set(type, handlerList.filter((value) => {
                            return value !== eventHandler;
                        }));
                    }
                }
            };
        }
    }


    onBeanUpdate(type, eventHandler) {
        let self = this;
        if (!exists(eventHandler)) {
            eventHandler = type;
            checkMethod('BeanManager.onBeanUpdate(eventHandler)');
            checkParam(eventHandler, 'eventHandler');

            self.allUpdatedHandlers = self.allUpdatedHandlers.concat(eventHandler);
            return {
                unsubscribe: function () {
                    self.allUpdatedHandlers = self.allUpdatedHandlers.filter((value) => {
                        return value !== eventHandler;
                    });
                }
            };
        } else {
            checkMethod('BeanManager.onBeanUpdate(type, eventHandler)');
            checkParam(type, 'type');
            checkParam(eventHandler, 'eventHandler');

            let handlerList = self.updatedHandlers.get(type);
            if (!exists(handlerList)) {
                handlerList = [];
            }
            self.updatedHandlers.set(type, handlerList.concat(eventHandler));
            return {
                unsubscribe: () => {
                    let handlerList = self.updatedHandlers.get(type);
                    if (exists(handlerList)) {
                        self.updatedHandlers.set(type, handlerList.filter((value) => {
                            return value !== eventHandler;
                        }));
                    }
                }
            };
        }
    }

    onArrayUpdate(type, eventHandler) {
        let self = this;
        if (!exists(eventHandler)) {
            eventHandler = type;
            checkMethod('BeanManager.onArrayUpdate(eventHandler)');
            checkParam(eventHandler, 'eventHandler');

            self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.concat(eventHandler);
            return {
                unsubscribe: () => {
                    self.allArrayUpdatedHandlers = self.allArrayUpdatedHandlers.filter((value) => {
                        return value !== eventHandler;
                    });
                }
            };
        } else {
            checkMethod('BeanManager.onArrayUpdate(type, eventHandler)');
            checkParam(type, 'type');
            checkParam(eventHandler, 'eventHandler');

            let handlerList = self.arrayUpdatedHandlers.get(type);
            if (!exists(handlerList)) {
                handlerList = [];
            }
            self.arrayUpdatedHandlers.set(type, handlerList.concat(eventHandler));
            return {
                unsubscribe: () => {
                    let handlerList = self.arrayUpdatedHandlers.get(type);
                    if (exists(handlerList)) {
                        self.arrayUpdatedHandlers.set(type, handlerList.filter((value) => {
                            return value !== eventHandler;
                        }));
                    }
                }
            };
        }
    }
}

BeanManager.LOGGER = LoggerFactory.getLogger('BeanManager');
