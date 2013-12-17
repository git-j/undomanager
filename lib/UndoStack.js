/** \brief Undo Stack
    The UndoStack is a Stack of UndoCommands
    An undo stack maintains a stack of commands that have been applied to archieve a previous state of a Document or a Collection.
    New UndoCommands are pushed on the stack using push(). UndoCommands can be undone and redone using undo() and redo().
    UndoStack keeps track of the current command. This is the command which will be executed by the next call to redo(). The index of this command is returned by index(). The state of the edited object can be rolled forward or back using setIndex(). 
    UndoStack provides support for undo and redo actions and command compression.
    Command Compression
    Command compression is useful when several commands can be compressed into a single command that can be undone and redone in a single operation. For example, when a user types a character in a text editor, a new command is created. This command inserts the character into the document at the cursor position. However, it is more convenient for the user to be able to undo or redo typing of whole words, sentences, or paragraphs. Command compression allows these single-character commands to be merged into a single command which inserts or deletes sections of text.
    For more information, see UndoCommand::mergeWith() and push().
  */
function UndoStack(){
  // Members

  /** \brief no title
      no description
    */
  this.current_index; // INT

  /** \brief no title
      no description
    */
  this.clean_index; // INT

  /** \brief no title
      no description
    */
  this.undo_limit = 0; // INT
    //INIT
    var self = this;
    //CODE
    
}
UndoStack.prototype = new Stack();
UndoStack.prototype.constructor = function(){
  Stack.prototype.constructor.call(this);
};

/** \brief Can Redo
    Check if a Command can be Redone
  */
UndoStack.prototype.canRedo = function (){
  //INIT
  var self = this;
  //CODE
  if ( self.size() > 0
    && self.current_index >= -1
    && self.current_index < self.size() - 1
    ){
    return true;
  }
  // console.log('cannot redo:', self.size(), self.current_index);
  return false;
};

/** \brief Can Undo
    Check if a Command can be undone
  */
UndoStack.prototype.canUndo = function (){
  //INIT
  var self = this;
  //CODE
  if ( self.size() > 0
    && self.current_index >= 0
    ){
    return true;
  }
  // console.log('cannot undo');
  return false;
};

/** \brief Clear
    Clear all stored UndoCommands
  */
UndoStack.prototype.clear = function (){
  //INIT
  var self = this;
  //CODE
  LinkedList.prototype.clear.call(this);
};

/** \brief Get UndoCommand
    Get the Command with the given Index. The Command should be manipulated carefully to avoid corruption
  */
UndoStack.prototype.command = function (   /*INT*/ index){
  //INIT
  var self = this;
  //START
  var requested_command;
  //CODE
  if ( index < 0 || index > self.size() ){
    throw new Error('Range Error: ' + index + ' is out of bounds');
  }
  requested_command = self.getAt(self.length - 1 - index);
  //TERM
  return requested_command;
};

/** \brief Index
    Get the Current Index of the Undo List. This is usualy the end of the list (size-1) unless a command has been undone
  */
UndoStack.prototype.index = function (){
  //INIT
  var self = this;
  //CODE
  return self.current_index;
};

/** \brief Push Undo Command
    Push a UndoCommand to the Stack. When the command has a mergeWith implementation it may just update the last command on the stack. When the undo_limit is reached, the last command is removed
  */
UndoStack.prototype.push = function (   /*UndoCommand*/ undo_command){
  //INIT
  var self = this;
  //CODE
  if ( typeof undo_command !== 'object' ){
    throw new Error('you can only push undo-commands to undo-stack');
  }
  if ( typeof undo_command.undo !== 'function'
    || typeof undo_command.redo !== 'function'
    || typeof undo_command.mergeWith !== 'function'
    || typeof undo_command.id !== 'string'
    ){
    throw new Error('the structure of the undo command is incorrect');
  }
  if ( typeof undo_command.redo !== 'function' ){
    throw new Error('the structure of the undo command is incorrect');
  }
  while ( self.size() - 1 > self.current_index ){
    self.pop();
  }
  var current_command = self.peek();
  if ( current_command
    && typeof current_command === 'object'
    ){
    if ( current_command.mergeWith(undo_command) ){
      return;
    }
  }
  Stack.prototype.push.call(this,undo_command);
  if ( self.undo_limit > 0
    && self.length > self.undo_limit
    ){
    self.removeEnd();
  }
  self.current_index = self.length - 1;
};

/** \brief Redo
    Execute the redo function of the current UndoCommand and increase the current_index
  */
UndoStack.prototype.redo = function (){
  //INIT
  var self = this;
  //CODE
  if ( !self.canRedo() ){
    return;
  }
  self.current_index++;
  var current_command = self.command(self.current_index);
  if ( typeof current_command === 'object' ){
    current_command.redo();
  }
};

/** \brief SetIndex
    Execute undo/redo until the given index is reached
  */
UndoStack.prototype.setIndex = function (   /*INT*/ index){
  //INIT
  var self = this;
  //CODE
  while ( index > self.current_index ){
    self.redo();
  }
  while ( index < self.current_index ){
    self.undo();
  }
  
};

/** \brief Set Undo Limit
    Sets the limit of the undo transaction list. when the limit is reached, the oldes undo-commands get dropped. The default is 0 which means there is no limit
  */
UndoStack.prototype.setUndoLimit = function (   /*INT*/ index){
  //INIT
  var self = this;
  //CODE
  if ( index < 0 ){
    throw new Error('undo limit out of range');
  }
  self.undo_limit = index;
};

/** \brief Undo
    Execute the undo function of the current UndoCommand
  */
UndoStack.prototype.undo = function (){
  //INIT
  var self = this;
  //CODE
  if ( !self.canUndo() ){
    return;
  }
  var current_command = self.command(self.current_index);
  self.current_index--;
  if ( typeof current_command === 'object' ){
    current_command.undo();
  }
};