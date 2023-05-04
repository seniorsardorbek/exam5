class Todo {
   constructor(id , title , text ,date,  completed= 'process'  ){
    this.id =id ,
    this.title = title ,
    this.text = text ,
    this.date =  date ,
    this.completed = completed 
   }

}
module.exports = Todo