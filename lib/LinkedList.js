/** \brief Linked List
    Simple Linked List implementation based on 
    https://github.com/mmaelzer/just-a-list/blob/master/lib/list.js
  */
function LinkedList(){
  // Members

  /** \brief no title
      no description
    */
  this.head = null; // JSObject

  /** \brief no title
      no description
    */
  this.length = 0; // INT
    //INIT
    var self = this;
    //CODE
    
}

/** \brief Clear
    Remove all Elements from the List by dereferencing head
  */
LinkedList.prototype.clear = function (){
  //INIT
  var self = this;
  //CODE
  self.head = null;
  self.length = 0;
};

/** \brief Contains
    Check if the given node is contained in the current list.
  */
LinkedList.prototype.contains = function (   /*JSONObject*/ node){
  //INIT
  var self = this;
  //START
  var current_node = self.head;
  //CODE
  while ( current_node ) {
    if ( current_node === node ){
      return true; 
    }
    current_node = current_node.next;                
  }
  //TERM
  return false;
};

/** \brief Get Indexed Element
    Return the element that is in the list with the given index. index starts with 0
    when the requested index does not exist the function throws a exception. otherwise the element's data is returned
  */
LinkedList.prototype.getAt = function (   /*INT*/ index){
  //INIT
  var self = this;
  //START
  var current_node = self.head;
  var current_index = 0;
  //CODE
  while ( current_node ) {
    if ( current_index === index ){
      return current_node.data; 
    }
    current_node = current_node.next;   
    current_index++;             
  }
  throw new Error('Range Exception: ' + index + ' not found in LinkedList');
};

/** \brief Insert After
    Inserts any_data after the given node. Throws exception if the given node is not a element of the list
  */
LinkedList.prototype.insertAfter = function (   /*JSONObject*/ node , /*Mixed*/ any_data){
  //INIT
  var self = this;
  //CODE
  if ( !self.contains(node) ){
    throw new Error("No node found");
  }
  self.length++;
  node.next = {
      data: any_data
    , next: node.next
    };
};

/** \brief Insert Beginning
    Put a new instance to the front of the list
  */
LinkedList.prototype.insertBeginning = function (   /*Mixed*/ any_data){
  //INIT
  var self = this;
  //CODE
  self.length++;
  self.head = {
      data: any_data
    , next: self.head
    };
  //TERM
  return self.head;
};

/** \brief Remove After
    Remove the node that is located after the given node. throws exception when the given node is not part of the list or when there is no next node. Returns the removed element
  */
LinkedList.prototype.removeAfter = function (   /*JSONObject*/ node){
  //INIT
  var self = this;
  //START
  var removed = node.next;
  //CODE
  if ( !self.contains(node) ){
    throw new Error("No node found");
  }
  if ( node.next === null ){
    throw new Error ("No next node");
  }
  this.length--;
  node.next = removed.next;
  //TERM
  return removed;
};

/** \brief Remove Beginning
    Remove the first element of the list.
    Returns the removed element or null if the list is empty
  */
LinkedList.prototype.removeBeginning = function (){
  //INIT
  var self = this;
  //START
  var removed = self.head;
  
  //CODE
  if ( self.head === null ){
    return null;
  }
  self.length--;
  self.head = self.head.next;
  //TERM
  return removed;
};

/** \brief Remove End
    Remove the last Element from the list
  */
LinkedList.prototype.removeEnd = function (){
  //INIT
  var self = this;
  //START
  var removed = self.head;
  
  //CODE
  if ( self.length == 1 ){
    return self.removeBeginning();
  }
  removed = self.removeAfter(self.getAt(self.length - 2));
  console.log('removed',removed);
  //TERM
  return removed;
};

/** \brief Reverse
    Reverse the order of the list by relinking the next nodes and reconfiguring head.
  */
LinkedList.prototype.reverse = function (){
  //INIT
  var self = this;
  //START
  var current_node = self.head;
  var next = null;
  var prev = null;
  //CODE
  while ( current_node ) {
     next = current_node.next;
     current_node.next = prev;
     prev = current_node;
     current_node = next;
  }
  self.head = prev;
};