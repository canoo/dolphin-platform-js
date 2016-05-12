export default class Tag {

    //Implemented as function so that it will never be changed from outside
    /** The actual value of the attribute. This is the default if no tag is given.*/
    public static value = () =>{
        return "VALUE";
    };

    /** the to-be-displayed String, not the key. I18N happens on the server. */
    static label = () =>{
        return "LABEL";
    };

    /** If the attribute represent tooltip**/
    static tooltip = () =>{
        return "TOOLTIP";
    };

    /** "true" or "false", maps to Grails constraint nullable:false */
    static mandatory = () =>{
        return "MANDATORY";
    };

    /** "true" or "false", maps to Grails constraint display:true */
    static visible = () =>{
        return "VISIBLE";
    };

    /** "true" or "false" */
    static enabled = () =>{
        return "ENABLED";
    };

    /** regular expression for local, syntactical constraints like in "rejectField" */
    static regex = () =>{
        return "REGEX";
    };

    /** a single text; e.g. "textArea" if the String value should be displayed in a text area instead of a textField */
    static widgetHint = () =>{
        return "WIDGET_HINT";
    };

    /** a single text; e.g. "java.util.Date" if the value String represents a date */
    static valueType = () =>{
        return "VALUE_TYPE";
    };
}
