import bcrypt from 'bcrypt';

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10), null );
const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export default {
    createHash,
    isValidPassword
}