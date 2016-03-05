
// *************************************************************
//   LiteGraph CLASS                                     *******
// *************************************************************

/**
* The Global Scope. It contains all the registered node classes.
*
* @class LiteGraph
* @constructor
*/



//derwish added
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

var MAIN_PANEL_ID = "Main";


var LiteGraph = {
    NODE_TITLE_HEIGHT: 16,
    NODE_SLOT_HEIGHT: 15,
    //derwish edit
    NODE_WIDTH: 150,
    NODE_MIN_WIDTH: 50,
    NODE_COLLAPSED_RADIUS: 10,
    //derwish edit
    NODE_COLLAPSED_WIDTH: 150,
    CANVAS_GRID_SIZE: 10,
    NODE_TITLE_COLOR: "#222",

    NODE_DEFAULT_COLOR: "#777",
    NODE_DEFAULT_BGCOLOR: "#373737",

    PANEL_NODE_COLOR: "#777",
    PANEL_NODE_BGCOLOR: "#373737",

    IO_NODE_COLOR: "#777",
    IO_NODE_BGCOLOR: "#373737",

    NODE_DEFAULT_IO_COLOR: "#999",
    NODE_OPTIONAL_IO_COLOR: "#777",
    // NODE_DEFAULT_BOXCOLOR: "#373737",
    NODE_ACTIVE_BOXCOLOR: "#AEF",
    NODE_DEFAULT_SHAPE: "box",
    TITLE_TEXT_FONT: "bold 13px Arial",
    INNER_TEXT_FONT: "normal 12px Arial",
    SHADOWS_WIDTH: 2,
    MENU_TEXT_COLOR: "#BBD",
    MENU_BG_COLOR: "#353535",
    BG_IMAGE: "/images/litegraph/grid.png",
    MAX_NUMBER_OF_NODES: 1000, //avoid infinite loops
    DEFAULT_POSITION: [100, 100], //default node position
    node_images_path: "",

    RENDER_CONNECTION_ARROWS: true,
    CONNECTIONS_WIDTH: 4,
    CONNECTIONS_SHADOW: 4,

    SELECTION_COLOR: "#FFF",
    SELECTION_WIDTH: 2,

    DataType:
    {
        Text: 0,
        Number: 1,
        Logical: 2
    },

    DataTypeColor:
    {
        0: "#AAA",
        1: "#AAA",
        2: "#AAA"
    },
    NEW_LINK_COLOR: "#CCC",

    proxy: null, //used to redirect calls

    debug: false,
    throw_errors: true,
    registered_node_types: {},
    Nodes: {},

    /**
	* Register a node class so it can be listed when the user wants to create a new one
	* @method registerNodeType
	* @param {String} type name of the node and path
	* @param {Class} base_class class containing the structure of a node
	*/

    registerNodeType: function (type, base_class) {
        if (!base_class.prototype)
            throw ("Cannot register a simple object, it must be a class with a prototype");
        base_class.type = type;

        if (LiteGraph.debug)
            console.log("Node registered: " + type);

        var categories = type.split("/");

        var pos = type.lastIndexOf("/");
        base_class.category = type.substr(0, pos);
        //info.name = name.substr(pos+1,name.length - pos);

        //extend class
        if (base_class.prototype) //is a class
            for (var i in LGraphNode.prototype)
                if (!base_class.prototype[i])
                    base_class.prototype[i] = LGraphNode.prototype[i];

        this.registered_node_types[type] = base_class;
        if (base_class.constructor.name)
            this.Nodes[base_class.constructor.name] = base_class;
    },

    /**
	* Create a node of a given type with a name. The uiNode is not attached to any graph yet.
	* @method createNode
	* @param {String} type full name of the node class. p.e. "math/sin"
	* @param {String} name a name to distinguish from other nodes
	* @param {Object} options to set options
	*/

    createNode: function (type, title, options) {
        var base_class = this.registered_node_types[type];
        if (!base_class) {
            if (LiteGraph.debug)
                console.log("GraphNode type \"" + type + "\" not registered.");
            return null;
        }

        var prototype = base_class.prototype || base_class;

        title = title || base_class.title || type;

        var node = new base_class(name);

        node.type = type;
        if (!node.title) node.title = title;
        if (!node.properties) node.properties = {};
        if (!node.flags) node.flags = {};
        if (!node.size) node.size = node.computeSize();
        if (!node.pos) node.pos = LiteGraph.DEFAULT_POSITION.concat();

        //extra options
        if (options) {
            for (var i in options)
                node[i] = options[i];
        }

        //derwish added
        node.id = guid();

        return node;
    },

    /**
	* Returns a registered node type with a given name
	* @method getNodeType
	* @param {String} type full name of the node class. p.e. "math/sin"
	* @return {Class} the node class
	*/

    getNodeType: function (type) {
        return this.registered_node_types[type];
    },


    /**
	* Returns a list of node types matching one category
	* @method getNodeType
	* @param {String} category category name
	* @return {Array} array with all the node classes
	*/

    getNodeTypesInCategory: function (category) {
        var r = [];
        for (var i in this.registered_node_types)
            if (category == "") {
                if (this.registered_node_types[i].category == null)
                    r.push(this.registered_node_types[i]);
            }
            else if (this.registered_node_types[i].category == category)
                r.push(this.registered_node_types[i]);

        return r;
    },

    /**
	* Returns a list with all the node type categories
	* @method getNodeTypesCategories
	* @return {Array} array with all the names of the categories 
	*/

    getNodeTypesCategories: function () {
        var categories = { "": 1 };
        for (var i in this.registered_node_types)
            if (this.registered_node_types[i].category && !this.registered_node_types[i].skip_list)
                categories[this.registered_node_types[i].category] = 1;
        var result = [];
        for (var i in categories)
            result.push(i);
        return result;
    },

    //debug purposes: reloads all the js scripts that matches a wilcard
    reloadNodes: function (folder_wildcard) {
        var tmp = document.getElementsByTagName("script");
        //weird, this array changes by its own, so we use a copy
        var script_files = [];
        for (var i in tmp)
            script_files.push(tmp[i]);


        var docHeadObj = document.getElementsByTagName("head")[0];
        folder_wildcard = document.location.href + folder_wildcard;

        for (var i in script_files) {
            var src = script_files[i].src;
            if (!src || src.substr(0, folder_wildcard.length) != folder_wildcard)
                continue;

            try {
                if (LiteGraph.debug)
                    console.log("Reloading: " + src);
                var dynamicScript = document.createElement("script");
                dynamicScript.type = "text/javascript";
                dynamicScript.src = src;
                docHeadObj.appendChild(dynamicScript);
                docHeadObj.removeChild(script_files[i]);
            }
            catch (err) {
                if (LiteGraph.throw_errors)
                    throw err;
                if (LiteGraph.debug)
                    console.log("Error while reloading " + src);
            }
        }

        if (LiteGraph.debug)
            console.log("Nodes reloaded");
    },

    //separated just to improve if it doesnt work
    cloneObject: function (obj, target) {
        if (obj == null) return null;
        var r = JSON.parse(JSON.stringify(obj));
        if (!target) return r;

        for (var i in r)
            target[i] = r[i];
        return target;
    }
};

if (typeof (performance) != "undefined")
    LiteGraph.getTime = function getTime() { return performance.now(); }
else
    LiteGraph.getTime = function getTime() { return Date.now(); }






//*********************************************************************************
// LGraph CLASS                                  
//*********************************************************************************

/**
* LGraph is the class that contain a full graph. We instantiate one and add nodes to it, and then we can run the execution loop.
*
* @class LGraph
* @constructor
*/

function LGraph() {
    if (LiteGraph.debug)
        console.log("Graph created");
    this.list_of_graphcanvas = null;
    this.clear();
}

//default supported types
LGraph.supported_types =
    [LiteGraph.DataType.Text,
    LiteGraph.DataType.Number,
    LiteGraph.DataType.Logical];

//used to know which types of connections support this graph (some graphs do not allow certain types)
LGraph.prototype.getSupportedTypes = function () { return this.supported_types || LGraph.supported_types; }

LGraph.STATUS_STOPPED = 1;
LGraph.STATUS_RUNNING = 2;

/**
* Removes all nodes from this graph
* @method clear
*/

LGraph.prototype.clear = function () {
    this.stop();
    this.status = LGraph.STATUS_STOPPED;
    this.last_node_id = 0;

    //nodes
    this._nodes = [];
    this._nodes_by_id = {};

    //links
    this.last_link_id = 0;
    this.links = {}; //container with all the links

    //iterations
    this.iteration = 0;

    this.config = {
    };

    //timing
    this.globaltime = 0;
    this.runningtime = 0;
    this.fixedtime = 0;
    this.fixedtime_lapse = 0.01;
    this.elapsed_time = 0.01;
    this.starttime = 0;

    //globals
    this.global_inputs = {};
    this.global_outputs = {};

    //this.graph = {};
    this.debug = true;

    this.change();

    this.sendActionToCanvas("clear");
}

/**
* Attach Canvas to this graph
* @method attachCanvas
* @param {GraphCanvas} graph_canvas 
*/

LGraph.prototype.attachCanvas = function (graphcanvas) {
    if (graphcanvas.constructor != LGraphCanvas)
        throw ("attachCanvas expects a LGraphCanvas instance");
    if (graphcanvas.graph && graphcanvas.graph != this)
        graphcanvas.graph.detachCanvas(graphcanvas);

    graphcanvas.graph = this;
    if (!this.list_of_graphcanvas)
        this.list_of_graphcanvas = [];
    this.list_of_graphcanvas.push(graphcanvas);
}

/**
* Detach Canvas from this graph
* @method detachCanvas
* @param {GraphCanvas} graph_canvas 
*/

LGraph.prototype.detachCanvas = function (graphcanvas) {
    var pos = this.list_of_graphcanvas.indexOf(graphcanvas);
    if (pos == -1) return;
    graphcanvas.graph = null;
    this.list_of_graphcanvas.splice(pos, 1);
}

/**
* Starts running this graph every interval milliseconds.
* @method start
* @param {number} interval amount of milliseconds between executions, default is 1
*/

LGraph.prototype.start = function (interval) {
    if (this.status == LGraph.STATUS_RUNNING) return;
    this.status = LGraph.STATUS_RUNNING;

    if (this.onPlayEvent)
        this.onPlayEvent();

    this.sendEventToAllNodes("onStart");

    //launch
    this.starttime = LiteGraph.getTime();
    interval = interval || 1;
    var that = this;

    this.execution_timer_id = setInterval(function () {
        //execute
        that.runStep(1);
    }, interval);
}

/**
* Stops the execution loop of the graph
* @method stop execution
*/

LGraph.prototype.stop = function () {
    if (this.status == LGraph.STATUS_STOPPED)
        return;

    this.status = LGraph.STATUS_STOPPED;

    if (this.onStopEvent)
        this.onStopEvent();

    if (this.execution_timer_id != null)
        clearInterval(this.execution_timer_id);
    this.execution_timer_id = null;

    this.sendEventToAllNodes("onStop");
}

/**
* Run N steps (cycles) of the graph
* @method runStep
* @param {number} num number of steps to run, default is 1
*/

LGraph.prototype.runStep = function (num) {
    num = num || 1;

    var start = LiteGraph.getTime();
    this.globaltime = 0.001 * (start - this.starttime);

    try {
        for (var i = 0; i < num; i++) {
            this.sendEventToAllNodes("onExecute");
            this.fixedtime += this.fixedtime_lapse;
            if (this.onExecuteStep)
                this.onExecuteStep();
        }

        if (this.onAfterExecute)
            this.onAfterExecute();
        this.errors_in_execution = false;
    }
    catch (err) {
        this.errors_in_execution = true;
        if (LiteGraph.throw_errors)
            throw err;
        if (LiteGraph.debug)
            console.log("Error during execution: " + err);
        this.stop();
    }

    var elapsed = LiteGraph.getTime() - start;
    if (elapsed == 0) elapsed = 1;
    this.elapsed_time = 0.001 * elapsed;
    this.globaltime += 0.001 * elapsed;
    this.iteration += 1;
}

/**
* Updates the graph execution order according to relevance of the nodes (nodes with only outputs have more relevance than
* nodes with only inputs.
* @method updateExecutionOrder
*/

LGraph.prototype.updateExecutionOrder = function () {
    this._nodes_in_order = this.computeExecutionOrder();
}

//This is more internal, it computes the order and returns it
LGraph.prototype.computeExecutionOrder = function () {
    var L = [];
    var S = [];
    var M = {};
    var visited_links = {}; //to avoid repeating links
    var remaining_links = {}; //to a

    //search for the nodes without inputs (starting nodes)
    for (var i in this._nodes) {
        var n = this._nodes[i];
        M[n.id] = n; //add to pending nodes

        var num = 0; //num of input connections
        if (n.inputs)
            for (var j = 0, l = n.inputs.length; j < l; j++)
                if (n.inputs[j] && n.inputs[j].link != null)
                    num += 1;

        if (num == 0) //is a starting node
            S.push(n);
        else //num of input links 
            remaining_links[n.id] = num;
    }

    while (true) {
        if (S.length == 0)
            break;

        //get an starting node
        var n = S.shift();
        L.push(n); //add to ordered list
        delete M[n.id]; //remove from the pending nodes

        //for every output
        if (n.outputs)
            for (var i = 0; i < n.outputs.length; i++) {
                var output = n.outputs[i];
                //not connected
                if (output == null || output.links == null || output.links.length == 0)
                    continue;

                //for every connection
                for (var j = 0; j < output.links.length; j++) {
                    var link_id = output.links[j];
                    var link = this.links[link_id];
                    if (!link) continue;

                    //already visited link (ignore it)
                    if (visited_links[link.id])
                        continue;

                    var target_node = this.getNodeById(link.target_id);
                    if (target_node == null) {
                        visited_links[link.id] = true;
                        continue;
                    }

                    visited_links[link.id] = true; //mark as visited
                    remaining_links[target_node.id] -= 1; //reduce the number of links remaining
                    if (remaining_links[target_node.id] == 0)
                        S.push(target_node); //if no more links, then add to Starters array
                }
            }
    }

    //the remaining ones (loops)
    for (var i in M)
        L.push(M[i]);

    if (L.length != this._nodes.length && LiteGraph.debug)
        console.log("something went wrong, nodes missing");

    //save order number in the node
    for (var i in L)
        L[i].order = i;

    return L;
}


/**
* Returns the amount of time the graph has been running in milliseconds
* @method getTime
* @return {number} number of milliseconds the graph has been running
*/

LGraph.prototype.getTime = function () {
    return this.globaltime;
}

/**
* Returns the amount of time accumulated using the fixedtime_lapse var. This is used in context where the time increments should be constant
* @method getFixedTime
* @return {number} number of milliseconds the graph has been running
*/

LGraph.prototype.getFixedTime = function () {
    return this.fixedtime;
}

/**
* Returns the amount of time it took to compute the latest iteration. Take into account that this number could be not correct
* if the nodes are using graphical actions
* @method getElapsedTime
* @return {number} number of milliseconds it took the last cycle
*/

LGraph.prototype.getElapsedTime = function () {
    return this.elapsed_time;
}

/**
* Sends an event to all the nodes, useful to trigger stuff
* @method sendEventToAllNodes
* @param {String} eventname the name of the event (function to be called)
* @param {Array} params parameters in array format
*/

LGraph.prototype.sendEventToAllNodes = function (eventname, params) {
    var M = this._nodes_in_order ? this._nodes_in_order : this._nodes;
    for (var j in M)
        if (M[j][eventname]) {
            if (params === undefined)
                M[j][eventname]();
            else if (params && params.constructor === Array)
                M[j][eventname].apply(M[j], params);
            else
                M[j][eventname](params);
        }
}

LGraph.prototype.sendActionToCanvas = function (action, params) {
    if (!this.list_of_graphcanvas)
        return;

    for (var i in this.list_of_graphcanvas) {
        var c = this.list_of_graphcanvas[i];
        if (c[action])
            c[action].apply(c, params);
    }
}

/**
* Adds a new node instasnce to this graph
* @method add
* @param {LGraphNode} node the instance of the uiNode
*/

LGraph.prototype.add = function (node, skip_compute_order) {
    if (!node || (node.id != -1 && this._nodes_by_id[node.id] != null))
        return; //already added

    if (this._nodes.length >= LiteGraph.MAX_NUMBER_OF_NODES)
        throw ("LiteGraph: max number of nodes in a graph reached");

    //give him an id
    if (node.id == null || node.id == -1)
        node.id = this.last_node_id++;

    node.graph = this;

    this._nodes.push(node);
    this._nodes_by_id[node.id] = node;

    /*
	// rendering stuf... 
	if(node.bgImageUrl)
		node.bgImage = uiNode.loadImage(uiNode.bgImageUrl);
	*/

    if (node.onAdded)
        node.onAdded();

    if (this.config.align_to_grid)
        node.alignToGrid();

    if (!skip_compute_order)
        this.updateExecutionOrder();

    if (this.onNodeAdded)
        this.onNodeAdded(node);


    this.setDirtyCanvas(true);

    this.change();

    return node; //to chain actions
}

