/**
 * Set of values required for Cipher to work.
 */
module.exports.globalParams={
    'keyStr': '!@#$%^&*()-_=+[]{}|`~,./<>?qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM',
    'LkeyStr':89
}

/**
 * Calculates bit-wise XOR of two strings and returns a new string with length of the greater of the two strings.
 * @param {String} l : String 1
 * @param {String} r : String 2
 */
module.exports.calculateXOR=function calculateXOR(l, r){
    let x=0, y=0;
    let res="";
    for(let i=0; i<Math.max(l.length, r.length); i++){
        if(x<l.length && y<r.length) res+=String.fromCharCode(l.charCodeAt(x)^r.charCodeAt(y));
        else if(x>=l.length) res+=String.fromCharCode(0^r.charCodeAt(y));
        else res+=String.fromCharCode(0^l.charCodeAt(x));
        x++; y++;
    }
    return res;
}

/**
 * The function generates a random Key using the globalParams.keyStr
 * @param {Number} sL:  Length of the key to be generated
 */
module.exports.getNewKey=function getNewKey(sL){
    let res="";
    for(let i=0; i<sL; i++){
        res+=this.globalParams.keyStr[Math.floor(Math.random()*(this.globalParams.LkeyStr))];
    }
    return res;
}

/**
 * Encrypts a given string with the key of same length (if custom key is not given)
 * @param {string} r : string to encrypt
 * @param {string} key : string to use while encrypting
 * @param {boolean} nkey : set to false, if usig custom key
 */
module.exports.cryptWithKey=function cryptWithKey(r, key="", nkey=true){
    let res={nkey}
    if(nkey || key.length>r.length){
        key=getNewKey(r.length);
        res.nkey=true
    }
    res.key=key;
    res.crypt=calculateXOR(res.key, r);
    return res;
}

/**
 * Encrypts the supplied left and right blocks of text using Fiestel Cipher and returns new blocks and the keys used for the encryption. 
 * @param {string} l : left cipher-block
 * @param {string} r : right cipher-block
 * @param {number} rounds : number of rounds for which you want to run encryption
 */
module.exports.encrypt=function encrypt(l, r, rounds=3){
    let res={keys: [], l:"", r:"", rounds}, rnd={}, temp;
    for(let i=0; i<rounds; i++){
        temp=cryptWithKey(r);
        res.keys.push(temp.key);
        temp=calculateXOR(l, temp.crypt);
        l=r;
        r=temp;
    }
    res.l=r;
    res.r=l;
    return res;
}

/**
 * Decrypts the supplied left and right blocks of Fiestel Cipher and returns the de-crypted blocks. Requires the keys used in original order.
 * @param {string} l : left cipher-block
 * @param {string} r : right cipher-block
 * @param {string[]} keys : 
 * @param {number} rounds : number of rounds for which cipher was run
 */
module.exports.decrypt=function decrypt(l, r, keys, rounds=3){
    let res={keys: [], l:"", r:"", rounds}, temp, key;
    for(let i=0; i<rounds; i++){
        key=keys[rounds-i-1];
        temp=cryptWithKey(r, key, nkey=false);
        res.keys.push(temp.key);
        temp=calculateXOR(l, temp.crypt);
        l=r;
        r=temp;
    }
    res.l=r;
    res.r=l;
    return res;
}

/**
 * Creates cipher blocks from the supplied string.
 * @param {string} s : String to make cipher blocks from
 */
module.exports.makeBlocks=function makeBlocks(s){
    let res={};
    if(s.length%2!=0){
        s+=' ';
    }
    res.l=s.substring(0, s.length/2);
    res.r=s.substring(s.length/2);
    return res;
}

/**
 * Converts cipher blocks to String (Concatenates it)
 * @param {string} l : left cipher block
 * @param {string} r : right cipher block
 */
module.exports.destroyBlocks=function destroyBlocks(l, r){
    return l+r;
}