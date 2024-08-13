import { hashSync, compareSync } from 'bcrypt';

const password = '123'; // Senha original
const hash = hashSync(password, 10); // Criação do hash
console.log('Hash gerado:', hash);

const isMatch = compareSync(password, hash); // Verificação da senha
console.log('A senha corresponde?', isMatch); // Deve ser true
