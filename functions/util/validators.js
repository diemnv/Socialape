const isEmail = (email) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regex))
        return true;
    return false
}

const isEmpty = (string) => {
    if(string.trim() === '')
        return true
    return false
}

module.exports.validateSingupData = (data) => {
    let errors = {};
    if(!isEmail(data.email)) {
        errors.email = 'Must be a valid email address'
    } else if(isEmpty(data.email)) {
        errors.email = 'Must be not empty'
    }

    if(isEmpty(data.password)) {
        errors.password = 'Must not be empty';
    } else if(data.password !== data.confirmPassword) {
        errors.password = 'Password not match';
    }

    if(isEmpty(data.handle)) {
        errors.handle = 'Must not be empty';
    }

    if(Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    return {
        errors,
        valid: Object.keys(errors).length > 0 ? false:true
    }
}


module.exports.validateLoginData = data => {
    let errors = {}

    if(!isEmail(data.email)) {
        errors.email = 'Must be invalid email';
    } else if(isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    }

    if(isEmpty(data.password)) {
        errors.password = 'Must not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length > 0 ? false:true
    }

}

exports.reducerUserDetails = (data) => {
    let userDetails = {};
    if(!isEmpty(data.bio.trim())) {
        userDetails.bio = data.bio;
    }

    if(!isEmpty(data.website.trim())) {
        if(data.website.trim().substring(0, 4) != 'http') {
            userDetails.website = `http://${data.website.trim()}`;
        } else {
            userDetails.website = data.website;
        }
    }

    if(!isEmpty(data.location.trim())) {
        userDetails.location = data.location;
    }

    return userDetails;
}