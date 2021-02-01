const bcrypt = require('bcryptjs');

class Password {

    genera() {
        let charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let pass = Array.apply(null, Array(10)).map(function () {
            return charSet.charAt(Math.random() * charSet.length);
        }).join('');
        return pass;
    }

    async encripta(pass) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(pass, salt);
    };

    async valida(encriptada, normal) {
        const val = await bcrypt.compare(normal, encriptada);
        return val;
    };

}

module.exports = Password;