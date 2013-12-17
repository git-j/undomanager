/** \brief List Base Functionality
  */
function List(){
  // Members

  /** \brief no title
      no description
    */
  this.selected_id = -1; // INT

  /** \brief no title
      no description
    */
  this._kh_down = 0; // CHAR

  /** \brief no title
      no description
    */
  this._kh_up = 0; // CHAR

  /** \brief no title
      no description
    */
  this.message_queue = {}; // CHAR

  /** \brief no title
      no description
    */
  this.current_node = null; // CHAR

  /** \brief no title
      no description
    */
  this.message_timer = 0; // CHAR

  /** \brief no title
      no description
    */
  this.active_actions = {}; // JSObject

  /** \brief List Items are static
      List items that are generated from a non-database-source (eg filesystem) do not need updating and often fail on that attempt
    */
  this.is_static = false; // Boolean

  /** \brief no title
      no description
    */
  this.debug = false; // Boolean
    //INIT
    var self = this;
    //CODE
    
}

/** \brief no title
    no description
  */
List.prototype.KeyDown = function (   /*DOMEvent*/ event){
  //INIT
  var self = this;
  //CODE
  if ( self.debug ) console.log('KeyDown',event);
        if ( event.keyCode==40 ){ //down
    var next_node = $('.active').next('li:visible');
    if ( next_node )
      this.setItemActive(next_node[0]);
    event.preventDefault();
  }else if ( event.keyCode==38 ){ //up
    var prev_node = $('.active').prev('li:visible');
    if ( prev_node ){
      this.setItemActive(prev_node[0]);
    }
    event.preventDefault();
  }else if ( event.keyCode==13 ){ //return
    this.restoreSelected();
    event.preventDefault();
  }else if ( event.keyCode==46 ){ //delete
    this.active_actions['remove']($('.active'));
  }
  
};

/** \brief no title
    no description
  */
List.prototype.KeyUp = function (   /*DOMEvent*/ event){
  //INIT
  var self = this;
  //CODE
  if ( self.debug ) console.log('KeyUp',event);
  if ( event.keyCode==40 //down
     ||event.keyCode==38 //up
     ){
    this.queueAction('select',utils.getNodeParms($('.active')));
    event.preventDefault();
  }
};

/** \brief no title
    no description
  */
List.prototype.checkMessage = function (   /*STRING*/ message){
  //INIT
  var self = this;
  //CODE
  if ( self.debug ) console.log('checkMessage',message);
  var om = JSON.parse(message);
  if ( !om.action ) return false;
  //debug.log('List::checkMessage:' + om.action);
  if ( om.action.locate_instance ){
    self.queueAction('locate_instance',om.action.locate_instance);
    return true;
  }
  if ( om.action.locate_path == 'selected' ){
    self.queueAction('locate_instance',self.selected_id );
    return true;
  }
  if ( om.action.select ){
    self.queueAction('select',om.action.select);
    return true;
  }
  if ( om.action.reload == 'true' ){
    self.queueAction('reload',om.action.reload);
    return true;
  }
  if ( om.action.add_success ){
    if ( om.action.add_success == 'true' ) om.action.add_success = utils.tr("add success");
    utils.success(om.action.add_success);
  }
  if ( om.action.add_failure ){
    if ( om.action.add_failure == 'true' ) om.action.add_failure = utils.tr("add failure");
    utils.error(om.action.add_failure);
  }
  //TERM
  return false;
};

/** \brief no title
    no description
  */
List.prototype.createFromJSON = function (   /*JQueryDOMNode*/ root_node , /*JSONObject*/ js_data){
  //INIT
  var self = this;
  //START
  var ul = $('<ul></ul>');
  //CODE
  $.each(js_data,function(key,value){
    if ( key == 'count' ) return; //continue
    if ( self.debug ) console.log(key,value);
    var instance = value.instance;
    var item_html = '';
    item_html+='<li rel="' + instance.instance_type_definition + '" id="' + instance.loid + '" class="list_node">';
    var url = value.url;
    item_html+='<a href="' + url + '">';
    item_html+=value.display_name;
    item_html+='</a>';
    item_html+='</li>';
    ul.append(item_html);
  });
  root_node.html('');
  root_node.append(ul);
};

/** \brief no title
    no description
  */
List.prototype.init = function (   /*JQueryDOMNode*/ root_node , /*JSCallback*/ data_provider , /*JSCallback*/ select_callback){
  //INIT
  var self = this;
  //CODE
  //debug.log('ListInit:',root_node,data_provider,select_callback);
  if ( self.debug ) console.log('List Init',root_node,data_provider,select_callback);
  root_node.addClass('list_control');
  return self.setup(root_node,data_provider,select_callback);
  
};

/** \brief no title
    no description
  */
List.prototype.initHierarchy = function (   /*JQueryDOMNode*/ root_node , /*JSCallback*/ data_provider , /*JSCallback*/ select_callback){
  //INIT
  var self = this;
  //CODE
  //debug.log('ListInit:',root_node,data_provider,select_callback);
  if ( self.debug ) console.log('List Init',root_node,data_provider,select_callback);
  root_node.addClass('hierachy_control');
  return self.setup(root_node,data_provider,select_callback);
  
};