/**
* Removes a node from the graph
* @method remove
* @param {LGraphNode} node the instance of the uiNode
*/

LGraph.prototype.remove = function (node) {
    if (this._nodes_by_id[node.id] == null)
        return; //not found

    if (node.ignore_remove)
        return; //cannot be removed

    //disconnect inputs
    if (node.inputs)
        for (var i = 0; i < node.inputs.length; i++) {
            var slot = node.inputs[i];
            if (slot.link != null)
                node.disconnectInput(i);
        }

    //disconnect outputs
    if (node.outputs)
        for (var i = 0; i < node.outputs.length; i++) {
            var slot = node.outputs[i];
            if (slot.links != null && slot.links.length)
                node.disconnectOutput(i);
        }

    node.id = -1;

    //callback
    if (node.onRemoved)
        node.onRemoved();

    node.graph = null;

    //remove from canvas render
    for (var i in this.list_of_graphcanvas) {
        var canvas = this.list_of_graphcanvas[i];
        if (canvas.selected_nodes[node.id])
            delete canvas.selected_nodes[node.id];
        if (canvas.node_dragged == node)
            canvas.node_dragged = null;
    }

    //remove from containers
    var pos = this._nodes.indexOf(node);
    if (pos != -1)
        this._nodes.splice(pos, 1);
    delete this._nodes_by_id[node.id];

    if (this.onNodeRemoved)
        this.onNodeRemoved(node);

    this.setDirtyCanvas(true, true);

    this.change();

    this.updateExecutionOrder();
}

/**
* Returns a node by its id.
* @method getNodeById
* @param {String} id
*/

LGraph.prototype.getNodeById = function (id) {
    if (id == null) return null;
    return this._nodes_by_id[id];
}

/**
* Returns a list of nodes that matches a class
* @method findNodesByClass
* @param {Class} classObject the class itself (not an string)
* @return {Array} a list with all the nodes of this type
*/

LGraph.prototype.findNodesByClass = function (classObject) {
    var r = [];
    for (var i in this._nodes)
        if (this._nodes[i].constructor === classObject)
            r.push(this._nodes[i]);
    return r;
}

/**
* Returns a list of nodes that matches a type
* @method findNodesByType
* @param {String} type the name of the node type
* @return {Array} a list with all the nodes of this type
*/

LGraph.prototype.findNodesByType = function (type) {
    var r = [];
    for (var i in this._nodes)
        if (this._nodes[i].type == type)
            r.push(this._nodes[i]);
    return r;
}

/**
* Returns a list of nodes that matches a name
* @method findNodesByName
* @param {String} name the name of the node to search
* @return {Array} a list with all the nodes with this name
*/

LGraph.prototype.findNodesByTitle = function (title) {
    var result = [];
    for (var i in this._nodes)
        if (this._nodes[i].title == title)
            result.push(this._nodes[i]);
    return result;
}

/**
* Returns the top-most node in this position of the canvas
* @method getNodeOnPos
* @param {number} x the x coordinate in canvas space
* @param {number} y the y coordinate in canvas space
* @param {Array} nodes_list a list with all the nodes to search from, by default is all the nodes in the graph
* @return {Array} a list with all the nodes that intersect this coordinate
*/

LGraph.prototype.getNodeOnPos = function (x, y, nodes_list) {
    nodes_list = nodes_list || this._nodes;
    for (var i = nodes_list.length - 1; i >= 0; i--) {
        var n = nodes_list[i];
        if (n.isPointInsideNode(x, y, 2))
            return n;
    }
    return null;
}

// ********** GLOBALS *****************

//Tell this graph has a global input of this type
LGraph.prototype.addGlobalInput = function (name, type, value) {
    this.global_inputs[name] = { name: name, type: type, value: value };

    if (this.onGlobalInputAdded)
        this.onGlobalInputAdded(name, type);

    if (this.onGlobalsChange)
        this.onGlobalsChange();
}

//assign a data to the global input
LGraph.prototype.setGlobalInputData = function (name, data) {
    var input = this.global_inputs[name];
    if (!input)
        return;
    input.value = data;
}

//assign a data to the global input
LGraph.prototype.getGlobalInputData = function (name) {
    var input = this.global_inputs[name];
    if (!input)
        return null;
    return input.value;
}

//rename the global input
LGraph.prototype.renameGlobalInput = function (old_name, name) {
    if (name == old_name)
        return;

    if (!this.global_inputs[old_name])
        return false;

    if (this.global_inputs[name]) {
        console.error("there is already one input with that name");
        return false;
    }

    this.global_inputs[name] = this.global_inputs[old_name];
    delete this.global_inputs[old_name];

    if (this.onGlobalInputRenamed)
        this.onGlobalInputRenamed(old_name, name);

    if (this.onGlobalsChange)
        this.onGlobalsChange();
}

LGraph.prototype.changeGlobalInputType = function (name, type) {
    if (!this.global_inputs[name])
        return false;

    if (this.global_inputs[name].type == type)
        return;

    this.global_inputs[name].type = type;
    if (this.onGlobalInputTypeChanged)
        this.onGlobalInputTypeChanged(name, type);
}

LGraph.prototype.removeGlobalInput = function (name) {
    if (!this.global_inputs[name])
        return false;

    delete this.global_inputs[name];

    if (this.onGlobalInputRemoved)
        this.onGlobalInputRemoved(name);

    if (this.onGlobalsChange)
        this.onGlobalsChange();
    return true;
}


LGraph.prototype.addGlobalOutput = function (name, type, value) {
    this.global_outputs[name] = { name: name, type: type, value: value };

    if (this.onGlobalOutputAdded)
        this.onGlobalOutputAdded(name, type);

    if (this.onGlobalsChange)
        this.onGlobalsChange();
}

//assign a data to the global output
LGraph.prototype.setGlobalOutputData = function (name, value) {
    var output = this.global_outputs[name];
    if (!output)
        return;
    output.value = value;
}

//assign a data to the global input
LGraph.prototype.getGlobalOutputData = function (name) {
    var output = this.global_outputs[name];
    if (!output)
        return null;
    return output.value;
}


//rename the global output
LGraph.prototype.renameGlobalOutput = function (old_name, name) {
    if (!this.global_outputs[old_name])
        return false;

    if (this.global_outputs[name]) {
        console.error("there is already one output with that name");
        return false;
    }

    this.global_outputs[name] = this.global_outputs[old_name];
    delete this.global_outputs[old_name];

    if (this.onGlobalOutputRenamed)
        this.onGlobalOutputRenamed(old_name, name);

    if (this.onGlobalsChange)
        this.onGlobalsChange();
}

LGraph.prototype.changeGlobalOutputType = function (name, type) {
    if (!this.global_outputs[name])
        return false;

    if (this.global_outputs[name].type == type)
        return;

    this.global_outputs[name].type = type;
    if (this.onGlobalOutputTypeChanged)
        this.onGlobalOutputTypeChanged(name, type);
}

LGraph.prototype.removeGlobalOutput = function (name) {
    if (!this.global_outputs[name])
        return false;
    delete this.global_outputs[name];

    if (this.onGlobalOutputRemoved)
        this.onGlobalOutputRemoved(name);

    if (this.onGlobalsChange)
        this.onGlobalsChange();
    return true;
}


/**
* Assigns a value to all the nodes that matches this name. This is used to create global variables of the node that
* can be easily accesed from the outside of the graph
* @method setInputData
* @param {String} name the name of the node
* @param {*} value value to assign to this node
*/

LGraph.prototype.setInputData = function (name, value) {
    var m = this.findNodesByName(name);
    for (var i in m)
        m[i].setValue(value);
}

/**
* Returns the value of the first node with this name. This is used to access global variables of the graph from the outside
* @method setInputData
* @param {String} name the name of the node
* @return {*} value of the node
*/

LGraph.prototype.getOutputData = function (name) {
    var n = this.findNodesByName(name);
    if (n.length)
        return m[0].getValue();
    return null;
}

//This feature is not finished yet, is to create graphs where nodes are not executed unless a trigger message is received

LGraph.prototype.triggerInput = function (name, value) {
    var m = this.findNodesByName(name);
    for (var i in m)
        m[i].onTrigger(value);
}

LGraph.prototype.setCallback = function (name, func) {
    var m = this.findNodesByName(name);
    for (var i in m)
        m[i].setTrigger(func);
}


LGraph.prototype.onConnectionChange = function () {
    this.updateExecutionOrder();
}

/**
* returns if the graph is in live mode
* @method isLive
*/

LGraph.prototype.isLive = function () {
    for (var i in this.list_of_graphcanvas) {
        var c = this.list_of_graphcanvas[i];
        if (c.live_mode) return true;
    }
    return false;
}

/* Called when something visually changed */
LGraph.prototype.change = function () {
    if (LiteGraph.debug)
        console.log("Graph changed");

    this.sendActionToCanvas("setDirty", [true, true]);

    if (this.on_change)
        this.on_change(this);
}

LGraph.prototype.setDirtyCanvas = function (fg, bg) {
    this.sendActionToCanvas("setDirty", [fg, bg]);
}

//save and recover app state ***************************************
/**
* Creates a Object containing all the info about this graph, it can be serialized
* @method serialize
* @return {Object} value of the node
*/
LGraph.prototype.serialize = function () {
    var nodes_info = [];
    for (var i in this._nodes)
        nodes_info.push(this._nodes[i].serialize());

    //remove data from links, we dont want to store it
    for (var i in this.links)
        this.links[i].data = null;


    var data = {
        //		graph: this.graph,

        iteration: this.iteration,
        frame: this.frame,
        last_node_id: this.last_node_id,
        last_link_id: this.last_link_id,
        links: LiteGraph.cloneObject(this.links),

        config: this.config,
        nodes: nodes_info
    };

    return data;
}


/**
* Configure a graph from a JSON string 
* @method configure
* @param {String} str configure a graph from a JSON string
*/
LGraph.prototype.configure = function (data, keep_old) {
    if (!keep_old)
        this.clear();

    var nodes = data.nodes;

    //copy all stored fields
    for (var i in data)
        this[i] = data[i];

    var error = false;

    //create nodes
    this._nodes = [];
    for (var i in nodes) {
        var n_info = nodes[i]; //stored info
        var node = LiteGraph.createNode(n_info.type, n_info.title);
        if (!node) {
            if (LiteGraph.debug)
                console.log("Node not found: " + n_info.type);
            error = true;
            continue;
        }

        node.id = n_info.id; //id it or it will create a new id
        this.add(node, true); //add before configure, otherwise configure cannot create links
        node.configure(n_info);
    }

    this.updateExecutionOrder();
    this.setDirtyCanvas(true, true);
    return error;
}

LGraph.prototype.onNodeTrace = function (node, msg, color) {
    //TODO
}

// *************************************************************
//   Node CLASS                                          *******
// *************************************************************

/*
	title: string
	pos: [x,y]
	size: [x,y]

	input|output: every connection
		+  { name:string, type:string, pos: [x,y]=Optional, direction: "input"|"output", links: Array });

	flags:
		+ skip_title_render
		+ clip_area
		+ unsafe_execution: not allowed for safe execution

	supported callbacks: 
		+ onAdded: when added to graph
		+ onRemoved: when removed from graph
		+ onStart:	when starts playing
		+ onStop:	when stops playing
		+ onDrawForeground: render the inside widgets inside the node
		+ onDrawBackground: render the background area inside the node (only in edit mode)
		+ onMouseDown
		+ onMouseMove
		+ onMouseUp
		+ onMouseEnter
		+ onMouseLeave
		+ onExecute: execute the node
		+ onPropertyChange: when a property is changed in the panel (return true to skip default behaviour)
		+ onGetInputs: returns an array of possible inputs
		+ onGetOutputs: returns an array of possible outputs
		+ onDblClick
		+ onSerialize
		+ onSelected
		+ onDeselected
		+ onDropItem : DOM item dropped over the node
		+ onDropFile : file dropped over the node
		+ onConnectInput : if returns false the incoming connection will be canceled
*/

/**
* Base Class for all the node type classes
* @class LGraphNode
* @param {String} name a name for the node
*/

function LGraphNode(title) {
    this._ctor();
}

LGraphNode.prototype._ctor = function (title) {
    this.title = title || "Unnamed";
    this.size = [LiteGraph.NODE_WIDTH, 60];
    this.graph = null;

    this._pos = new Float32Array(10, 10);

    Object.defineProperty(this, "pos", {
        set: function (v) {
            if (!v || !v.length < 2)
                return;
            this._pos[0] = v[0];
            this._pos[1] = v[1];
        },
        get: function () {
            return this._pos;
        },
        enumerable: true
    });

    this.id = -1; //not know till not added
    this.type = null;

    //inputs available: array of inputs
    this.inputs = [];
    this.outputs = [];
    this.connections = [];

    //local data
    this.properties = {};
    this.data = null; //persistent local data
    this.flags = {
        //skip_title_render: true,
        //unsafe_execution: false,
    };
}

/**
* configure a node from an object containing the serialized info
* @method configure
*/
LGraphNode.prototype.configure = function (info) {
    for (var j in info) {
        if (j == "console") continue;

        if (j == "properties") {
            //i dont want to clone properties, I want to reuse the old container
            for (var k in info.properties)
                this.properties[k] = info.properties[k];
            continue;
        }

        if (info[j] == null)
            continue;
        else if (typeof (info[j]) == 'object') //object
        {
            if (this[j] && this[j].configure)
                this[j].configure(info[j]);
            else
                this[j] = LiteGraph.cloneObject(info[j], this[j]);
        }
        else //value
            this[j] = info[j];
    }

    //FOR LEGACY, PLEASE REMOVE ON NEXT VERSION
    for (var i in this.inputs) {
        var input = this.inputs[i];
        if (!input.link || !input.link.length)
            continue;
        var link = input.link;
        if (typeof (link) != "object")
            continue;
        input.link = link[0];
        this.graph.links[link[0]] = { id: link[0], origin_id: link[1], origin_slot: link[2], target_id: link[3], target_slot: link[4] };
    }
    for (var i in this.outputs) {
        var output = this.outputs[i];
        if (!output.links || output.links.length == 0)
            continue;
        for (var j in output.links) {
            var link = output.links[j];
            if (typeof (link) != "object")
                continue;
            output.links[j] = link[0];
        }
    }

}

/**
* serialize the content
* @method serialize
*/

LGraphNode.prototype.serialize = function () {
    var o = {
        id: this.id,
        title: this.title,
        type: this.type,
        pos: this.pos,
        size: this.size,
        data: this.data,
        flags: LiteGraph.cloneObject(this.flags),
        inputs: this.inputs,
        outputs: this.outputs,
        panel_id: this.panel_id
    };

    if (this.properties)
        o.properties = LiteGraph.cloneObject(this.properties);

    if (!o.type)
        o.type = this.constructor.type;

    if (this.color)
        o.color = this.color;
    if (this.bgcolor)
        o.bgcolor = this.bgcolor;
    if (this.boxcolor)
        o.boxcolor = this.boxcolor;
    if (this.shape)
        o.shape = this.shape;

    if (this.onSerialize)
        this.onSerialize(o);

    return o;
}


/* Creates a clone of this node */
LGraphNode.prototype.clone = function () {
    var node = LiteGraph.createNode(this.type);

    var data = this.serialize();
    delete data["id"];
    node.configure(data);

    return node;
}


/**
* serialize and stringify
* @method toString
*/

LGraphNode.prototype.toString = function () {
    return JSON.stringify(this.serialize());
}
//LGraphNode.prototype.unserialize = function(info) {} //this cannot be done from within, must be done in LiteGraph


/**
* get the title string
* @method getTitle
*/

LGraphNode.prototype.getTitle = function () {
    return this.title || this.constructor.title;
}



// Execution *************************
/**
* sets the output data
* @method setOutputData
* @param {number} slot
* @param {*} data
*/
LGraphNode.prototype.setOutputData = function (slot, data) {
    if (!this.outputs)
        return;

    if (slot > -1 && slot < this.outputs.length && this.outputs[slot] && this.outputs[slot].links != null) {
        for (var i = 0; i < this.outputs[slot].links.length; i++) {
            var link_id = this.outputs[slot].links[i];
            this.graph.links[link_id].data = data;
        }
    }
}

/**
* retrieves the input data (data traveling through the connection) from one slot
* @method getInputData
* @param {number} slot
* @return {*} data or if it is not connected returns undefined
*/
LGraphNode.prototype.getInputData = function (slot) {
    if (!this.inputs)
        return; //undefined;
    if (slot < this.inputs.length && this.inputs[slot].link != null)
        return this.graph.links[this.inputs[slot].link].data;
    return; //undefined;
}

/**
* tells you if there is a connection in one input slot
* @method isInputConnected
* @param {number} slot
* @return {boolean} 
*/
LGraphNode.prototype.isInputConnected = function (slot) {
    if (!this.inputs)
        return false;
    return (slot < this.inputs.length && this.inputs[slot].link != null);
}

