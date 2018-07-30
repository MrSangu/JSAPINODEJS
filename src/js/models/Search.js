import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query= query;
  }
  async getResults()
  {
    const proxy='https://cors-anywhere.herokuapp.com/';
    const key= '2a7ee77e97bb341b07f207b6160defd0';
    try
    {
      const res= await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result= res.data.recipes;
      //console.log(this.result);
    }
    catch (e)
    {
    alert(e);
    }
  }
}
