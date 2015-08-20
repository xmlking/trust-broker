import bcrypt from 'bcrypt';

/**
 * Promisified Bcrypt
 */

 class Bcrypt {

  static genSalt(rounds : number) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(rounds, (err, salt) => {
        if(err) return reject(err);
        return resolve(salt);
      });
    });
  }

  static hash(data: string, salt: string) {
    return new Promise(function (resolve, reject) {
      bcrypt.hash(data, salt, function (err, hash) {
        if(err) return reject(err);
        return resolve(hash);
      });
    });
  }

  static hash(data: string, rounds: number) {
    return new Promise(function (resolve, reject) {
      bcrypt.hash(data, rounds, function (err, hash) {
        if(err) return reject(err);
        return resolve(hash);
      });
    });
  }

  static compare(data: string, encrypted: string) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(data, encrypted, (err, matched) => {
        if(err) return reject(err);
        return resolve(matched);
      });
    });
  }

}

// These do not need to be promisified
Bcrypt.genSaltSync = bcrypt.genSaltSync;
Bcrypt.hashSync = bcrypt.hashSync;
Bcrypt.compareSync = bcrypt.compareSync;
Bcrypt.getRounds = bcrypt.getRounds;

export default Bcrypt;