/**
* tells you info about an input connection (which node, type, etc)
* @method getInputInfo
* @param {number} slot
* @return {Object} object or null
*/
LGraphNode.prototype.getInputInfo = function (slot) {
    if (!this.inputs)
        return null;
    if (slot < this.inputs.length)
        return this.inputs[slot];
    return null;
}


/**
* tells you info about an output connection (which node, type, etc)
* @method getOutputInfo
* @param {number} slot
* @return {Object}  object or null
*/
LGraphNode.prototype.getOutputInfo = function (slot) {
    if (!this.outputs)
        return null;
    if (slot < this.outputs.length)
        return this.outputs[slot];
    return null;
}


/**
* tells you if there is a connection in one output slot
* @method isOutputConnected
* @param {number} slot
* @return {boolean} 
*/
LGraphNode.prototype.isOutputConnected = function (slot) {
    if (!this.outputs)
        return null;
    return (slot < this.outputs.length && this.outputs[slot].links && this.outputs[slot].links.length);
}

/**
* retrieves all the nodes connected to this output slot
* @method getOutputNodes
* @param {number} slot
* @return {array} 
*/
LGraphNode.prototype.getOutputNodes = function (slot) {
    if (!this.outputs || this.outputs.length == 0) return null;
    if (slot < this.outputs.length) {
        var output = this.outputs[slot];
        var r = [];
        for (var i = 0; i < output.length; i++)
            r.push(this.graph.getNodeById(output.links[i].target_id));
        return r;
    }
    return null;
}

LGraphNode.prototype.triggerOutput = function (slot, param) {
    var n = this.getOutputNode(slot);
    if (n && n.onTrigger)
        n.onTrigger(param);
}

//connections

/**
* add a new output slot to use in this node
* @method addOutput
* @param {string} name
* @param {string} type string defining the output type ("vec3","number",...)
* @param {Object} extra_info this can be used to have special properties of an output (label, special color, position, etc)
*/
LGraphNode.prototype.addOutput = function (name, type, extra_info) {
    var o = { name: name, type: type, links: null };
    if (extra_info)
        for (var i in extra_info)
            o[i] = extra_info[i];

    if (!this.outputs) this.outputs = [];
    this.outputs.push(o);
    if (this.onOutputAdded)
        this.onOutputAdded(o);
    //derwish remove
    //this.size = this.computeSize();
}

/**
* add a new output slot to use in this node
* @method addOutputs
* @param {Array} array of triplets like [[name,type,extra_info],[...]]
*/
LGraphNode.prototype.addOutputs = function (array) {
    for (var i in array) {
        var info = array[i];
        var o = { name: info[0], type: info[1], link: null };
        if (array[2])
            for (var j in info[2])
                o[j] = info[2][j];

        if (!this.outputs)
            this.outputs = [];
        this.outputs.push(o);
        if (this.onOutputAdded)
            this.onOutputAdded(o);
    }
    //derwish remove
    //this.size = this.computeSize();
}

/**
* remove an existing output slot
* @method removeOutput
* @param {number} slot
*/
LGraphNode.prototype.removeOutput = function (slot) {
    this.disconnectOutput(slot);
    this.outputs.splice(slot, 1);
    //derwish remove
    //this.size = this.computeSize();
    if (this.onOutputRemoved)
        this.onOutputRemoved(slot);
}

/**
* add a new input slot to use in this node
* @method addInput
* @param {string} name
* @param {string} type string defining the input type ("vec3","number",...), it its a generic one use 0
* @param {Object} extra_info this can be used to have special properties of an input (label, color, position, etc)
*/
LGraphNode.prototype.addInput = function (name, type, extra_info) {
    type = type || 0;
    var o = { name: name, type: type, link: null };
    if (extra_info)
        for (var i in extra_info)
            o[i] = extra_info[i];

    if (!this.inputs)
        this.inputs = [];
    this.inputs.push(o);
    //derwish remove
    //this.size = this.computeSize();
    if (this.onInputAdded)
        this.onInputAdded(o);
}

/**
* add several new input slots in this node
* @method addInputs
* @param {Array} array of triplets like [[name,type,extra_info],[...]]
*/
LGraphNode.prototype.addInputs = function (array) {
    for (var i in array) {
        var info = array[i];
        var o = { name: info[0], type: info[1], link: null };
        if (array[2])
            for (var j in info[2])
                o[j] = info[2][j];

        if (!this.inputs)
            this.inputs = [];
        this.inputs.push(o);
        if (this.onInputAdded)
            this.onInputAdded(o);
    }
    //derwish remove
    //this.size = this.computeSize();
}

/**
* remove an existing input slot
* @method removeInput
* @param {number} slot
*/
LGraphNode.prototype.removeInput = function (slot) {
    this.disconnectInput(slot);
    this.inputs.splice(slot, 1);
    //derwish remove
    //this.size = this.computeSize();
    if (this.onInputRemoved)
        this.onInputRemoved(slot);
}

/**
* add an special connection to this node (used for special kinds of graphs)
* @method addConnection
* @param {string} name
* @param {string} type string defining the input type ("vec3","number",...)
* @param {[x,y]} pos position of the connection inside the node
* @param {string} direction if is input or output
*/
LGraphNode.prototype.addConnection = function (name, type, pos, direction) {
    this.connections.push({ name: name, type: type, pos: pos, direction: direction, links: null });
}

/**
* computes the size of a node according to its inputs and output slots
* @method computeSize
* @param {number} minHeight
* @return {number} the total size
*/
LGraphNode.prototype.computeSize = function (minHeight) {
    var rows = Math.max(this.inputs ? this.inputs.length : 1, this.outputs ? this.outputs.length : 1);
    var size = new Float32Array([0, 0]);
    rows = Math.max(rows, 1);
    size[1] = rows * 14 + 6;

    var font_size = 14;
    var title_width = compute_text_size(this.title);
    var input_width = 0;
    var output_width = 0;

    if (this.inputs)
        for (var i = 0, l = this.inputs.length; i < l; ++i) {
            var input = this.inputs[i];
            var text = input.label || input.name || "";
            var text_width = compute_text_size(text);
            if (input_width < text_width)
                input_width = text_width;
        }

    if (this.outputs)
        for (var i = 0, l = this.outputs.length; i < l; ++i) {
            var output = this.outputs[i];
            var text = output.label || output.name || "";
            var text_width = compute_text_size(text);
            if (output_width < text_width)
                output_width = text_width;
        }

    size[0] = Math.max(input_width + output_width + 10, title_width);
    size[0] = Math.max(size[0], LiteGraph.NODE_WIDTH);

    //derwish added
    size[0] = Math.round(size[0]);
    size[1] = Math.round(size[1]);

    function compute_text_size(text) {
        if (!text)
            return 0;
        return font_size * text.length * 0.6;
    }

    return size;
}

/**
* returns the bounding of the object, used for rendering purposes
* @method getBounding
* @return {Float32Array[4]} the total size
*/
LGraphNode.prototype.getBounding = function () {
    return new Float32Array([this.pos[0] - 4, this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT, this.pos[0] + this.size[0] + 4, this.pos[1] + this.size[1] + LGraph.NODE_TITLE_HEIGHT]);
}

/**
* checks if a point is inside the shape of a node
* @method isPointInsideNode
* @param {number} x
* @param {number} y
* @return {boolean} 
*/
LGraphNode.prototype.isPointInsideNode = function (x, y, margin) {
    margin = margin || 0;

    var margin_top = this.graph && this.graph.isLive() ? 0 : 20;
    if (this.flags.collapsed) {
        //if ( distance([x,y], [this.pos[0] + this.size[0]*0.5, this.pos[1] + this.size[1]*0.5]) < LiteGraph.NODE_COLLAPSED_RADIUS)
        if (isInsideRectangle(x, y, this.pos[0] - margin, this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT - margin, LiteGraph.NODE_COLLAPSED_WIDTH + 2 * margin, LiteGraph.NODE_TITLE_HEIGHT + 2 * margin))
            return true;
    }
    else if ((this.pos[0] - 4 - margin) < x && (this.pos[0] + this.size[0] + 4 + margin) > x
		&& (this.pos[1] - margin_top - margin) < y && (this.pos[1] + this.size[1] + margin) > y)
        return true;
    return false;
}

/**
* checks if a point is inside a node slot, and returns info about which slot
* @method getSlotInPosition
* @param {number} x
* @param {number} y
* @return {Object} if found the object contains { input|output: slot object, slot: number, link_pos: [x,y] }
*/
LGraphNode.prototype.getSlotInPosition = function (x, y) {
    //search for inputs
    if (this.inputs)
        for (var i = 0, l = this.inputs.length; i < l; ++i) {
            var input = this.inputs[i];
            var link_pos = this.getConnectionPos(true, i);
            if (isInsideRectangle(x, y, link_pos[0] - 10, link_pos[1] - 5, 20, 10))
                return { input: input, slot: i, link_pos: link_pos, locked: input.locked };
        }

    if (this.outputs)
        for (var i = 0, l = this.outputs.length; i < l; ++i) {
            var output = this.outputs[i];
            var link_pos = this.getConnectionPos(false, i);
            if (isInsideRectangle(x, y, link_pos[0] - 10, link_pos[1] - 5, 20, 10))
                return { output: output, slot: i, link_pos: link_pos, locked: output.locked };
        }

    return null;
}

/**
* returns the input slot with a given name (used for dynamic slots), -1 if not found
* @method findInputSlot
* @param {string} name the name of the slot 
* @return {number} the slot (-1 if not found)
*/
LGraphNode.prototype.findInputSlot = function (name) {
    if (!this.inputs) return -1;
    for (var i = 0, l = this.inputs.length; i < l; ++i)
        if (name == this.inputs[i].name)
            return i;
    return -1;
}

/**
* returns the output slot with a given name (used for dynamic slots), -1 if not found
* @method findOutputSlot
* @param {string} name the name of the slot 
* @return {number} the slot (-1 if not found)
*/
LGraphNode.prototype.findOutputSlot = function (name) {
    if (!this.outputs) return -1;
    for (var i = 0, l = this.outputs.length; i < l; ++i)
        if (name == this.outputs[i].name)
            return i;
    return -1;
}

/**
* connect this node output to the input of another uiNode
* @method connect
* @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
* @param {LGraphNode} node the target uiNode 
* @param {number_or_string} target_slot the input slot of the target node (could be the number of the slot or the string with the name of the slot)
* @return {boolean} if it was connected succesfully
*/
//derwish edit
LGraphNode.prototype.connect = function (slot, node, target_slot, linkId) {
    target_slot = target_slot || 0;

    //seek for the output slot
    if (slot.constructor === String) {
        slot = this.findOutputSlot(slot);
        if (slot == -1) {
            if (LiteGraph.debug)
                console.log("Connect: Error, no slot of name " + slot);
            return false;
        }
    }
    else if (!this.outputs || slot >= this.outputs.length) {
        if (LiteGraph.debug)
            console.log("Connect: Error, slot number not found");
        return false;
    }

    if (node && node.constructor === Number)
        node = this.graph.getNodeById(node);
    if (!node)
        throw ("Node not found");

    //avoid loopback
    if (node == this)
        return false;
    //if( node.constructor != LGraphNode ) throw ("LGraphNode.connect: uiNode is not of type LGraphNode");

    if (target_slot.constructor === String) {
        target_slot = node.findInputSlot(target_slot);
        if (target_slot == -1) {
            if (LiteGraph.debug)
                console.log("Connect: Error, no slot of name " + target_slot);
            return false;
        }
    }
    else if (!node.inputs || target_slot >= node.inputs.length) {
        if (LiteGraph.debug)
            console.log("Connect: Error, slot number not found");
        return false;
    }
    //derwish removed
    //if there is something already plugged there, disconnect
    //if(target_slot != -1 && node.inputs[target_slot].link != null)
    //	node.disconnectInput(target_slot);

    this.setDirtyCanvas(false, true);
    this.graph.onConnectionChange();

    //special case: -1 means node-connection, used for triggers
    var output = this.outputs[slot];

    //allows nodes to block connection even if all test passes
    if (node.onConnectInput)
        if (node.onConnectInput(target_slot, output.type, output) === false)
            return false;

    if (target_slot == -1) {
        if (output.links == null)
            output.links = [];
        output.links.push({ id: node.id, slot: -1 });
    }
    else
        //prevent connection of different types
        //if (!output.type ||  //generic output
        //	!node.inputs[target_slot].type || //generic input
        //	output.type == node.inputs[target_slot].type) //same type
    {
        //info: link structure => [ 0:link_id, 1:start_node_id, 2:start_slot, 3:end_node_id, 4:end_slot ]
        //var link = [ this.graph.last_link_id++, this.id, slot, node.id, target_slot ];
        //derwish edit
        var link = { id: linkId, origin_id: this.id, origin_slot: slot, target_id: node.id, target_slot: target_slot };
        this.graph.links[link.id] = link;

        //connect
        if (output.links == null) output.links = [];

        //derwish added - do not push if exists
        if (output.links.indexOf(link.id) == -1) {
            output.links.push(link.id);
        }

        node.inputs[target_slot].link = link.id;

    }

    return true;
}

/**
* disconnect one output to an specific node
* @method disconnectOutput
* @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
* @param {LGraphNode} target_node the target node to which this slot is connected [Optional, if not target_node is specified all nodes will be disconnected]
* @return {boolean} if it was disconnected succesfully
*/
LGraphNode.prototype.disconnectOutput = function (slot, target_node) {
    if (slot.constructor === String) {
        slot = this.findOutputSlot(slot);
        if (slot == -1) {
            if (LiteGraph.debug)
                console.log("Connect: Error, no slot of name " + slot);
            return false;
        }
    }
    else if (!this.outputs || slot >= this.outputs.length) {
        if (LiteGraph.debug)
            console.log("Connect: Error, slot number not found");
        return false;
    }

    //get output slot
    var output = this.outputs[slot];
    if (!output.links || output.links.length == 0)
        return false;

    if (target_node) {
        if (target_node.constructor === Number)
            target_node = this.graph.getNodeById(target_node);
        if (!target_node)
            throw ("Target Node not found");

        for (var i = 0, l = output.links.length; i < l; i++) {
            var link_id = output.links[i];
            var link_info = this.graph.links[link_id];

            //is the link we are searching for...
            if (link_info.target_id == target_node.id) {
                output.links.splice(i, 1); //remove here
                target_node.inputs[link_info.target_slot].link = null; //remove there
                delete this.graph.links[link_id]; //remove the link from the links pool
                break;
            }
        }
    }
    else {
        for (var i = 0, l = output.links.length; i < l; i++) {
            var link_id = output.links[i];
            var link_info = this.graph.links[link_id];

            var target_node = this.graph.getNodeById(link_info.target_id);
            if (target_node)
                target_node.inputs[link_info.target_slot].link = null; //remove other side link
            delete this.graph.links[link_id]; //remove the link from the links pool
        }
        output.links = null;
    }

    this.setDirtyCanvas(false, true);
    this.graph.onConnectionChange();
    return true;
}

/**
* disconnect one input
* @method disconnectInput
* @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
* @return {boolean} if it was disconnected succesfully
*/
LGraphNode.prototype.disconnectInput = function (slot) {
    //seek for the output slot
    if (slot.constructor === String) {
        slot = this.findInputSlot(slot);
        if (slot == -1) {
            if (LiteGraph.debug)
                console.log("Connect: Error, no slot of name " + slot);
            return false;
        }
    }
    else if (!this.inputs || slot >= this.inputs.length) {
        if (LiteGraph.debug)
            console.log("Connect: Error, slot number not found");
        return false;
    }

    var input = this.inputs[slot];
    if (!input)
        return false;
    var link_id = this.inputs[slot].link;
    this.inputs[slot].link = null;

    //remove other side
    var link_info = this.graph.links[link_id];
    if (link_info) {
        var node = this.graph.getNodeById(link_info.origin_id);
        if (!node)
            return false;

        var output = node.outputs[link_info.origin_slot];
        if (!output || !output.links || output.links.length == 0)
            return false;

        //check outputs
        for (var i = 0, l = output.links.length; i < l; i++) {
            if (link_id == output.links[i]) {
                output.links.splice(i, 1);
                break;
            }
        }
    }

    //derwish added
    //send_delete_link(graph.links[link_id]);

    //derwish added
    delete graph.links[link_id];


    this.setDirtyCanvas(false, true);
    this.graph.onConnectionChange();
    return true;
}

