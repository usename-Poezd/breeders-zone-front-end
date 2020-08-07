const toFormData = (obj, form, namespace) => {
    let fd = form || new FormData();
    let formKey;



    for(let property in obj) {
        if(obj.hasOwnProperty(property) && obj[property] !== null && obj[property] !== undefined) {
            if (namespace) {
                formKey = namespace + '[' + property + ']';
            } else {
                formKey = property;
            }

            // if the property is an object, but not a File, use recursivity.
            if (obj[property] instanceof Date) {
                fd.append(formKey, obj[property].toISOString());
            }
            else if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
                toFormData(obj[property], fd, formKey);
            }
            else if (typeof obj[property] === 'boolean') {
                fd.append(formKey, obj[property] ? '1' : '0');
            }
            else { // if it's a string or a File object
                fd.append(formKey, obj[property]);
            }
        }
    }

    return fd;
};

export default toFormData;
