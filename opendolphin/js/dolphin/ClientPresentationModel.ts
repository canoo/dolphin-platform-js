import { ClientAttribute, ValueChangedEvent } from './ClientAttribute'
import EventBus from './EventBus'


export interface InvalidationEvent {
    source: ClientPresentationModel;
}
var presentationModelInstanceCount = 0; // todo dk: consider making this static in class

export class ClientPresentationModel {

    private attributes:ClientAttribute[] = [];
    clientSideOnly:boolean = false;
    private dirty:boolean = false;
    private invalidBus:EventBus<InvalidationEvent>;
    private dirtyValueChangeBus:EventBus<ValueChangedEvent>;

    constructor(public id:string, public presentationModelType:string) {
        if (typeof id !== 'undefined' && id != null) { // even an empty string is a valid id
            this.id = id;
        } else {
            this.id = (presentationModelInstanceCount++).toString();
        }
        this.invalidBus = new EventBus();
        this.dirtyValueChangeBus = new EventBus();
    }

    // todo dk: align with Java version: move to ClientDolphin and auto-add to model store
    /** a copy constructor for anything but IDs. Per default, copies are client side only, no automatic update applies. */
    copy() {
        var result = new ClientPresentationModel(null, this.presentationModelType);
        result.clientSideOnly = true;
        this.getAttributes().forEach( (attribute: ClientAttribute) => {
            var attributeCopy = attribute.copy();
            result.addAttribute(attributeCopy);
        });
        return result;
    }

    //add array of attributes
    addAttributes(attributes:ClientAttribute[]){
        if(!attributes || attributes.length < 1) return;
        attributes.forEach(attr => {
            this.addAttribute(attr);
        });
    }
    addAttribute(attribute:ClientAttribute) {
        if(!attribute || (this.attributes.indexOf(attribute)>-1)){
            return;
        }
        if(this.findAttributeByPropertyName(attribute.propertyName)){
            throw new Error("There already is an attribute with property name: " + attribute.propertyName
                +" in presentation model with id: "+ this.id);
        }
        if(attribute.getQualifier() && this.findAttributeByQualifier(attribute.getQualifier())){
            throw new Error("There already is an attribute with qualifier: " + attribute.getQualifier()
                +" in presentation model with id: "+ this.id);
        }
        attribute.setPresentationModel(this);
        this.attributes.push(attribute);
        attribute.onValueChange((evt:ValueChangedEvent)=> {
            this.invalidBus.trigger({source: this});
        });
    }

    onInvalidated(handleInvalidate:(InvalidationEvent) => void) {
        this.invalidBus.onEvent(handleInvalidate);
    }

    /** returns a copy of the internal state */
    getAttributes(): ClientAttribute[]{
        return this.attributes.slice(0);
    }
    getAt(propertyName:string):ClientAttribute{
        return this.findAttributeByPropertyName(propertyName);
    }

    findAllAttributesByPropertyName(propertyName: string): ClientAttribute[]{
        var result:ClientAttribute[] = [];
        if(!propertyName) return null;
        this.attributes.forEach((attribute:ClientAttribute) => {
            if(attribute.propertyName == propertyName){
                result.push(attribute);
            }
        });
        return result;
    }

    findAttributeByPropertyName(propertyName:string): ClientAttribute{
        if(!propertyName) return null;
        for(var i=0;i<this.attributes.length;i++){
            if((this.attributes[i].propertyName == propertyName)){
                return this.attributes[i];
            }
        }
        return null;
    }
    findAttributeByQualifier(qualifier:string): ClientAttribute{
        if(!qualifier) return null;
        for(var i=0;i<this.attributes.length;i++){
            if(this.attributes[i].getQualifier() == qualifier){
                return this.attributes[i];
            }
        };
        return null;
    }

    findAttributeById(id:string): ClientAttribute{
        if(!id) return null;
        for(var i=0;i<this.attributes.length;i++){
            if(this.attributes[i].id == id){
                return this.attributes[i];
            }
        };
        return null;
    }

    syncWith(sourcePresentationModel: ClientPresentationModel): void{
        this.attributes.forEach((targetAttribute:ClientAttribute) => {
            var sourceAttribute = sourcePresentationModel.getAt(targetAttribute.propertyName);
            if(sourceAttribute){
                targetAttribute.syncWith(sourceAttribute);
            }
        });
    }

}