/**
* returns the center of a connection point in canvas coords
* @method getConnectionPos
* @param {boolean} is_input true if if a input slot, false if it is an output
* @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
* @return {[x,y]} the position
**/
LGraphNode.prototype.getConnectionPos = function (is_input, slot_number) {
    if (this.flags.collapsed) {
        if (is_input)
            return [this.pos[0], this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT * 0.5];
        else
            return [this.pos[0] + LiteGraph.NODE_COLLAPSED_WIDTH, this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT * 0.5];
        //return [this.pos[0] + this.size[0] * 0.5, this.pos[1] + this.size[1] * 0.5];
    }

    if (is_input && slot_number == -1) {
        return [this.pos[0] + 10, this.pos[1] + 10];
    }

    if (is_input && this.inputs.length > slot_number && this.inputs[slot_number].pos)
        return [this.pos[0] + this.inputs[slot_number].pos[0], this.pos[1] + this.inputs[slot_number].pos[1]];
    else if (!is_input && this.outputs.length > slot_number && this.outputs[slot_number].pos)
        return [this.pos[0] + this.outputs[slot_number].pos[0], this.pos[1] + this.outputs[slot_number].pos[1]];

    if (!is_input) //output
        return [this.pos[0] + this.size[0] + 1, this.pos[1] + 10 + slot_number * LiteGraph.NODE_SLOT_HEIGHT];
    return [this.pos[0], this.pos[1] + 10 + slot_number * LiteGraph.NODE_SLOT_HEIGHT];
}

/* Force align to grid */
LGraphNode.prototype.alignToGrid = function () {
    this.pos[0] = LiteGraph.CANVAS_GRID_SIZE * Math.round(this.pos[0] / LiteGraph.CANVAS_GRID_SIZE);
    this.pos[1] = LiteGraph.CANVAS_GRID_SIZE * Math.round(this.pos[1] / LiteGraph.CANVAS_GRID_SIZE);
}


/* Console output */
LGraphNode.prototype.trace = function (msg) {
    if (!this.console)
        this.console = [];
    this.console.push(msg);
    if (this.console.length > LGraphNode.MAX_CONSOLE)
        this.console.shift();

    this.graph.onNodeTrace(this, msg);
}

/* Forces to redraw or the main canvas (LGraphNode) or the bg canvas (links) */
LGraphNode.prototype.setDirtyCanvas = function (dirty_foreground, dirty_background) {
    if (!this.graph)
        return;
    this.graph.sendActionToCanvas("setDirty", [dirty_foreground, dirty_background]);
}

LGraphNode.prototype.loadImage = function (url) {
    var img = new Image();
    img.src = LiteGraph.node_images_path + url;
    img.ready = false;

    var that = this;
    img.onload = function () {
        this.ready = true;
        that.setDirtyCanvas(true);
    }
    return img;
}

//safe LGraphNode action execution (not sure if safe)
LGraphNode.prototype.executeAction = function (action) {
    if (action == "") return false;

    if (action.indexOf(";") != -1 || action.indexOf("}") != -1) {
        this.trace("Error: Action contains unsafe characters");
        return false;
    }

    var tokens = action.split("(");
    var func_name = tokens[0];
    if (typeof (this[func_name]) != "function") {
        this.trace("Error: Action not found on node: " + func_name);
        return false;
    }

    var code = action;

    try {
        var _foo = eval;
        eval = null;
        (new Function("with(this) { " + code + "}")).call(this);
        eval = _foo;
    }
    catch (err) {
        this.trace("Error executing action {" + action + "} :" + err);
        return false;
    }

    return true;
}

/* Allows to get onMouseMove and onMouseUp events even if the mouse is out of focus */
LGraphNode.prototype.captureInput = function (v) {
    if (!this.graph || !this.graph.list_of_graphcanvas)
        return;

    var list = this.graph.list_of_graphcanvas;

    for (var i in list) {
        var c = list[i];
        //releasing somebody elses capture?!
        if (!v && c.node_capturing_input != this)
            continue;

        //change
        c.node_capturing_input = v ? this : null;
    }
}

/**
* Collapse the node to make it smaller on the canvas
* @method collapse
**/
LGraphNode.prototype.collapse = function () {
    if (!this.flags.collapsed)
        this.flags.collapsed = true;
    else
        this.flags.collapsed = false;
    this.setDirtyCanvas(true, true);
}

/**
* Forces the node to do not move or realign on Z
* @method pin
**/

LGraphNode.prototype.pin = function (v) {
    if (v === undefined)
        this.flags.pinned = !this.flags.pinned;
    else
        this.flags.pinned = v;
}

LGraphNode.prototype.localToScreen = function (x, y, graphcanvas) {
    return [(x + this.pos[0]) * graphcanvas.scale + graphcanvas.offset[0],
		(y + this.pos[1]) * graphcanvas.scale + graphcanvas.offset[1]];
}



//*********************************************************************************
// LGraphCanvas: LGraph renderer CLASS                                  
//*********************************************************************************

/**
* The Global Scope. It contains all the registered node classes.
*
* @class LGraphCanvas
* @constructor
* @param {HTMLCanvas} canvas the canvas where you want to render (it accepts a selector in string format or the canvas itself)
* @param {LGraph} graph [optional]
*/
function LGraphCanvas(canvas, graph, skip_render) {
    //if(graph === undefined)
    //	throw ("No graph assigned");

    if (canvas && canvas.constructor === String)
        canvas = document.querySelector(canvas);

    //derwish edit
    this.max_zoom = 2;
    this.min_zoom = 0.1;

    //link canvas and graph
    if (graph)
        graph.attachCanvas(this);

    this.setCanvas(canvas);
    this.clear();

    if (!skip_render)
        this.startRendering();
}


LGraphCanvas.link_type_colors = { 0: "#AAC", 1: "#AAC", 2: "#AAC" };


/**
* clears all the data inside
*
* @method clear
*/
LGraphCanvas.prototype.clear = function () {
    this.frame = 0;
    this.last_draw_time = 0;
    this.render_time = 0;
    this.fps = 0;

    this.scale = 1;
    this.offset = [0, 0];

    this.selected_nodes = {};
    this.node_dragged = null;
    this.node_over = null;
    this.node_capturing_input = null;
    this.connecting_node = null;

    this.highquality_render = true;
    this.editor_alpha = 1; //used for transition
    this.pause_rendering = false;
    this.render_shadows = true;
    this.shadows_width = LiteGraph.SHADOWS_WIDTH;
    this.clear_background = true;

    this.render_only_selected = true;
    this.live_mode = false;
    this.show_info = false;
    this.allow_dragcanvas = true;
    this.allow_dragnodes = true;

    this.dirty_canvas = true;
    this.dirty_bgcanvas = true;
    this.dirty_area = null;

    this.node_in_panel = null;

    this.last_mouse = [0, 0];
    this.last_mouseclick = 0;

    this.title_text_font = LiteGraph.TITLE_TEXT_FONT;
    this.inner_text_font = LiteGraph.INNER_TEXT_FONT;

    this.render_connections_shadows = false; //too much cpu
    this.render_connections_border = true;
    this.render_curved_connections = true;
    this.render_connection_arrows = LiteGraph.RENDER_CONNECTION_ARROWS;

    this.connections_width = LiteGraph.CONNECTIONS_WIDTH;
    this.connections_shadow = LiteGraph.CONNECTIONS_SHADOW;

    if (this.onClear) this.onClear();
    //this.UIinit();

    if (this.onClear) this.onClear();

}

/**
* assigns a graph, you can reasign graphs to the same canvas
*
* @method setGraph
* @param {LGraph} graph
*/
LGraphCanvas.prototype.setGraph = function (graph, skip_clear) {
    if (this.graph == graph)
        return;

    if (!skip_clear)
        this.clear();

    if (!graph && this.graph) {
        this.graph.detachCanvas(this);
        return;
    }

    /*
	if(this.graph)
		this.graph.canvas = null; //remove old graph link to the canvas
	this.graph = graph;
	if(this.graph)
		this.graph.canvas = this;
	*/
    graph.attachCanvas(this);
    this.setDirty(true, true);
}

/**
* opens a graph contained inside a node in the current graph
*
* @method openSubgraph
* @param {LGraph} graph
*/
LGraphCanvas.prototype.openSubgraph = function (graph) {
    if (!graph)
        throw ("graph cannot be null");

    if (this.graph == graph)
        throw ("graph cannot be the same");

    this.clear();

    if (this.graph) {
        if (!this._graph_stack)
            this._graph_stack = [];
        this._graph_stack.push(this.graph);
    }

    graph.attachCanvas(this);
    this.setDirty(true, true);
}

/**
* closes a subgraph contained inside a node 
*
* @method closeSubgraph
* @param {LGraph} assigns a graph
*/
LGraphCanvas.prototype.closeSubgraph = function () {
    if (!this._graph_stack || this._graph_stack.length == 0)
        return;
    var graph = this._graph_stack.pop();
    graph.attachCanvas(this);
    this.setDirty(true, true);
}

/**
* assigns a canvas
*
* @method setCanvas
* @param {Canvas} assigns a canvas
*/
LGraphCanvas.prototype.setCanvas = function (canvas, skip_events) {
    var that = this;

    if (canvas) {
        if (canvas.constructor === String) {
            canvas = document.getElementById(canvas);
            if (!canvas)
                throw ("Error creating LiteGraph canvas: Canvas not found");
        }
    }

    if (canvas === this.canvas)
        return;

    if (!canvas && this.canvas) {
        //maybe detach events from old_canvas
        if (!skip_events)
            this.unbindEvents();
    }

    this.canvas = canvas;

    if (!canvas)
        return;

    //this.canvas.tabindex = "1000";
    canvas.className += " lgraphcanvas";
    canvas.data = this;

    //bg canvas: used for non changing stuff
    this.bgcanvas = null;
    if (!this.bgcanvas) {
        this.bgcanvas = document.createElement("canvas");
        this.bgcanvas.width = this.canvas.width;
        this.bgcanvas.height = this.canvas.height;
    }

    if (canvas.getContext == null) {
        throw ("This browser doesnt support Canvas");
    }

    var ctx = this.ctx = canvas.getContext("2d");
    if (ctx == null) {
        console.warn("This canvas seems to be WebGL, enabling WebGL renderer");
        this.enableWebGL();
    }

    //input:  (move and up could be unbinded)
    this._mousemove_callback = this.processMouseMove.bind(this);
    this._mouseup_callback = this.processMouseUp.bind(this);

    if (!skip_events)
        this.bindEvents();
}

//used in some events to capture them
LGraphCanvas.prototype._doNothing = function doNothing(e) { e.preventDefault(); return false; };
LGraphCanvas.prototype._doReturnTrue = function doNothing(e) { e.preventDefault(); return true; };

LGraphCanvas.prototype.bindEvents = function () {
    if (this._events_binded) {
        console.warn("LGraphCanvas: events already binded");
        return;
    }

    var canvas = this.canvas;

    this._mousedown_callback = this.processMouseDown.bind(this);
    this._mousewheel_callback = this.processMouseWheel.bind(this);

    canvas.addEventListener("mousedown", this._mousedown_callback, true); //down do not need to store the binded
    canvas.addEventListener("mousemove", this._mousemove_callback);
    canvas.addEventListener("mousewheel", this._mousewheel_callback, false);

    canvas.addEventListener("contextmenu", this._doNothing);
    canvas.addEventListener("DOMMouseScroll", this._mousewheel_callback, false);

    //touch events
    //if( 'touchstart' in document.documentElement )
    {
        canvas.addEventListener("touchstart", this.touchHandler, true);
        canvas.addEventListener("touchmove", this.touchHandler, true);
        canvas.addEventListener("touchend", this.touchHandler, true);
        canvas.addEventListener("touchcancel", this.touchHandler, true);
    }

    //Keyboard ******************
    this._key_callback = this.processKey.bind(this);

    canvas.addEventListener("keydown", this._key_callback);
    canvas.addEventListener("keyup", this._key_callback);

    //Droping Stuff over nodes ************************************
    this._ondrop_callback = this.processDrop.bind(this);

    canvas.addEventListener("dragover", this._doNothing, false);
    canvas.addEventListener("dragend", this._doNothing, false);
    canvas.addEventListener("drop", this._ondrop_callback, false);
    canvas.addEventListener("dragenter", this._doReturnTrue, false);

    this._events_binded = true;
}

LGraphCanvas.prototype.unbindEvents = function () {
    if (!this._events_binded) {
        console.warn("LGraphCanvas: no events binded");
        return;
    }

    this.canvas.removeEventListener("mousedown", this._mousedown_callback);
    this.canvas.removeEventListener("mousewheel", this._mousewheel_callback);
    this.canvas.removeEventListener("DOMMouseScroll", this._mousewheel_callback);
    this.canvas.removeEventListener("keydown", this._key_callback);
    this.canvas.removeEventListener("keyup", this._key_callback);
    this.canvas.removeEventListener("contextmenu", this._doNothing);
    this.canvas.removeEventListener("drop", this._ondrop_callback);
    this.canvas.removeEventListener("dragenter", this._doReturnTrue);

    this.canvas.removeEventListener("touchstart", this.touchHandler);
    this.canvas.removeEventListener("touchmove", this.touchHandler);
    this.canvas.removeEventListener("touchend", this.touchHandler);
    this.canvas.removeEventListener("touchcancel", this.touchHandler);

    this._mousedown_callback = null;
    this._mousewheel_callback = null;
    this._key_callback = null;
    this._ondrop_callback = null;

    this._events_binded = false;
}

LGraphCanvas.getFileExtension = function (url) {
    var question = url.indexOf("?");
    if (question != -1)
        url = url.substr(0, question);
    var point = url.lastIndexOf(".");
    if (point == -1)
        return "";
    return url.substr(point + 1).toLowerCase();
}

//this file allows to render the canvas using WebGL instead of Canvas2D
//this is useful if you plant to render 3D objects inside your nodes
LGraphCanvas.prototype.enableWebGL = function () {
    if (typeof (GL) === undefined)
        throw ("litegl.js must be included to use a WebGL canvas");
    if (typeof (enableWebGLCanvas) === undefined)
        throw ("webglCanvas.js must be included to use this feature");

    this.gl = this.ctx = enableWebGLCanvas(this.canvas);
    this.ctx.webgl = true;
    this.bgcanvas = this.canvas;
    this.bgctx = this.gl;

    /*
	GL.create({ canvas: this.bgcanvas });
	this.bgctx = enableWebGLCanvas( this.bgcanvas );
	window.gl = this.gl;
	*/
}


/*
LGraphCanvas.prototype.UIinit = function()
{
	var that = this;
	$("#node-console input").change(function(e)
	{
		if(e.target.value == "")
			return;

		var node = that.node_in_panel;
		if(!node)
			return;
			
		node.trace("] " + e.target.value, "#333");
		if(node.onConsoleCommand)
		{
			if(!node.onConsoleCommand(e.target.value))
				node.trace("command not found", "#A33");
		}
		else if (e.target.value == "info")
		{
			node.trace("Special methods:");
			for(var i in node)
			{
				if(typeof(node[i]) == "function" && LGraphNode.prototype[i] == null && i.substr(0,2) != "on" && i[0] != "_")
					node.trace(" + " + i);
			}
		}
		else
		{
			try
			{
				eval("var _foo = function() { return ("+e.target.value+"); }");
				var result = _foo.call(node);
				if(result)
					node.trace(result.toString());
				delete window._foo;
			}
			catch(err)
			{
				node.trace("error: " + err, "#A33");
			}
		}
		
		this.value = "";
	});
}
*/

/**
* marks as dirty the canvas, this way it will be rendered again 
*
* @class LGraphCanvas
* @method setDirty
* @param {bool} fgcanvas if the foreground canvas is dirty (the one containing the nodes)
* @param {bool} bgcanvas if the background canvas is dirty (the one containing the wires)
*/
LGraphCanvas.prototype.setDirty = function (fgcanvas, bgcanvas) {
    if (fgcanvas)
        this.dirty_canvas = true;
    if (bgcanvas)
        this.dirty_bgcanvas = true;
}

/**
* Used to attach the canvas in a popup
*
* @method getCanvasWindow
* @return {window} returns the window where the canvas is attached (the DOM root node)
*/
LGraphCanvas.prototype.getCanvasWindow = function () {
    var doc = this.canvas.ownerDocument;
    return doc.defaultView || doc.parentWindow;
}

/**
* starts rendering the content of the canvas when needed
*
* @method startRendering
*/
LGraphCanvas.prototype.startRendering = function () {
    if (this.is_rendering) return; //already rendering

    this.is_rendering = true;
    renderFrame.call(this);

    function renderFrame() {
        if (!this.pause_rendering)
            this.draw();

        var window = this.getCanvasWindow();
        if (this.is_rendering)
            window.requestAnimationFrame(renderFrame.bind(this));
    }
}

/**
* stops rendering the content of the canvas (to save resources)
*
* @method stopRendering
*/
LGraphCanvas.prototype.stopRendering = function () {
    this.is_rendering = false;
    /*
	if(this.rendering_timer_id)
	{
		clearInterval(this.rendering_timer_id);
		this.rendering_timer_id = null;
	}
	*/
}

/* LiteGraphCanvas input */

