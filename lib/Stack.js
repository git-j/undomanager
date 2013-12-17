/** \brief Stack
    Simple Stack implementation based on a linked list. based on https://github.com/mmaelzer/just-a-stack/blob/master/lib/stack.js
  */
function Stack(){
  // Members
    //INIT
    var self = this;
    //CODE
    
}
Stack.prototype = new LinkedList();
Stack.prototype.constructor = function(){
  LinkedList.prototype.constructor.call(this);
};

/** \brief Is Empty
    Check if the Stack is empty
  */
Stack.prototype.isEmpty = function (){
  //INIT
  var self = this;
  //CODE
  return self.length === 0;
};

/** \brief Peek
    fetch the current stack-top without modifying the stack
  */
Stack.prototype.peek = function (){
  //INIT
  var self = this;
  //CODE
  return self.head ? self.head.data : null;
};

/** \brief Remove Top
    Removes the top element and returns it
  */
Stack.prototype.pop = function (){
  //INIT
  var self = this;
  //START
  var node = self.removeBeginning();
  //CODE
  return node ? node.data : null;
};

/** \brief Push on Stack
    Put a new element on the Stack
  */
Stack.prototype.push = function (   /*Mixed*/ any_data){
  //INIT
  var self = this;
  //CODE
  return self.insertBeginning(any_data).data;
};

/** \brief Size
    Current Size of the Stack
  */
Stack.prototype.size = function (){
  //INIT
  var self = this;
  //CODE
  return self.length;
};