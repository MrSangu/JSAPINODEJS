import uniqid from 'uniqid';
export default class List {
  constructor() {
      this.items=[];
  }
addShoppingItem(count,unit,ingredient){
  const item={
    UID:uniqid(),
    count,
    unit,
    ingredient
  }
this.items.push(item);
return item;
}

deleteShoppingItem(id){
//check for the UID
const index= this.items.findIndex(el=>el.UID===id);
//  delete from Items array
return this.items.splice(index,1);
}

updateCount(id,newCount){
  this.items.find(el=>el.UID===id).count=newCount;
}
}