LGraphCanvas.prototype.processMouseDown = function (e) {
    if (!this.graph)
        return;

    this.adjustMouseEvent(e);

    var ref_window = this.getCanvasWindow();
    var document = ref_window.document;

    //move mouse move event to the window in case it drags outside of the canvas
    this.canvas.removeEventListener("mousemove", this._mousemove_callback);
    ref_window.document.addEventListener("mousemove", this._mousemove_callback, true); //catch for the entire window
    ref_window.document.addEventListener("mouseup", this._mouseup_callback, true);

    var n = this.graph.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes);
    var skip_dragging = false;

    //derwish added
    LiteGraph.closeAllContextualMenus();

    if (e.which == 1) //left button mouse
    {
        if (!e.shiftKey) //REFACTOR: integrate with function
        {
            //derwish edit
            //no node or another node selected
            if (!n || !this.selected_nodes[n.id]) {

                var todeselect = [];
                for (var i in this.selected_nodes)
                    if (this.selected_nodes[i] != n)
                        todeselect.push(this.selected_nodes[i]);
                //two passes to avoid problems modifying the container
                for (var i in todeselect)
                    this.processNodeDeselected(todeselect[i]);
            }
        }
        var clicking_canvas_bg = false;

        //when clicked on top of a node
        //and it is not interactive
        if (n) {
            if (!this.live_mode && !n.flags.pinned)
                this.bringToFront(n); //if it wasnt selected?
            var skip_action = false;

            //not dragging mouse to connect two slots
            if (!this.connecting_node && !n.flags.collapsed && !this.live_mode) {
                //search for outputs
                if (n.outputs)
                    for (var i = 0, l = n.outputs.length; i < l; ++i) {
                        var output = n.outputs[i];
                        var link_pos = n.getConnectionPos(false, i);
                        if (isInsideRectangle(e.canvasX, e.canvasY, link_pos[0] - 10, link_pos[1] - 5, 20, 10)) {
                            this.connecting_node = n;
                            this.connecting_output = output;
                            this.connecting_pos = n.getConnectionPos(false, i);
                            this.connecting_slot = i;

                            skip_action = true;
                            break;
                        }
                    }

                //search for inputs
                if (n.inputs)
                    for (var i = 0, l = n.inputs.length; i < l; ++i) {
                        var input = n.inputs[i];
                        var link_pos = n.getConnectionPos(true, i);
                        if (isInsideRectangle(e.canvasX, e.canvasY, link_pos[0] - 10, link_pos[1] - 5, 20, 10)) {
                            if (input.link !== null) {
                                //derwish removed
                                //n.disconnectInput(i);
                                //this.dirty_bgcanvas = true;

                                //derwish added
                                send_remove_link(graph.links[input.link]);

                                skip_action = true;
                            }
                        }
                    }

                //Search for corner
                //derwish edit 5 to 10
                if (!skip_action && isInsideRectangle(e.canvasX, e.canvasY, n.pos[0] + n.size[0] - 10, n.pos[1] + n.size[1] - 10, 10, 10)) {
                    this.resizing_node = n;
                    this.canvas.style.cursor = "se-resize";
                    skip_action = true;
                }
            }

            //Search for corner
            if (!skip_action && isInsideRectangle(e.canvasX, e.canvasY, n.pos[0], n.pos[1] - LiteGraph.NODE_TITLE_HEIGHT, LiteGraph.NODE_TITLE_HEIGHT, LiteGraph.NODE_TITLE_HEIGHT)) {
                n.collapse();
                skip_action = true;
            }

            //it wasnt clicked on the links boxes
            if (!skip_action) {
                var block_drag_node = false;

                //double clicking
                var now = LiteGraph.getTime();
                if ((now - this.last_mouseclick) < 300 && this.selected_nodes[n.id]) {
                    //double click node
                    if (n.onDblClick)
                        n.onDblClick(e);
                    this.processNodeDblClicked(n);
                    block_drag_node = true;
                }

                //if do not capture mouse

                if (n.onMouseDown && n.onMouseDown(e))
                    block_drag_node = true;
                else if (this.live_mode) {
                    clicking_canvas_bg = true;
                    block_drag_node = true;
                }

                if (!block_drag_node) {
                    if (this.allow_dragnodes)
                        this.node_dragged = n;

                    if (!this.selected_nodes[n.id])
                        this.processNodeSelected(n, e);
                }

                this.dirty_canvas = true;
            }
        }
        else
            clicking_canvas_bg = true;

        if (clicking_canvas_bg && this.allow_dragcanvas) {
            this.dragging_canvas = true;
        }
    }
    else if (e.which == 2) //middle button
    {

    }
    else if (e.which == 3) //right button
    {
        this.processContextualMenu(n, e);
    }

    //TODO
    //if(this.node_selected != prev_selected)
    //	this.onNodeSelectionChange(this.node_selected);

    this.last_mouse[0] = e.localX;
    this.last_mouse[1] = e.localY;
    this.last_mouseclick = LiteGraph.getTime();
    this.canvas_mouse = [e.canvasX, e.canvasY];

    /*
	if( (this.dirty_canvas || this.dirty_bgcanvas) && this.rendering_timer_id == null) 
		this.draw();
	*/

    this.graph.change();

    //this is to ensure to defocus(blur) if a text input element is on focus
    if (!ref_window.document.activeElement || (ref_window.document.activeElement.nodeName.toLowerCase() != "input" && ref_window.document.activeElement.nodeName.toLowerCase() != "textarea"))
        e.preventDefault();
    e.stopPropagation();
    return false;
}

LGraphCanvas.prototype.processMouseMove = function (e) {
    if (!this.graph) return;

    this.adjustMouseEvent(e);
    var mouse = [e.localX, e.localY];
    var delta = [mouse[0] - this.last_mouse[0], mouse[1] - this.last_mouse[1]];
    this.last_mouse = mouse;
    this.canvas_mouse = [e.canvasX, e.canvasY];

    if (this.dragging_canvas) {
        this.offset[0] += delta[0] / this.scale;
        this.offset[1] += delta[1] / this.scale;
        this.dirty_canvas = true;
        this.dirty_bgcanvas = true;
    }
    else {
        if (this.connecting_node)
            this.dirty_canvas = true;

        //get node over
        var n = this.graph.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes);

        //remove mouseover flag
        for (var i in this.graph._nodes) {
            if (this.graph._nodes[i].mouseOver && n != this.graph._nodes[i]) {
                //mouse leave
                this.graph._nodes[i].mouseOver = false;
                if (this.node_over && this.node_over.onMouseLeave)
                    this.node_over.onMouseLeave(e);
                this.node_over = null;
                this.dirty_canvas = true;
            }
        }

        //mouse over a node
        if (n) {
            //this.canvas.style.cursor = "move";
            if (!n.mouseOver) {
                //mouse enter
                n.mouseOver = true;
                this.node_over = n;
                this.dirty_canvas = true;

                if (n.onMouseEnter) n.onMouseEnter(e);
            }

            if (n.onMouseMove) n.onMouseMove(e);

            //ontop of input
            if (this.connecting_node) {
                var pos = this._highlight_input || [0, 0];
                var slot = this.isOverNodeInput(n, e.canvasX, e.canvasY, pos);
                if (slot != -1 && n.inputs[slot]) {

                    //prevent connection different types
                    //var slot_type = n.inputs[slot].type;
                    //if (!this.connecting_output.type || !slot_type || slot_type == this.connecting_output.type)
                    this._highlight_input = pos;
                }
                else
                    this._highlight_input = null;
            }

            //Search for corner
            //derwish edit 5 to 10
            if (isInsideRectangle(e.canvasX, e.canvasY, n.pos[0] + n.size[0] - 10, n.pos[1] + n.size[1] - 10, 10, 10))
                this.canvas.style.cursor = "se-resize";
            else
                this.canvas.style.cursor = null;
        }
        else
            this.canvas.style.cursor = null;

        if (this.node_capturing_input && this.node_capturing_input != n && this.node_capturing_input.onMouseMove) {
            this.node_capturing_input.onMouseMove(e);
        }


        if (this.node_dragged && !this.live_mode) {
            /*
			this.node_dragged.pos[0] += delta[0] / this.scale;
			this.node_dragged.pos[1] += delta[1] / this.scale;
			this.node_dragged.pos[0] = Math.round(this.node_dragged.pos[0]);
			this.node_dragged.pos[1] = Math.round(this.node_dragged.pos[1]);
			*/

            for (var i in this.selected_nodes) {
                var n = this.selected_nodes[i];

                n.pos[0] += delta[0] / this.scale;
                n.pos[1] += delta[1] / this.scale;

                //derwish added
                n.pos[0] = Math.round(n.pos[0]);
                n.pos[1] = Math.round(n.pos[1]);
            }

            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
        }

        if (this.resizing_node && !this.live_mode) {
            this.resizing_node.size[0] += delta[0] / this.scale;
            //this.resizing_node.size[1] += delta[1] / this.scale;
            var max_slots = Math.max(this.resizing_node.inputs ? this.resizing_node.inputs.length : 0, this.resizing_node.outputs ? this.resizing_node.outputs.length : 0);
            //	if(this.resizing_node.size[1] < max_slots * LiteGraph.NODE_SLOT_HEIGHT + 4)
            //		this.resizing_node.size[1] = max_slots * LiteGraph.NODE_SLOT_HEIGHT + 4;
            if (this.resizing_node.size[0] < LiteGraph.NODE_MIN_WIDTH)
                this.resizing_node.size[0] = LiteGraph.NODE_MIN_WIDTH;

            this.canvas.style.cursor = "se-resize";
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
        }
    }

    /*
	if((this.dirty_canvas || this.dirty_bgcanvas) && this.rendering_timer_id == null) 
		this.draw();
	*/

    e.preventDefault();
    //e.stopPropagation();
    return false;
    //this is not really optimal
    //this.graph.change();
}

LGraphCanvas.prototype.processMouseUp = function (e) {
    if (!this.graph)
        return;

    var window = this.getCanvasWindow();
    var document = window.document;

    //restore the mousemove event back to the canvas
    document.removeEventListener("mousemove", this._mousemove_callback, true);
    this.canvas.addEventListener("mousemove", this._mousemove_callback, true);
    document.removeEventListener("mouseup", this._mouseup_callback, true);

    this.adjustMouseEvent(e);

    if (e.which == 1) //left button
    {
        //dragging a connection
        if (this.connecting_node) {
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;

            var node = this.graph.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes);

            //node below mouse
            if (node) {

                if (this.connecting_output.type == 'node') {
                    this.connecting_node.connect(this.connecting_slot, node, -1);
                }
                else {
                    //slot below mouse? connect
                    var slot = this.isOverNodeInput(node, e.canvasX, e.canvasY);
                    if (slot != -1) {
                        //derwish added
                        var link = { origin_id: this.connecting_node.id, origin_slot: this.connecting_slot, target_id: node.id, target_slot: slot };
                        send_create_link(link);

                        //derwish removed
                        //this.connecting_node.connect(this.connecting_slot, node, slot);
                    }
                    else { //not on top of an input
                        var input = node.getInputInfo(0);
                        //simple connect

                        //prevent connection of different types
                        // if (input && !input.link && input.type == this.connecting_output.type) { //toLowerCase missing

                        //derwish added
                        if (input != null) {
                            var link = { origin_id: this.connecting_node.id, origin_slot: this.connecting_slot, target_id: node.id, target_slot: 0 };
                            send_create_link(link);
                        }
                        //derwish removed
                        //this.connecting_node.connect(this.connecting_slot, node, 0);
                        // }
                    }


                }
            }

            this.connecting_output = null;
            this.connecting_pos = null;
            this.connecting_node = null;
            this.connecting_slot = -1;
            this._highlight_input = null;

        }//not dragging connection
        else if (this.resizing_node) {
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;

            //derwish added
            send_update_node(this.resizing_node);

            this.resizing_node = null;
        }
        else if (this.node_dragged) //node being dragged?
        {
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
            this.node_dragged.pos[0] = Math.round(this.node_dragged.pos[0]);
            this.node_dragged.pos[1] = Math.round(this.node_dragged.pos[1]);
            if (this.graph.config.align_to_grid)
                this.node_dragged.alignToGrid();


            //derwish added
            for (var i in this.selected_nodes) {
                //derwish added
                this.selected_nodes[i].size[0] = Math.round(this.selected_nodes[i].size[0]);
                this.selected_nodes[i].size[1] = Math.round(this.selected_nodes[i].size[1]);
                send_update_node(this.selected_nodes[i]);
            }

            this.node_dragged = null;
        }
        else //no node being dragged
        {
            this.dirty_canvas = true;
            this.dragging_canvas = false;

            if (this.node_over && this.node_over.onMouseUp)
                this.node_over.onMouseUp(e);
            if (this.node_capturing_input && this.node_capturing_input.onMouseUp)
                this.node_capturing_input.onMouseUp(e);
        }
    }
    else if (e.which == 2) //middle button
    {
        //trace("middle");
        this.dirty_canvas = true;
        this.dragging_canvas = false;
    }
    else if (e.which == 3) //right button
    {
        //trace("right");
        this.dirty_canvas = true;
        this.dragging_canvas = false;
    }

    /*
	if((this.dirty_canvas || this.dirty_bgcanvas) && this.rendering_timer_id == null)
		this.draw();
	*/

    this.graph.change();

    e.stopPropagation();
    e.preventDefault();
    return false;
}


LGraphCanvas.prototype.processMouseWheel = function (e) {
    if (!this.graph || !this.allow_dragcanvas)
        return;


    var delta = (e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * -60);

    this.adjustMouseEvent(e);

    var zoom = this.scale;

    if (delta > 0)
        zoom *= 1.1;
    else if (delta < 0)
        zoom *= 1 / (1.1);

    this.setZoom(zoom, [e.localX, e.localY]);



    /*
	if(this.rendering_timer_id == null)
		this.draw();
	*/

    this.graph.change();

    e.preventDefault();
    return false; // prevent default
}

LGraphCanvas.prototype.isOverNodeInput = function (node, canvasx, canvasy, slot_pos) {
    if (node.inputs)
        for (var i = 0, l = node.inputs.length; i < l; ++i) {
            var input = node.inputs[i];
            var link_pos = node.getConnectionPos(true, i);
            if (isInsideRectangle(canvasx, canvasy, link_pos[0] - 10, link_pos[1] - 5, 20, 10)) {
                if (slot_pos) { slot_pos[0] = link_pos[0]; slot_pos[1] = link_pos[1] };
                return i;
            }
        }
    return -1;
}

LGraphCanvas.prototype.processKey = function (e) {
    if (!this.graph)
        return;

    var block_default = false;

    if (e.type == "keydown") {
        //select all Control A
        if (e.keyCode == 65 && e.ctrlKey) {
            this.selectAllNodes();
            block_default = true;
        }

        //delete or backspace
        if (e.keyCode == 46 || e.keyCode == 8) {
            this.deleteSelectedNodes();
            block_default = true;
        }

        //collapse
        //...

        //TODO
        if (this.selected_nodes)
            for (var i in this.selected_nodes)
                if (this.selected_nodes[i].onKeyDown)
                    this.selected_nodes[i].onKeyDown(e);
    }
    else if (e.type == "keyup") {
        if (this.selected_nodes)
            for (var i in this.selected_nodes)
                if (this.selected_nodes[i].onKeyUp)
                    this.selected_nodes[i].onKeyUp(e);
    }

    this.graph.change();

    if (block_default) {
        e.preventDefault();
        return false;
    }
}

LGraphCanvas.prototype.processDrop = function (e) {
    e.preventDefault();
    this.adjustMouseEvent(e);


    var pos = [e.canvasX, e.canvasY];
    var node = this.graph.getNodeOnPos(pos[0], pos[1]);

    if (!node) {
        if (this.onDropItem)
            this.onDropItem(event);
        return;
    }

    if (node.onDropFile) {
        var files = e.dataTransfer.files;
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = e.dataTransfer.files[0];
                var filename = file.name;
                var ext = LGraphCanvas.getFileExtension(filename);
                //console.log(file);

                //prepare reader
                var reader = new FileReader();
                reader.onload = function (event) {
                    //console.log(event.target);
                    var data = event.target.result;
                    node.onDropFile(data, filename, file);
                };

                //read data
                var type = file.type.split("/")[0];
                if (type == "text" || type == "")
                    reader.readAsText(file);
                else if (type == "image")
                    reader.readAsDataURL(file);
                else
                    reader.readAsArrayBuffer(file);
            }
        }
    }

    if (node.onDropItem) {
        if (node.onDropItem(event))
            return true;
    }

    if (this.onDropItem)
        return this.onDropItem(event);

    return false;
}

LGraphCanvas.prototype.processNodeSelected = function (n, e) {
    n.selected = true;
    if (n.onSelected)
        n.onSelected();

    if (e && e.shiftKey) //add to selection
        this.selected_nodes[n.id] = n;
    else {
        this.selected_nodes = {};
        this.selected_nodes[n.id] = n;
    }

    this.dirty_canvas = true;

    if (this.onNodeSelected)
        this.onNodeSelected(n);

    //if(this.node_in_panel) this.showNodePanel(n);
}

LGraphCanvas.prototype.processNodeDeselected = function (n) {
    n.selected = false;
    if (n.onDeselected)
        n.onDeselected();

    delete this.selected_nodes[n.id];

    if (this.onNodeDeselected)
        this.onNodeDeselected();

    this.dirty_canvas = true;

    //this.showNodePanel(null);
}

LGraphCanvas.prototype.processNodeDblClicked = function (n) {
    if (this.onShowNodePanel)
        this.onShowNodePanel(n);

    if (this.onNodeDblClicked)
        this.onNodeDblClicked(n);

    this.setDirty(true);
}