/** \brief no title
    no description
  */
List.prototype.processActions = function (){
  //INIT
  var self = this;
  //CODE
  if ( self.debug ) console.log('processActions',self.message_queue);

  if ( self.message_timer ){ // reset timeout
    window.clearTimeout(self.message_timer);
  }
  if ( utils.waiting || (window.wke && !wke.isVisible()) ){
    self.message_timer=window.setTimeout($.proxy(self.processActions,self),300);
    return;
  }
  $.each(self.message_queue,function(action,value){
    //debug.log('processActions:' + action + '/' + value);
    if ( self.debug ) console.log('processActions',action,value);
    if ( action == 'locate_instance' ) {self.setVisibleSelected( value );}
    if ( action == 'reload' ) wkej.resetData();
    if ( action == 'select' ) { occ.Select(value);}
  });
  self.message_queue = {};
  
};

/** \brief no title
    no description
  */
List.prototype.queueAction = function (   /*STRING*/ action , /*STRING*/ value){
  //INIT
  var self = this;
  //CODE
  if ( self.debug ) console.log('queueAction',action,value);
  if ( self.message_queue[action] == value ) return;
  self.message_queue[action] = value;
  self.processActions();
  
};

/** \brief no title
    no description
  */
List.prototype.restoreSelected = function (){
  //INIT
  var self = this;
  //CODE
  if ( self.debug ) console.log('restoreSelected',$('#node_' + self.selected_id));
  var node = $('#node_' + self.selected_id);
  if ( node.length ){
    self.selectNode(node[0]);
  }
  
};

/** \brief no title
    no description
  */
List.prototype.restoreVisibleSelected = function (){
  //INIT
  var self = this;
  //CODE
  if ( self.selected_id <= 0 ) return;
  var node = $('#node_' + self.selected_id);
  if (!node.length )
    node = $('#' + self.selected_id);
  if ( self.debug ) console.log('restoreVisibleSelected' , self.selected_id);
  if ( node.length ){
    self.selectVisibleNode(node[0]);
  }
  
};

/** \brief no title
    no description
  */
List.prototype.selectNode = function (   /*DOMNode*/ dom_node , /*JSCallback*/ select_callback){
  //INIT
  var self = this;
  //CODE
  if ( self.debug ) console.log('selectNode');
  self.selectVisibleNode(dom_node);
  self.queueAction('select',utils.getNodeParms($('.active')));
  if ( select_callback ){
    select_callback();
  }
  
};

/** \brief no title
    no description
  */
List.prototype.selectVisibleNode = function (   /*DOMNode*/ dom_node){
  //INIT
  var self = this;
  //CODE
  if ( self.debug ) console.log('selectVisibleNode');
  self.setItemActive(dom_node);
};

/** \brief no title
    no description
  */
List.prototype.setItemActive = function (   /*DOMNode*/ dom_node){
  //INIT
  var self = this;
  //START
  var node;
  //CODE
  if ( self.debug ) console.log('setItemActive',dom_node);
  if ( !dom_node ) return;
  var previous_node = $('.active');
  self.updateNode(previous_node);
  previous_node.removeClass('active');
  node = $(dom_node).closest('li');
  //alert(node.html());
  //if ( !node.attr('class') || node.attr('class').indexOf('root')>=0 )
  node.addClass('active');
  //debug.log(node);
  utils.ensureVisible(node);
  if ( node.attr('id') )
    self.selected_id = node.attr('id').replace(/node_/,'');
  //utils.bt();
  //alert('set_active:' + node.html());
  
};

/** \brief no title
    no description
  */
List.prototype.setSelected = function (   /*INT*/ loid){
  //INIT
  var self = this;
  //CODE
  if ( self.debug ) console.log('setSelected',loid);
  self.selected_id = loid;
  self.restoreSelected();
  
};

/** \brief no title
    no description
  */
List.prototype.setVisibleSelected = function (   /*INT*/ loid){
  //INIT
  var self = this;
  //CODE
  if ( self.debug ) console.log('setVisibleSelected',loid);
  self.selected_id = loid;
  self.restoreVisibleSelected();
};

/** \brief no title
    no description
  */
List.prototype.setup = function (   /*JQueryDOMNode*/ root_node , /*JSCallback*/ data_provider , /*JSCallback*/ select_callback){
  //INIT
  var self = this;
  //START
  var dfd= $.Deferred();
  //CODE
  if ( self.debug ) console.log('setup',root_node);
  self.current_node = root_node.find('.active');
  root_node.disableSelection();

  data_provider().done(function(data){
    if ( self.debug ) console.log('list setup data:',data);
    if ( typeof data === 'string' ){
      if ( data.indexOf('<ul') === 0 
        || data === ''
        ){
        root_node.html(data);
      } else {
        try {
          var js_data = JSON.parse(data);
          self.createFromJSON(root_node,js_data);
        } catch(e) {
          console.log('[dev] invalid JSON for list',data);
        }
      }
    }
    if ( typeof data === 'object' )
      self.createFromJSON(root_node,data);
    if ( !self.current_node.length ){
      self.current_node = root_node.find('li:first');
    }
    self.setupItems(root_node,select_callback);
    dfd.resolve();
  }).fail(function(){
    dfd.reject();
  });
  //TERM
  return dfd.promise();
};

