undomanager
===========

Javascript implementation of UndoStack and UndoCommand inspired by QUndoStack

Dependencies
============

none

Example
=======

This library may be used for implementing advanced handling of user actions using the Command Pattern

```javascript
// get a stack for unique-id (allow multiple stacks be available)
stack = (new UndoManager()).getStack('unique-id');

stack.target = jQuery('#some_undoable_element');
// this is your choice, you may not need a target to operate on

command = new UndoCommand();

command.before_data = stack.target.html();
// modify stack.target
stack.target.html('<h1>pasted</h1><p>html</p>');

command.after_data = stack.target.html();


command.undo = function(event){
  stack.target.html(command.before_data);
};

command.redo = function(event){
  stack.target.html(command.after_data);
};

command.mergeWith = function(new_command){
  if ( Math.abs(command.after_data.length - new_command.after_data.length) < 5 ){
    command.after_data = new_command.after_data;
    return true;
  }
  return false;
};

stack.push(command);

// ...
stack.undo();
// content has now returned to the original state
```