LGraphCanvas.prototype.selectNode = function (node) {
    this.deselectAllNodes();

    if (!node)
        return;

    if (!node.selected && node.onSelected)
        node.onSelected();
    node.selected = true;
    this.selected_nodes[node.id] = node;
    this.setDirty(true);
}

LGraphCanvas.prototype.selectAllNodes = function () {
    for (var i in this.graph._nodes) {
        var n = this.graph._nodes[i];
        if (!n.selected && n.onSelected)
            n.onSelected();
        n.selected = true;
        this.selected_nodes[this.graph._nodes[i].id] = n;
    }

    this.setDirty(true);
}

LGraphCanvas.prototype.deselectAllNodes = function () {
    for (var i in this.selected_nodes) {
        var n = this.selected_nodes;
        if (n.onDeselected)
            n.onDeselected();
        n.selected = false;
    }
    this.selected_nodes = {};
    this.setDirty(true);
}

LGraphCanvas.prototype.deleteSelectedNodes = function () {
    for (var i in this.selected_nodes) {
        var m = this.selected_nodes[i];
        //if(m == this.node_in_panel) this.showNodePanel(null);
        this.graph.remove(m);
    }
    this.selected_nodes = {};
    this.setDirty(true);
}

LGraphCanvas.prototype.centerOnNode = function (node) {
    this.offset[0] = -node.pos[0] - node.size[0] * 0.5 + (this.canvas.width * 0.5 / this.scale);
    this.offset[1] = -node.pos[1] - node.size[1] * 0.5 + (this.canvas.height * 0.5 / this.scale);
    this.setDirty(true, true);
}

LGraphCanvas.prototype.adjustMouseEvent = function (e) {
    var b = this.canvas.getBoundingClientRect();
    e.localX = e.pageX - b.left;
    e.localY = e.pageY - b.top;

    e.canvasX = e.localX / this.scale - this.offset[0];
    e.canvasY = e.localY / this.scale - this.offset[1];
}

LGraphCanvas.prototype.setZoom = function (value, zooming_center) {
    if (!zooming_center)
        zooming_center = [this.canvas.width * 0.5, this.canvas.height * 0.5];

    var center = this.convertOffsetToCanvas(zooming_center);

    this.scale = value;

    if (this.scale > this.max_zoom)
        this.scale = this.max_zoom;
    else if (this.scale < this.min_zoom)
        this.scale = this.min_zoom;

    var new_center = this.convertOffsetToCanvas(zooming_center);
    var delta_offset = [new_center[0] - center[0], new_center[1] - center[1]];

    this.offset[0] += delta_offset[0];
    this.offset[1] += delta_offset[1];

    this.dirty_canvas = true;
    this.dirty_bgcanvas = true;
}

LGraphCanvas.prototype.convertOffsetToCanvas = function (pos) {
    return [pos[0] / this.scale - this.offset[0], pos[1] / this.scale - this.offset[1]];
}

LGraphCanvas.prototype.convertCanvasToOffset = function (pos) {
    return [(pos[0] + this.offset[0]) * this.scale,
		(pos[1] + this.offset[1]) * this.scale];
}

LGraphCanvas.prototype.convertEventToCanvas = function (e) {
    var rect = this.canvas.getClientRects()[0];
    return this.convertOffsetToCanvas([e.pageX - rect.left, e.pageY - rect.top]);
}

LGraphCanvas.prototype.bringToFront = function (n) {
    var i = this.graph._nodes.indexOf(n);
    if (i == -1) return;

    this.graph._nodes.splice(i, 1);
    this.graph._nodes.push(n);
}

LGraphCanvas.prototype.sendToBack = function (n) {
    var i = this.graph._nodes.indexOf(n);
    if (i == -1) return;

    this.graph._nodes.splice(i, 1);
    this.graph._nodes.unshift(n);
}

/* Interaction */



/* LGraphCanvas render */

LGraphCanvas.prototype.computeVisibleNodes = function () {
    var visible_nodes = [];
    for (var i in this.graph._nodes) {
        var n = this.graph._nodes[i];

        //skip rendering nodes in live mode
        if (this.live_mode && !n.onDrawBackground && !n.onDrawForeground)
            continue;

        if (!overlapBounding(this.visible_area, n.getBounding()))
            continue; //out of the visible area

        visible_nodes.push(n);
    }
    return visible_nodes;
}

LGraphCanvas.prototype.draw = function (force_canvas, force_bgcanvas) {
    //fps counting
    var now = LiteGraph.getTime();
    this.render_time = (now - this.last__time) * 0.001;
    this.last_draw_time = now;

    if (this.graph) {
        var start = [-this.offset[0], -this.offset[1]];
        var end = [start[0] + this.canvas.width / this.scale, start[1] + this.canvas.height / this.scale];
        this.visible_area = new Float32Array([start[0], start[1], end[0], end[1]]);
    }

    if (this.dirty_bgcanvas || force_bgcanvas)
        this.drawBackCanvas();

    if (this.dirty_canvas || force_canvas)
        this.drawFrontCanvas();

    this.fps = this.render_time ? (1.0 / this.render_time) : 0;
    this.frame += 1;
}

