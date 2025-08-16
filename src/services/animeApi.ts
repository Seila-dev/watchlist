import axios from 'axios';

//Demonstração de todas rotas da API, não é necessário acrescentar uma saida para cada rota
//Basta verificar qual saida precisa e chamar apiAnime passando a rota
//https://docs.api.jikan.moe/

const apiAnime = axios.create({
  baseURL: 'https://api.jikan.moe/v4', 
  timeout: 10000,
});

export default apiAnime;