/** \brief no title
    no description
  */
List.prototype.setupHierarchy = function (   /*JQueryDOMNode*/ root_node , /*JSCallback*/ data_provider , /*JSCallback*/ select_callback){
  //INIT
  var self = this;
  //START
  var dfd= $.Deferred();
  //CODE
  if ( self.debug ) console.log('setuphierarchy',root_node);
  self.list_current_node = root_node.find('.active');
  root_node.disableSelection();
  data_provider().done(function(html){
    root_node.html(html);
    if ( !self.current_node || !self.current_node.length ){
      self.current_node = root_node.find('li:first');
      if ( self.current_node.length ){
        if ( self.current_node.attr('rel') === 'Composition' ){
          root_node = self.current_node;
          self.current_node = root_node.find('li:first');
        }
      }
    }
    self.setupItems(root_node,select_callback);
    dfd.resolve();
  }).fail(function(){
    dfd.reject();
  });
  //TERM
  return dfd.promise();
};

/** \brief no title
    no description
  */
List.prototype.setupItemActions = function (   /*JQueryDOMNode*/ root_node , /*JSFunctionMap*/ action_list , /*JSStringArray*/ action_filter){
  //INIT
  var self = this;
  //CODE
  if ( self.debug ) console.log('setupItemActions',root_node,action_list,action_filter);
  $.each(action_list,function(identifier,item){
    if ( typeof item !== 'function' ) return;//continue
    self.active_actions[identifier] = item;
  });
  action_list_copy = $.extend({},action_list);
  root_node.find('.list_node').each(function(index,item){
    var node = $(item);
    var irel = node.attr('rel');
    if ( action_filter ){
      for ( var i = 0; i < action_filter.length; i++ ){
        if ( typeof action_filter[i] === 'function' ){
          action_list_copy = $.extend({},action_list);
          if ( ! action_filter[i](node,action_list_copy) ){
            return;
          }
        } else {
          if ( action_filter[i] == irel ){
            return;
          }
        }
      }
    }
    $.each(action_list_copy,function(key,value){
      if ( key == "node_select" ) {
        node.bind('click',function(event){
          event.preventDefault();
          action_list_copy['node_select'](node);
          return false;
        });
        return;
      }
      if ( key == "node_dblclick" ) {
        node.bind('dblclick',function(event){
          event.preventDefault();
          action_list_copy['node_dblclick'](node);
          return false;
        });
        return;
      }
      node.prepend('<button rel="' + key + '">' + key + '</button>');
    });
    node.find('button').each(function(index,button_item){
      var button_node = $(button_item);
      button_node.button({
          text:false
        , icons: { primary: 'ui-icon-' + button_node.attr('rel') + '-p'}
        , label: utils.tr_action_title(button_node.attr('rel'))
        })
      .click(function(event){
        self.active_actions[button_node.attr('rel')]($(this).parent('li'));
        event.preventDefault();
        return false;
      }).attr('title',utils.tr_action_tooltip(button_node.attr('rel')));
    });
  });
};

/** \brief no title
    no description
  */
List.prototype.setupItems = function (   /*JQueryDOMNode*/ root_node , /*JSCallback*/ select_callback){
  //INIT
  var self = this;
  //CODE
  if ( self.debug ) console.log('setupItems',root_node);
  root_node.find('.list_node').each(function(index,item){
    $(item).bind('click',function(event){
      event.preventDefault();
      self.selectNode(this,select_callback);
      return false;
    });
  });

  root_node.unbind('keydown',self._kh_down);
  self._kh_down = $.proxy(self.KeyDown,self);
  root_node.bind('keydown',self._kh_down);
  root_node.unbind('keyup',self._kh_up);
  self._kh_up = $.proxy(self.KeyUp,self);
  root_node.bind('keyup',self._kh_up);

  if ( !self.selected_id && !$('.active').length && self.current_node.length ){
    self.selectVisibleNode(self.current_node[0]);
  }else if ( self.selected_id ){
    self.restoreVisibleSelected();
  }
  
};

/** \brief Update Node
    Updates the given node from database.
    Given node must have an id like 'node_[id]' where [id] the loid of the given object is.
    Under the hierachy of the node has to provide an 'a' tag where the name is specified.
    Nodes with the class 'deleted' will not get updated
  */
List.prototype.updateNode = function (   /*DOMNode*/ dom_node){
  //INIT
  var self = this;
  //START
  var node;
  //CODE
  if ( self.debug ) console.log('updateNode',dom_node);
  if ( self.is_static ) return;
  if ( dom_node.length===0 ){
    return;
  } else {
    loid = dom_node[0].id.replace('node_','');
    if ( $('#node_' + loid).hasClass('deleted') )
      return; // ignore deleted nodes
    omc.getInstance(loid)
      .done(function(instance){
        //debug.log("Instance:",instance);
        $(dom_node).find('a:first').html(instance.display_name);
      }).fail(console.log);
  }

  
};