LGraphCanvas.prototype.drawFrontCanvas = function () {
    if (!this.ctx)
        this.ctx = this.bgcanvas.getContext("2d");
    var ctx = this.ctx;
    if (!ctx) //maybe is using webgl...
        return;

    if (ctx.start2D)
        ctx.start2D();

    var canvas = this.canvas;

    //reset in case of error
    ctx.restore();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    //clip dirty area if there is one, otherwise work in full canvas
    if (this.dirty_area) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.dirty_area[0], this.dirty_area[1], this.dirty_area[2], this.dirty_area[3]);
        ctx.clip();
    }

    //clear
    //canvas.width = canvas.width;
    if (this.clear_background)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw bg canvas
    if (this.bgcanvas == this.canvas)
        this.drawBackCanvas();
    else
        ctx.drawImage(this.bgcanvas, 0, 0);

    //rendering
    if (this.onRender)
        this.onRender(canvas, ctx);

    //info widget
    if (this.show_info)
        this.renderInfo(ctx);

    if (this.graph) {
        //apply transformations
        ctx.save();
        ctx.scale(this.scale, this.scale);
        ctx.translate(this.offset[0], this.offset[1]);

        //draw nodes
        var drawn_nodes = 0;
        var visible_nodes = this.computeVisibleNodes();
        this.visible_nodes = visible_nodes;

        for (var i in visible_nodes) {
            var node = visible_nodes[i];

            //transform coords system
            ctx.save();
            ctx.translate(node.pos[0], node.pos[1]);

            //Draw
            this.drawNode(node, ctx);
            drawn_nodes += 1;

            //Restore
            ctx.restore();
        }

        //connections ontop?
        if (this.graph.config.links_ontop)
            if (!this.live_mode)
                this.drawConnections(ctx);

        //current connection
        if (this.connecting_pos != null) {
            ctx.lineWidth = this.connections_width;
            var link_color = LiteGraph.NEW_LINK_COLOR;
            //this.connecting_output.type == 'node' ? "#F85" : "#AFA";
            this.renderLink(ctx, this.connecting_pos, [this.canvas_mouse[0], this.canvas_mouse[1]], link_color);

            ctx.beginPath();
            ctx.arc(this.connecting_pos[0], this.connecting_pos[1], 4, 0, Math.PI * 2);
            /*
			if( this.connecting_output.round)
				ctx.arc( this.connecting_pos[0], this.connecting_pos[1],4,0,Math.PI*2);
			else
				ctx.rect( this.connecting_pos[0], this.connecting_pos[1],12,6);
			*/
            ctx.fill();

            ctx.fillStyle = "#ffcc00";
            if (this._highlight_input) {
                ctx.beginPath();
                ctx.arc(this._highlight_input[0], this._highlight_input[1], 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    }

    if (this.dirty_area) {
        ctx.restore();
        //this.dirty_area = null;
    }

    if (ctx.finish2D) //this is a function I use in webgl renderer
        ctx.finish2D();

    this.dirty_canvas = false;
}

LGraphCanvas.prototype.renderInfo = function (ctx, x, y) {
    x = x || 0;
    y = y || 0;

    ctx.save();
    ctx.translate(x, y);

    ctx.font = "10px Arial";
    ctx.fillStyle = "#888";
    if (this.graph) {
        ctx.fillText("T: " + this.graph.globaltime.toFixed(2) + "s", 5, 13 * 1);
        ctx.fillText("I: " + this.graph.iteration, 5, 13 * 2);
        ctx.fillText("F: " + this.frame, 5, 13 * 3);
        ctx.fillText("FPS:" + this.fps.toFixed(2), 5, 13 * 4);
    }
    else
        ctx.fillText("No graph selected", 5, 13 * 1);
    ctx.restore();
}

LGraphCanvas.prototype.drawBackCanvas = function () {
    var canvas = this.bgcanvas;
    if (!this.bgctx)
        this.bgctx = this.bgcanvas.getContext("2d");
    var ctx = this.bgctx;
    if (ctx.start)
        ctx.start();

    //clear
    if (this.clear_background)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    //reset in case of error
    ctx.restore();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (this.graph) {
        //apply transformations
        ctx.save();
        ctx.scale(this.scale, this.scale);
        ctx.translate(this.offset[0], this.offset[1]);


        //render BG
        if (LiteGraph.BG_IMAGE && this.scale > 0.5) {
            ctx.globalAlpha = (1.0 - 0.5 / this.scale) * this.editor_alpha;
            ctx.imageSmoothingEnabled = ctx.mozImageSmoothingEnabled = false;
            if (!this._bg_img || this._bg_img.name != LiteGraph.BG_IMAGE) {
                this._bg_img = new Image();
                this._bg_img.name = LiteGraph.BG_IMAGE;
                this._bg_img.src = LiteGraph.BG_IMAGE;
                var that = this;
                this._bg_img.onload = function () {
                    that.draw(true, true);
                }
            }

            var pattern = null;
            if (this._pattern == null && this._bg_img.width > 0) {
                pattern = ctx.createPattern(this._bg_img, 'repeat');
                this._pattern_img = this._bg_img;
                this._pattern = pattern;
            }
            else
                pattern = this._pattern;
            if (pattern) {
                ctx.fillStyle = pattern;
                ctx.fillRect(this.visible_area[0], this.visible_area[1], this.visible_area[2] - this.visible_area[0], this.visible_area[3] - this.visible_area[1]);
                ctx.fillStyle = "transparent";
            }

            ctx.globalAlpha = 1.0;
            ctx.imageSmoothingEnabled = ctx.mozImageSmoothingEnabled = true;
        }

        if (this.onBackgroundRender)
            this.onBackgroundRender(canvas, ctx);

        //DEBUG: show clipping area
        //ctx.fillStyle = "red";
        //ctx.fillRect( this.visible_area[0] + 10, this.visible_area[1] + 10, this.visible_area[2] - this.visible_area[0] - 20, this.visible_area[3] - this.visible_area[1] - 20);

        //bg
     //   ctx.strokeStyle = "#235";
     //   ctx.strokeRect(0, 0, canvas.width, canvas.height);

        if (this.render_connections_shadows) {
            ctx.shadowColor = "#000";
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 6;
        }
        else
            ctx.shadowColor = "rgba(0,0,0,0)";

        //draw connections
        if (!this.live_mode)
            this.drawConnections(ctx);

        ctx.shadowColor = "rgba(0,0,0,0)";

        //restore state
        ctx.restore();
    }

    if (ctx.finish)
        ctx.finish();

    this.dirty_bgcanvas = false;
    this.dirty_canvas = true; //to force to repaint the front canvas with the bgcanvas 
}

/* Renders the LGraphNode on the canvas */
LGraphCanvas.prototype.drawNode = function (node, ctx) {
    var glow = false;

    var color = node.color || LiteGraph.NODE_DEFAULT_COLOR;

    if (node.type == "Main/Panel")
        color = LiteGraph.PANEL_NODE_COLOR;
    else if (node.type == "Main/Panel Input" || node.type == "Main/Panel Output")
        color = LiteGraph.IO_NODE_COLOR;

    //if (this.selected) color = "#88F";

    var render_title = true;
    if (node.flags.skip_title_render || node.graph.isLive())
        render_title = false;
    if (node.mouseOver)
        render_title = true;

    //shadow and glow
    if (node.mouseOver) glow = true;

    if (node.selected) {
        ctx.shadowColor = LiteGraph.SELECTION_COLOR;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = LiteGraph.SELECTION_WIDTH;

    }
    else if (this.render_shadows) {
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowOffsetX = this.shadows_width;
        ctx.shadowOffsetY = this.shadows_width;
        ctx.shadowBlur = 3;
    }
    else
        ctx.shadowColor = "transparent";

    //only render if it forces it to do it
    if (this.live_mode) {
        if (!node.flags.collapsed) {
            ctx.shadowColor = "transparent";
            //if(node.onDrawBackground)
            //	node.onDrawBackground(ctx);
            if (node.onDrawForeground)
                node.onDrawForeground(ctx);
        }

        return;
    }

    //draw in collapsed form
    /*
	if(node.flags.collapsed)
	{
		if(!node.onDrawCollapsed || uiNode.onDrawCollapsed(ctx) == false)
			this.drawNodeCollapsed(node, ctx, color, uiNode.bgcolor);
		return;
	}
	*/

    var editor_alpha = this.editor_alpha;
    ctx.globalAlpha = editor_alpha;

    //clip if required (mask)
    var shape = node.shape || LiteGraph.NODE_DEFAULT_SHAPE;
    var size = new Float32Array(node.size);
    if (node.flags.collapsed) {
        size[0] = LiteGraph.NODE_COLLAPSED_WIDTH;
        size[1] = 0;
    }

    //Start clipping
    if (node.flags.clip_area) {
        ctx.save();
        if (shape == "box") {
            ctx.beginPath();
            ctx.rect(0, 0, size[0], size[1]);
        }
        else if (shape == "round") {
            ctx.roundRect(0, 0, size[0], size[1], 10);
        }
        else if (shape == "circle") {
            ctx.roundRect(0, 0, size[0], size[1], 10);
        }
        ctx.clip();
    }

    //draw shape
    this.drawNodeShape(node, ctx, size, color, node.bgcolor, !render_title, node.selected);
    ctx.shadowColor = "transparent";

    //connection slots
    ctx.textAlign = "left";
    ctx.font = this.inner_text_font;

    var render_text = this.scale > 0.6;

    //render inputs and outputs
    if (!node.flags.collapsed) {
        //input connection slots
        if (node.inputs)
            for (var i = 0; i < node.inputs.length; i++) {
                var slot = node.inputs[i];

                ctx.globalAlpha = editor_alpha;

                //prevent connection of different types
                //hide not compatible inputs 
                //if (this.connecting_node != null && this.connecting_output.type && node.inputs[i].type && this.connecting_output.type != node.inputs[i].type)
                //    ctx.globalAlpha = 0.4 * editor_alpha;

                //hide self inputs
                if (this.connecting_node == node)
                    ctx.globalAlpha = 0.4 * editor_alpha;

                ctx.fillStyle = slot.link != null ? "#7F7" : LiteGraph.DataTypeColor[slot.type];

                var pos = node.getConnectionPos(true, i);
                pos[0] -= node.pos[0];
                pos[1] -= node.pos[1];

                ctx.beginPath();

                if (1 || slot.round)
                    ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
                //else
                //	ctx.rect((pos[0] - 6) + 0.5, (pos[1] - 5) + 0.5,14,10);

                ctx.fill();

                //render name
                if (render_text) {
                    var text = slot.label != null ? slot.label : slot.name;
                    if (text) {
                        ctx.fillStyle = slot.isOptional ? LiteGraph.NODE_OPTIONAL_IO_COLOR : LiteGraph.NODE_DEFAULT_IO_COLOR;
                        ctx.fillText(text, pos[0] + 10, pos[1] + 5);
                    }
                }
            }

        //output connection slots
        if (this.connecting_node)
            ctx.globalAlpha = 0.4 * editor_alpha;

        ctx.lineWidth = 1;

        ctx.textAlign = "right";
        ctx.strokeStyle = "black";
        if (node.outputs)
            for (var i = 0; i < node.outputs.length; i++) {
                var slot = node.outputs[i];

                var pos = node.getConnectionPos(false, i);
                pos[0] -= node.pos[0];
                pos[1] -= node.pos[1];

                ctx.fillStyle = slot.links && slot.links.length ? "#7F7" : LiteGraph.DataTypeColor[slot.type];
                ctx.beginPath();
                //ctx.rect( node.size[0] - 14,i*14,10,10);

                if (1 || slot.round)
                    ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
                //else
                //	ctx.rect((pos[0] - 6) + 0.5,(pos[1] - 5) + 0.5,14,10);

                //trigger
                //if(slot.node_id != null && slot.slot == -1)
                //	ctx.fillStyle = "#F85";

                //if(slot.links != null && slot.links.length)
                ctx.fill();
                ctx.stroke();

                //render output name
                if (render_text) {
                    var text = slot.label != null ? slot.label : slot.name;
                    if (text) {
                        ctx.fillStyle = LiteGraph.NODE_DEFAULT_IO_COLOR;
                        ctx.fillText(text, pos[0] - 10, pos[1] + 5);
                    }
                }
            }

        ctx.textAlign = "left";
        ctx.globalAlpha = 1;

        if (node.onDrawForeground)
            node.onDrawForeground(ctx);
    }//!collapsed

    if (node.flags.clip_area)
        ctx.restore();

    ctx.globalAlpha = 1.0;
}

/* Renders the node shape */
LGraphCanvas.prototype.drawNodeShape = function (node, ctx, size, fgcolor, bgcolor, no_title, selected) {
    //bg rect
    ctx.strokeStyle = fgcolor || LiteGraph.NODE_DEFAULT_COLOR;
    ctx.fillStyle = bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR;

    if (node.type == "Main/Panel") {
        ctx.strokeStyle = fgcolor || LiteGraph.PANEL_NODE_COLOR;
        ctx.fillStyle = bgcolor || LiteGraph.PANEL_NODE_BGCOLOR;
        color = LiteGraph.PANEL_NODE_COLOR;
    } else if (node.type == "Main/Panel Input" || node.type == "Main/Panel Output") {
        ctx.strokeStyle = fgcolor || LiteGraph.IO_NODE_COLOR;
        ctx.fillStyle = bgcolor || LiteGraph.IO_NODE_BGCOLOR;
    }

    /* gradient test
    var grad = ctx.createLinearGradient(0,0,0,node.size[1]);
    grad.addColorStop(0, "#AAA");
    grad.addColorStop(0.5, fgcolor || LiteGraph.NODE_DEFAULT_COLOR);
    grad.addColorStop(1, bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR);
    ctx.fillStyle = grad;
    //*/

    var title_height = LiteGraph.NODE_TITLE_HEIGHT;

    //render depending on shape
    var shape = node.shape || LiteGraph.NODE_DEFAULT_SHAPE;
    if (shape == "box") {
        ctx.beginPath();
        ctx.rect(0, no_title ? 0 : -title_height, size[0] + 1, no_title ? size[1] : size[1] + title_height);
        ctx.fill();
        //ctx.shadowColor = "transparent";

        //if (selected) {
        //    ctx.strokeStyle = "#CCC";
        //    ctx.strokeRect(-0.5, no_title ? -0.5 : -title_height + -0.5, size[0] + 2, no_title ? (size[1] + 2) : (size[1] + title_height + 2) - 1);
        //    ctx.strokeStyle = fgcolor;
        //}
    }
    else if (shape == "round") {
        ctx.roundRect(0, no_title ? 0 : -title_height, size[0], no_title ? size[1] : size[1] + title_height, 4);
        ctx.fill();
    }
    else if (shape == "circle") {
        ctx.roundRect(0, no_title ? 0 : -title_height, size[0], no_title ? size[1] : size[1] + title_height, 8);
        ctx.fill();
    }

    ctx.shadowColor = "transparent";

    //ctx.stroke();

    //image
    if (node.bgImage && node.bgImage.width)
        ctx.drawImage(node.bgImage, (size[0] - node.bgImage.width) * 0.5, (size[1] - node.bgImage.height) * 0.5);

    if (node.bgImageUrl && !node.bgImage)
        node.bgImage = node.loadImage(node.bgImageUrl);

    if (node.onDrawBackground)
        node.onDrawBackground(ctx);

    //title bg
    if (!no_title) {
        ctx.fillStyle = fgcolor || LiteGraph.NODE_DEFAULT_COLOR;
        var old_alpha = ctx.globalAlpha;
        //ctx.globalAlpha = 0.5 * old_alpha;
        if (shape == "box") {
            ctx.beginPath();
            ctx.rect(0, -title_height, size[0] + 1, title_height);
            ctx.fill()
            //ctx.stroke();
        }
        else if (shape == "round") {
            ctx.roundRect(0, -title_height, size[0], title_height, 4, 0);
            //ctx.fillRect(0,8,size[0],NODE_TITLE_HEIGHT - 12);
            ctx.fill();
            //ctx.stroke();
        }
        else if (shape == "circle") {
            ctx.roundRect(0, -title_height, size[0], title_height, 8, 0);
            //ctx.fillRect(0,8,size[0],NODE_TITLE_HEIGHT - 12);
            ctx.fill();
            //ctx.stroke();
        }

        //box
        ctx.fillStyle = node.boxcolor || LiteGraph.NODE_DEFAULT_BOXCOLOR || fgcolor;
        ctx.beginPath();
        if (shape == "round" || shape == "circle")
            ctx.arc(title_height * 0.5, title_height * -0.5, (title_height - 6) * 0.5, 0, Math.PI * 2);
        else
            ctx.rect(3, -title_height + 3, title_height - 6, title_height - 6);
        ctx.fill();
        ctx.globalAlpha = old_alpha;

        //title text
        ctx.font = this.title_text_font;
        var title = node.getTitle();
        if (title && this.scale > 0.5) {
            ctx.fillStyle = LiteGraph.NODE_TITLE_COLOR;
            ctx.fillText(title, 16, 13 - title_height);
        }
    }
}

/* Renders the node when collapsed */
LGraphCanvas.prototype.drawNodeCollapsed = function (node, ctx, fgcolor, bgcolor) {
    //draw default collapsed shape
    ctx.strokeStyle = fgcolor || LiteGraph.NODE_DEFAULT_COLOR;
    ctx.fillStyle = bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR;

    var collapsed_radius = LiteGraph.NODE_COLLAPSED_RADIUS;

    //circle shape
    var shape = node.shape || LiteGraph.NODE_DEFAULT_SHAPE;
    if (shape == "circle") {
        ctx.beginPath();
        ctx.roundRect(node.size[0] * 0.5 - collapsed_radius, node.size[1] * 0.5 - collapsed_radius, 2 * collapsed_radius, 2 * collapsed_radius, 5);
        ctx.fill();
        ctx.shadowColor = "rgba(0,0,0,0)";
        ctx.stroke();

        ctx.fillStyle = node.boxcolor || LiteGraph.NODE_DEFAULT_BOXCOLOR || fgcolor;
        ctx.beginPath();
        ctx.roundRect(node.size[0] * 0.5 - collapsed_radius * 0.5, node.size[1] * 0.5 - collapsed_radius * 0.5, collapsed_radius, collapsed_radius, 2);
        ctx.fill();
    }
    else if (shape == "round") //rounded box
    {
        ctx.beginPath();
        ctx.roundRect(node.size[0] * 0.5 - collapsed_radius, node.size[1] * 0.5 - collapsed_radius, 2 * collapsed_radius, 2 * collapsed_radius, 5);
        ctx.fill();
        ctx.shadowColor = "rgba(0,0,0,0)";
        ctx.stroke();

        ctx.fillStyle = node.boxcolor || LiteGraph.NODE_DEFAULT_BOXCOLOR || fgcolor;
        ctx.beginPath();
        ctx.roundRect(node.size[0] * 0.5 - collapsed_radius * 0.5, node.size[1] * 0.5 - collapsed_radius * 0.5, collapsed_radius, collapsed_radius, 2);
        ctx.fill();
    }
    else //flat box
    {
        ctx.beginPath();
        //ctx.rect(node.size[0] * 0.5 - collapsed_radius, uiNode.size[1] * 0.5 - collapsed_radius, 2*collapsed_radius, 2*collapsed_radius);
        ctx.rect(0, 0, node.size[0], collapsed_radius * 2);
        ctx.fill();
        ctx.shadowColor = "rgba(0,0,0,0)";
        ctx.stroke();

        ctx.fillStyle = node.boxcolor || LiteGraph.NODE_DEFAULT_BOXCOLOR || fgcolor;
        ctx.beginPath();
        //ctx.rect(node.size[0] * 0.5 - collapsed_radius*0.5, uiNode.size[1] * 0.5 - collapsed_radius*0.5, collapsed_radius,collapsed_radius);
        ctx.rect(collapsed_radius * 0.5, collapsed_radius * 0.5, collapsed_radius, collapsed_radius);
        ctx.fill();
    }
}

LGraphCanvas.link_colors = ["#AAC", "#ACA", "#CAA"];

LGraphCanvas.prototype.drawConnections = function (ctx) {
    //draw connections
    ctx.lineWidth = this.connections_width;

    ctx.fillStyle = "#AAA";
    ctx.strokeStyle = "#AAA";
    ctx.globalAlpha = this.editor_alpha;
    //for every node
    for (var n in this.graph._nodes) {
        var node = this.graph._nodes[n];
        //for every input (we render just inputs because it is easier as every slot can only have one input)
        if (node.inputs && node.inputs.length)
            for (var i in node.inputs) {
                var input = node.inputs[i];
                if (!input || input.link == null)
                    continue;
                var link_id = input.link;
                var link = this.graph.links[link_id];
                if (!link) continue;

                var start_node = this.graph.getNodeById(link.origin_id);
                if (start_node == null) continue;
                var start_node_slot = link.origin_slot;
                var start_node_slotpos = null;

                if (start_node_slot == -1)
                    start_node_slotpos = [start_node.pos[0] + 10, start_node.pos[1] + 10];
                else
                    start_node_slotpos = start_node.getConnectionPos(false, start_node_slot);

                var color = LGraphCanvas.link_type_colors[node.inputs[i].type];
                if (color == null)
                    color = LGraphCanvas.link_colors[node.id % LGraphCanvas.link_colors.length];
                this.renderLink(ctx, start_node_slotpos, node.getConnectionPos(true, i), color);
            }
    }
    ctx.globalAlpha = 1;
}

LGraphCanvas.prototype.renderLink = function (ctx, a, b, color) {
    if (!this.highquality_render) {
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
        return;
    }

    var dist = distance(a, b);

    if (this.render_connections_border && this.scale > 0.6)
        ctx.lineWidth = this.connections_width + this.connections_shadow;

    ctx.beginPath();

    if (this.render_curved_connections) //splines
    {
        ctx.moveTo(a[0], a[1]);
        ctx.bezierCurveTo(a[0] + dist * 0.25, a[1],
							b[0] - dist * 0.25, b[1],
							b[0], b[1]);
    }
    else //lines
    {
        ctx.moveTo(a[0] + 10, a[1]);
        ctx.lineTo(((a[0] + 10) + (b[0] - 10)) * 0.5, a[1]);
        ctx.lineTo(((a[0] + 10) + (b[0] - 10)) * 0.5, b[1]);
        ctx.lineTo(b[0] - 10, b[1]);
    }

    if (this.render_connections_border && this.scale > 0.6) {
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.stroke();
    }

    ctx.lineWidth = this.connections_width;
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.stroke();

    //render arrow
    if (this.render_connection_arrows && this.scale > 0.6) {
        //get two points in the bezier curve
        var pos = this.computeConnectionPoint(a, b, 0.5);
        var pos2 = this.computeConnectionPoint(a, b, 0.51);
        var angle = 0;
        if (this.render_curved_connections)
            angle = -Math.atan2(pos2[0] - pos[0], pos2[1] - pos[1]);
        else
            angle = b[1] > a[1] ? 0 : Math.PI;

        ctx.save();
        ctx.translate(pos[0], pos[1]);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(-5, -5);
        ctx.lineTo(0, +5);
        ctx.lineTo(+5, -5);
        ctx.fill();
        ctx.restore();
    }
}

LGraphCanvas.prototype.computeConnectionPoint = function (a, b, t) {
    var dist = distance(a, b);
    var p0 = a;
    var p1 = [a[0] + dist * 0.25, a[1]];
    var p2 = [b[0] - dist * 0.25, b[1]];
    var p3 = b;

    var c1 = (1 - t) * (1 - t) * (1 - t);
    var c2 = 3 * ((1 - t) * (1 - t)) * t;
    var c3 = 3 * (1 - t) * (t * t);
    var c4 = t * t * t;

    var x = c1 * p0[0] + c2 * p1[0] + c3 * p2[0] + c4 * p3[0];
    var y = c1 * p0[1] + c2 * p1[1] + c3 * p2[1] + c4 * p3[1];
    return [x, y];
}

/*
LGraphCanvas.prototype.resizeCanvas = function(width,height)
{
	this.canvas.width = width;
	if(height)
		this.canvas.height = height;

	this.bgcanvas.width = this.canvas.width;
	this.bgcanvas.height = this.canvas.height;
	this.draw(true,true);
}
*/

LGraphCanvas.prototype.resize = function (width, height) {
    if (!width && !height) {
        var parent = this.canvas.parentNode;
        width = parent.offsetWidth;
        height = parent.offsetHeight;
    }

    if (this.canvas.width == width && this.canvas.height == height)
        return;

    this.canvas.width = width;
    this.canvas.height = height;
    this.bgcanvas.width = this.canvas.width;
    this.bgcanvas.height = this.canvas.height;
    this.setDirty(true, true);
}


LGraphCanvas.prototype.switchLiveMode = function (transition) {
    if (!transition) {
        this.live_mode = !this.live_mode;
        this.dirty_canvas = true;
        this.dirty_bgcanvas = true;
        return;
    }

    var self = this;
    var delta = this.live_mode ? 1.1 : 0.9;
    if (this.live_mode) {
        this.live_mode = false;
        this.editor_alpha = 0.1;
    }

    var t = setInterval(function () {
        self.editor_alpha *= delta;
        self.dirty_canvas = true;
        self.dirty_bgcanvas = true;

        if (delta < 1 && self.editor_alpha < 0.01) {
            clearInterval(t);
            if (delta < 1)
                self.live_mode = true;
        }
        if (delta > 1 && self.editor_alpha > 0.99) {
            clearInterval(t);
            self.editor_alpha = 1;
        }
    }, 1);
}

LGraphCanvas.prototype.onNodeSelectionChange = function (node) {
    return; //disabled
    //if(this.node_in_panel) this.showNodePanel(node);
}

LGraphCanvas.prototype.touchHandler = function (event) {
    //alert("foo");
    var touches = event.changedTouches,
        first = touches[0],
        type = "";

    switch (event.type) {
        case "touchstart": type = "mousedown"; break;
        case "touchmove": type = "mousemove"; break;
        case "touchend": type = "mouseup"; break;
        default: return;
    }

    //initMouseEvent(type, canBubble, cancelable, view, clickCount,
    //           screenX, screenY, clientX, clientY, ctrlKey,
    //           altKey, shiftKey, metaKey, button, relatedTarget);

    var window = this.getCanvasWindow();
    var document = window.document;

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
                              first.screenX, first.screenY,
                              first.clientX, first.clientY, false,
                              false, false, false, 0/*left*/, null);
    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

/* CONTEXT MENU ********************/

LGraphCanvas.onMenuAdd = function (node, e, prev_menu, canvas, first_event) {
    var window = canvas.getCanvasWindow();

    var values = LiteGraph.getNodeTypesCategories();
    var entries = {};
    for (var i in values)
        if (values[i])
            entries[i] = { value: values[i], content: values[i], is_menu: true };

    var menu = LiteGraph.createContextualMenu(entries, { event: e, callback: inner_clicked, from: prev_menu }, window);

    function inner_clicked(v, e) {
        var category = v.value;
        var node_types = LiteGraph.getNodeTypesInCategory(category);
        var values = [];
        for (var i in node_types)
            values.push({ content: node_types[i].title, value: node_types[i].type });

        LiteGraph.createContextualMenu(values, { event: e, callback: inner_create, from: menu }, window);
        return false;
    }

    function inner_create(v, e) {
        var node = LiteGraph.createNode(v.value);
        if (node) {
            node.pos = canvas.convertEventToCanvas(first_event);


            //derwish removed
            //canvas.graph.add(node);

            //derwish added
            node.pos[0] = Math.round(node.pos[0]);
            node.pos[1] = Math.round(node.pos[1]);

            //derwish added
            if (window.this_panel_id != null)
                node.panel_id = window.this_panel_id;//this_panel_id initialized from ViewBag


            send_create_node(node);
        }
    }

    return false;
}


LGraphCanvas.onMenuImport = function (node, e, prev_menu, canvas, first_event) {
    var window = canvas.getCanvasWindow();

    var entries = {};

    entries[0] = { value: "Panel from file", content: "Panel from file", is_menu: false };
    entries[1] = { value: "Panel from script", content: "Panel from script", is_menu: false };
    entries[2] = { value: "Panel from URL", content: "Panel from URL", is_menu: false };

    var menu = LiteGraph.createContextualMenu(entries, { event: e, callback: inner_clicked, from: prev_menu }, window);

    function inner_clicked(v, e) {
        if (v.value == "Panel from file") {
            var pos = canvas.convertEventToCanvas(first_event);
            pos[0] = Math.round(pos[0]);
            pos[1] = Math.round(pos[1]);
            editor.importPanelFromFile(pos);
        }

        if (v.value == "Panel from script") {
            var pos = canvas.convertEventToCanvas(first_event);
            pos[0] = Math.round(pos[0]);
            pos[1] = Math.round(pos[1]);
            editor.importPanelFromScript(pos);
        }

        if (v.value == "Panel from URL") {
            var pos = canvas.convertEventToCanvas(first_event);
            pos[0] = Math.round(pos[0]);
            pos[1] = Math.round(pos[1]);
            editor.importPanelFromURL(pos);
        }

        LiteGraph.closeAllContextualMenus();

        return false;
    }
    return false;
}

LGraphCanvas.onMenuCollapseAll = function () {

}


LGraphCanvas.onMenuNodeEdit = function () {

}

LGraphCanvas.onMenuNodeInputs = function (node, e, prev_menu) {
    if (!node) return;

    var options = node.optional_inputs;
    if (node.onGetInputs)
        options = node.onGetInputs();
    if (options) {
        var entries = [];
        for (var i in options) {
            var entry = options[i];
            var label = entry[0];
            if (entry[2] && entry[2].label)
                label = entry[2].label;
            entries.push({ content: label, value: entry });
        }
        var menu = LiteGraph.createContextualMenu(entries, { event: e, callback: inner_clicked, from: prev_menu });
    }

    function inner_clicked(v) {
        if (!node) return;
        node.addInput(v.value[0], v.value[1], v.value[2]);
    }

    return false;
}

LGraphCanvas.onMenuNodeOutputs = function (node, e, prev_menu) {
    if (!node) return;

    var options = node.optional_outputs;
    if (node.onGetOutputs)
        options = node.onGetOutputs();
    if (options) {
        var entries = [];
        for (var i in options) {
            var entry = options[i];
            if (node.findOutputSlot(entry[0]) != -1)
                continue; //skip the ones already on
            var label = entry[0];
            if (entry[2] && entry[2].label)
                label = entry[2].label;
            entries.push({ content: label, value: entry });
        }
        if (entries.length)
            var menu = LiteGraph.createContextualMenu(entries, { event: e, callback: inner_clicked, from: prev_menu });
    }

    function inner_clicked(v) {
        if (!node)
            return;

        var value = v.value[1];

        if (value && (value.constructor === Object || value.constructor === Array)) //submenu
        {
            var entries = [];
            for (var i in value)
                entries.push({ content: i, value: value[i] });
            LiteGraph.createContextualMenu(entries, { event: e, callback: inner_clicked, from: prev_menu });
            return false;
        }
        else
            node.addOutput(v.value[0], v.value[1], v.value[2]);
    }

    return false;
}

LGraphCanvas.onMenuNodeCollapse = function (node) {
    node.flags.collapsed = !node.flags.collapsed;
    node.setDirtyCanvas(true, true);
}

LGraphCanvas.onMenuNodePin = function (node) {
    node.pin();
}

LGraphCanvas.onMenuNodeColors = function (node, e, prev_menu) {
    var values = [];
    for (var i in LGraphCanvas.node_colors) {
        var color = LGraphCanvas.node_colors[i];
        var value = { value: i, content: "<span style='display: block; color:" + color.color + "; background-color:" + color.bgcolor + "'>" + i + "</span>" };
        values.push(value);
    }
    LiteGraph.createContextualMenu(values, { event: e, callback: inner_clicked, from: prev_menu });

    function inner_clicked(v) {
        if (!node) return;
        var color = LGraphCanvas.node_colors[v.value];
        if (color) {
            node.color = color.color;
            node.bgcolor = color.bgcolor;
            node.setDirtyCanvas(true);
        }
    }

    return false;
}

LGraphCanvas.onMenuNodeShapes = function (node, e) {
    LiteGraph.createContextualMenu(["box", "round"], { event: e, callback: inner_clicked });

    function inner_clicked(v) {
        if (!node) return;
        node.shape = v;
        node.setDirtyCanvas(true);
    }

    return false;
}

LGraphCanvas.onMenuNodeRemove = function (node, e, prev_menu, canvas, first_event) {
    //if (node.removable == false) return;

    if (node.id in canvas.selected_nodes)
        send_remove_nodes(canvas.selected_nodes);
    else
        send_remove_node(node);

    //derwish remove
    //node.graph.remove(uiNode);
    //node.setDirtyCanvas(true, true);
}

LGraphCanvas.onMenuNodeClone = function (node) {
    if (node.clonable == false) return;
    //derwish removed
    //var newnode = node.clone();
    //if(!newnode) return;
    //newnode.pos = [node.pos[0]+10,node.pos[1]+10];
    //node.graph.add(newnode);
    //node.setDirtyCanvas(true, true);

    //derwish added
    send_clone_node(node);
}

LGraphCanvas.node_colors = {
    "red": { color: "#FAA", bgcolor: "#A44" },
    "green": { color: "#AFA", bgcolor: "#4A4" },
    "blue": { color: "#AAF", bgcolor: "#44A" },
    "white": { color: "#FFF", bgcolor: "#AAA" }
};

LGraphCanvas.prototype.getCanvasMenuOptions = function () {
    var options = [];
    if (this.getMenuOptions)
        options = this.getMenuOptions();
    else {
        options.push({ content: "Add", is_menu: true, callback: LGraphCanvas.onMenuAdd });
        options.push(null);

        //{content:"Collapse All", callback: LGraphCanvas.onMenuCollapseAll }

        options.push({ content: "Import", is_menu: true, callback: LGraphCanvas.onMenuImport });
        options.push(null);

        options.push({
            content: "Reset View",
            callback: function () {
                editor.graphcanvas.offset = [0, 0];
                editor.graphcanvas.scale = 1;
                editor.graphcanvas.setZoom(1, [1, 1]);
            }
        });

        options.push({
            content: "Show Map",
            callback: function () {
                editor.addMiniWindow(200, 200);
            }
        });

        if (window.owner_panel_id != null && window.owner_panel_id != "") {


            options.push(null);

            var back_url = "/NodeEditor/";

            if (window.owner_panel_id != MAIN_PANEL_ID)
                back_url += "Panel/" + window.owner_panel_id;

            options.push({
                content: "Close Panel",
                callback: function () { window.location = back_url }
            });

        };

        if (this._graph_stack && this._graph_stack.length > 0)
            options.push({ content: "Close subgraph", callback: this.closeSubgraph.bind(this) });

    }

    if (this.getExtraMenuOptions) {
        var extra = this.getExtraMenuOptions(this);
        if (extra) {
            extra.push(null);
            options = extra.concat(options);
        }
    }

    return options;
}

LGraphCanvas.prototype.getNodeMenuOptions = function (node) {
    var options = [];

    //derwish added
    if (node.properties["Settings"]) {
        options.push({ content: "Settings", callback: function () { NodeSettings(node) } });
        options.push(null);
    }






    if (node.getMenuOptions)
        options = node.getMenuOptions(this);



    if (node.getExtraMenuOptions) {
        var extra = node.getExtraMenuOptions(this);
        if (extra) {
            //extra.push(null);
            options = extra.concat(options);
        }
    }

    if (node.clonable !== false)
        options.push({ content: "Clone", callback: LGraphCanvas.onMenuNodeClone });

    options.push({ content: "Description", callback: function () { editor.showNodeDescrition(node) } });

    options.push({ content: "Collapse", callback: LGraphCanvas.onMenuNodeCollapse });

    if (node.removable !== false)
        options.push({ content: "Remove", callback: LGraphCanvas.onMenuNodeRemove });

    if (node.onGetInputs) {
        var inputs = node.onGetInputs();
        if (inputs && inputs.length)
            options[0].disabled = false;
    }

    if (node.onGetOutputs) {
        var outputs = node.onGetOutputs();
        if (outputs && outputs.length)
            options[1].disabled = false;
    }

    return options;
}

LGraphCanvas.prototype.processContextualMenu = function (node, event) {
    var that = this;
    var win = this.getCanvasWindow();

    var menu_info = null;
    var options = { event: event, callback: inner_option_clicked };

    //check if mouse is in input
    var slot = null;
    if (node)
        slot = node.getSlotInPosition(event.canvasX, event.canvasY);

    if (slot) {
        //derwish remove
        //menu_info = slot.locked ? [ "Cannot remove" ] : { "Remove Slot": slot };
        //options.title = slot.input ? slot.input.type : slot.output.type;
    }
    else
        menu_info = node ? this.getNodeMenuOptions(node) : this.getCanvasMenuOptions();


    //show menu
    if (!menu_info)
        return;

    var menu = LiteGraph.createContextualMenu(menu_info, options, win);

    function inner_option_clicked(v, e) {
        if (!v)
            return;

        if (v == slot) {
            if (v.input)
                node.removeInput(slot.slot);
            else if (v.output)
                node.removeOutput(slot.slot);
            return;
        }

        if (v.callback)
            return v.callback(node, e, menu, that, event);
    }
}






//API *************************************************
//function roundRect(ctx, x, y, width, height, radius, radius_low) {
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, radius_low) {
    if (radius === undefined) {
        radius = 5;
    }

    if (radius_low === undefined)
        radius_low = radius;

    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);

    this.lineTo(x + width, y + height - radius_low);
    this.quadraticCurveTo(x + width, y + height, x + width - radius_low, y + height);
    this.lineTo(x + radius_low, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius_low);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
}

