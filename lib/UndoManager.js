/** \brief Undo Manager
    Manager for Undo Stacks. Singleton that keeps all undo-stacks for the controls in a webview collected via id. The UndoStack can be retrieved with getStack(identifier)
  */
function UndoManager(){
  // Members

  /** \brief no title
      no description
    */
  this.stacks = {}; // JSObject
    //INIT
    var self = this;
    var __instance;
    //CODE
    //SINGLETON PATTERN
    UndoManager = function UndoManager(){
      return __instance;
    };
    UndoManager.prototype = this;
    __instance = new UndoManager();
    __instance.constructor = UndoManager;
}

/** \brief Get Undo Stack
    Get/Create undo Stack for the given Identifier
  */
UndoManager.prototype.getStack = function (   /*STRING*/ identifier){
  //INIT
  var self = this;
  //CODE
  if ( typeof self.stacks[identifier] === 'undefined' ){
    self.stacks[identifier] = new UndoStack();
    // console.log('created stack for ' + identifier);
  }
  //TERM
  return self.stacks[identifier];
};