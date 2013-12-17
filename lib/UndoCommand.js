/** \brief Undo Command
    The UndoCommand class is the base class of all commands stored on a UndoStack.
    A UndoCommand represents a single editing action on a document; for example, inserting or deleting a block of text in a text editor. UndoCommand can apply a change to the document with redo() and undo the change with undo(). The implementations for these functions must be provided in a derived class.
    In order to setup the contents after undo or redo has been executed, a postdo function can be provided that may execute additional commands on the undone/redone content (eg trigger store, update external files)
  */
function UndoCommand(){
  // Members

  /** \brief no title
      no description
    */
  this.id = 'default'; // String
    //INIT
    var self = this;
    //CODE
    
}

/** \brief merge With
    Attempts to merge this command with command. Returns true on success; otherwise returns false.
    If this function returns true, calling this command's redo() must have the same effect as redoing both this command and command. Similarly, calling this command's undo() must have the same effect as undoing command and this command.
    You may overwrite this function and check with the command-id if a merge is possible
  */
UndoCommand.prototype.mergeWith = function (   /*UndoCommand*/ undo_command){
  //INIT
  var self = this;
  //CODE
  return false;
  //if ( self.id != undo_command.id ){
  //  return false;
  //}
  //self.after_data = undo_command.after_data;
};

/** \brief Post Do
    Execute when undo or redo has been executed. With this function it is possible to separate the content-redo/undo from the application functionality that may require additional processing after content had been changed.
    For Example processing MathJax on a undone content is required to present the correct formula in a text
  */
UndoCommand.prototype.postdo = function (){
  //INIT
  var self = this;
  //CODE
  
};

/** \brief Redo Action
    Function that is required to be overridden in order to archieve a redo. Redo is equivialent with executing the command at hand. For Example when inserting a Image, you should implement this as command, then execute the redo command to get the content changed. This way your insert implementation may not diverge from the redo implementatiion
  */
UndoCommand.prototype.redo = function (){
  //INIT
  var self = this;
  //CODE
  console.error('redo command not implemented');
};

/** \brief Undo Action
    Function that is required to be overridden in order to archieve a undo. Undo is usualy restoring a previous state of the Document but may also trigger database changes in order to revert associated contents.
    Make sure you test the undo commands toughly, as they are only executed rarely
  */
UndoCommand.prototype.undo = function (){
  //INIT
  var self = this;
  //CODE
  console.error('undo command not implemented');
};