function compareObjects(a, b) {
    for (var i in a)
        if (a[i] != b[i])
            return false;
    return true;
}

function distance(a, b) {
    return Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
}

function colorToString(c) {
    return "rgba(" + Math.round(c[0] * 255).toFixed() + "," + Math.round(c[1] * 255).toFixed() + "," + Math.round(c[2] * 255).toFixed() + "," + (c.length == 4 ? c[3].toFixed(2) : "1.0") + ")";
}

function isInsideRectangle(x, y, left, top, width, height) {
    if (left < x && (left + width) > x &&
		top < y && (top + height) > y)
        return true;
    return false;
}

//[minx,miny,maxx,maxy]
function growBounding(bounding, x, y) {
    if (x < bounding[0])
        bounding[0] = x;
    else if (x > bounding[2])
        bounding[2] = x;

    if (y < bounding[1])
        bounding[1] = y;
    else if (y > bounding[3])
        bounding[3] = y;
}

//point inside boundin box
function isInsideBounding(p, bb) {
    if (p[0] < bb[0][0] ||
		p[1] < bb[0][1] ||
		p[0] > bb[1][0] ||
		p[1] > bb[1][1])
        return false;
    return true;
}

//boundings overlap, format: [start,end]
function overlapBounding(a, b) {
    if (a[0] > b[2] ||
		a[1] > b[3] ||
		a[2] < b[0] ||
		a[3] < b[1])
        return false;
    return true;
}

//Convert a hex value to its decimal value - the inputted hex must be in the
//	format of a hex triplet - the kind we use for HTML colours. The function
//	will return an array with three values.
function hex2num(hex) {
    if (hex.charAt(0) == "#") hex = hex.slice(1); //Remove the '#' char - if there is one.
    hex = hex.toUpperCase();
    var hex_alphabets = "0123456789ABCDEF";
    var value = new Array(3);
    var k = 0;
    var int1, int2;
    for (var i = 0; i < 6; i += 2) {
        int1 = hex_alphabets.indexOf(hex.charAt(i));
        int2 = hex_alphabets.indexOf(hex.charAt(i + 1));
        value[k] = (int1 * 16) + int2;
        k++;
    }
    return (value);
}
//Give a array with three values as the argument and the function will return
//	the corresponding hex triplet.
function num2hex(triplet) {
    var hex_alphabets = "0123456789ABCDEF";
    var hex = "#";
    var int1, int2;
    for (var i = 0; i < 3; i++) {
        int1 = triplet[i] / 16;
        int2 = triplet[i] % 16;

        hex += hex_alphabets.charAt(int1) + hex_alphabets.charAt(int2);
    }
    return (hex);
}

/* LiteGraph GUI elements *************************************/

LiteGraph.createContextualMenu = function (values, options, ref_window) {
    options = options || {};
    this.options = options;

    //allows to create graph canvas in separate window
    ref_window = ref_window || window;

    if (!options.from)
        LiteGraph.closeAllContextualMenus();
    else {
        //closing submenus
        //derwish edit
        var menus = document.querySelectorAll(".graphcontextualmenu");
        for (var key in menus) {
            if (menus[key].previousSibling == options.from)
                menus[key].closeMenu();
        }
    }

    var root = ref_window.document.createElement("div");
    root.className = "graphcontextualmenu graphmenubar-panel";
    this.root = root;
    var style = root.style;

    style.minWidth = "100px";
    style.minHeight = "20px";

    style.position = "fixed";
    style.top = "100px";
    style.left = "100px";
    style.color = LiteGraph.MENU_TEXT_COLOR;
    style.padding = "2px";
    style.borderBottom = "1px solid " + LiteGraph.MENU_TEXT_COLOR;
    style.backgroundColor = LiteGraph.MENU_BG_COLOR;

    //title
    if (options.title) {
        var element = document.createElement("div");
        element.className = "graphcontextualmenu-title";
        element.innerHTML = options.title;
        root.appendChild(element);
    }

    //avoid a context menu in a context menu
    root.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; });

    for (var i in values) {
        var item = values[i];
        var element = ref_window.document.createElement("div");
        element.className = "graphmenu-entry";

        if (item == null) {
            element.className = "graphmenu-entry separator";
            root.appendChild(element);
            continue;
        }

        if (item.is_menu)
            element.className += " submenu";

        if (item.disabled)
            element.className += " disabled";

        element.style.cursor = "pointer";
        element.dataset["value"] = typeof (item) == "string" ? item : item.value;
        element.data = item;
        if (typeof (item) == "string")
            element.innerHTML = values.constructor == Array ? values[i] : i;
        else
            element.innerHTML = item.content ? item.content : i;

        element.addEventListener("click", on_click);
        root.appendChild(element);
    }

    root.addEventListener("mouseover", function (e) {
        this.mouse_inside = true;
    });

    root.addEventListener("mouseout", function (e) {
        //console.log("OUT!");
        //check if mouse leave a inner element
        var aux = e.relatedTarget || e.toElement;
        while (aux != this && aux != ref_window.document)
            aux = aux.parentNode;

        if (aux == this) return;
        this.mouse_inside = false;

        //derwish remove
        //if (!this.block_close)
        //    this.closeMenu();
    });

    //insert before checking position
    ref_window.document.body.appendChild(root);

    var root_rect = root.getClientRects()[0];

    //link menus
    if (options.from) {
        options.from.block_close = true;
    }

    var left = options.left || 0;
    var top = options.top || 0;
    if (options.event) {
        left = (options.event.pageX - 10);
        top = (options.event.pageY - 10);
        if (options.left)
            left = options.left;

        var rect = ref_window.document.body.getClientRects()[0];

        if (options.from) {
            var parent_rect = options.from.getClientRects()[0];
            left = parent_rect.left + parent_rect.width;
        }


        if (left > (rect.width - root_rect.width - 10))
            left = (rect.width - root_rect.width - 10);
        if (top > (rect.height - root_rect.height - 10))
            top = (rect.height - root_rect.height - 10);
    }

    root.style.left = left + "px";
    root.style.top = top + "px";

    function on_click(e) {
        var value = this.dataset["value"];
        var close = true;
        if (options.callback) {
            var ret = options.callback.call(root, this.data, e);
            if (ret !== undefined) close = ret;
        }

        if (close)
            LiteGraph.closeAllContextualMenus();
        //root.closeMenu();
    }

    root.closeMenu = function () {
        if (options.from) {
            options.from.block_close = false;
            if (!options.from.mouse_inside)
                options.from.closeMenu();
        }
        if (this.parentNode)
            ref_window.document.body.removeChild(this);
    };

    return root;
}

LiteGraph.closeAllContextualMenus = function () {
    var elements = document.querySelectorAll(".graphcontextualmenu");
    if (!elements.length) return;

    var result = [];
    for (var i = 0; i < elements.length; i++)
        result.push(elements[i]);

    for (var i in result)
        if (result[i].parentNode)
            result[i].parentNode.removeChild(result[i]);
}

LiteGraph.extendClass = function (target, origin) {
    for (var i in origin) //copy class properties
    {
        if (target.hasOwnProperty(i))
            continue;
        target[i] = origin[i];
    }

    if (origin.prototype) //copy prototype properties
        for (var i in origin.prototype) //only enumerables
        {
            if (!origin.prototype.hasOwnProperty(i))
                continue;

            if (target.prototype.hasOwnProperty(i)) //avoid overwritting existing ones
                continue;

            //copy getters 
            if (origin.prototype.__lookupGetter__(i))
                target.prototype.__defineGetter__(i, origin.prototype.__lookupGetter__(i));
            else
                target.prototype[i] = origin.prototype[i];

            //and setters
            if (origin.prototype.__lookupSetter__(i))
                target.prototype.__defineSetter__(i, origin.prototype.__lookupSetter__(i));
        }
}

/*
LiteGraph.createNodetypeWrapper = function( class_object )
{
	//create Nodetype object
}
//LiteGraph.registerNodeType("scene/global", LGraphGlobal );
*/

if (!window["requestAnimationFrame"]) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame ||
		  (function (callback) {
		      window.setTimeout(callback, 1000 / 60);
		  });
}


