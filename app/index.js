'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var _ = require('underscore.string');


var WecceGenerator = module.exports = function WecceGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(WecceGenerator, yeoman.generators.NamedBase);

WecceGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [
  {
    name: 'contentName',
    message: "What's the name of your content element?",
    default: 'Test FCE'
  },
  {
    name: 'contentDescription',
    message: 'Provide a short description!'
  },{
    type: 'list',
    name: 'action',
    message: 'Content element type:',
    choices: [
      { value:'custom', name:'Create a custom content element' },
      new yeoman.inquirer.Separator(),
      { value:'clickToPlay', name:'Based on Click to Play Youtube video' },
      { value:'imageLegend', name:'Based on Image Caption' },
      { value:'full', name:'Full content element' },
      { value:'empty', name:'Empty content element' },
      new yeoman.inquirer.Separator(),
      { value:'exit', name:'Exit' },
    ]
  }
  ];

  this.prompt(prompts, function (props) {
    this.params = {
      contentName: props.contentName,
      slugifiedContentName:  _.camelize(_.slugify(props.contentName)),
      contentDescription: props.contentDescription,
      action: props.action,
      customLines: []
    }
    cb();
  }.bind(this));
};

WecceGenerator.prototype.switchAction = function switchAction() {
  this.mkdir(this.params.slugifiedContentName);

  switch(this.params.action) {
    case 'clickToPlay':
      this._copyClickToPlay();
      break;
    case 'imageLegend':
      this._copyImageCaption();
      break;
    case 'full':
      this._copyFull();
      break;
    case 'empty':
      this._copyEmpty();
      break;
    case 'custom':
      this._initCustom();
      break;
  }
};

WecceGenerator.prototype._initCustom = function _initCustom() {
  var params = this.params;
  var from = params.action+'/';
  var to = params.slugifiedContentName+'/';
  var done = this._promptCustom;
  var _this = this;

  //copy default files
  this.mkdir(params.slugifiedContentName+'/assets');
  this.template(from + '_content.ts', to + 'content.ts');
  this.template(from + '_flexform.xml', to + 'flexform.xml');
  this.template(from + '_locallang.xml', to + 'locallang.xml');
  this.template(from + 'assets/_custom.js', to + 'assets/'+params.slugifiedContentName+'.js');
  this.template(from + 'assets/_style.css', to + 'assets/style.css');
  this.copy(from + 'icon.gif', to + '/icon.gif');
  this.copy(from + 'wizard-icon.gif', to + '/wizard-icon.gif');
  this.conflicter.resolve(function (err) {
      // work with 'myfile'
	  _this.files = {};
	  _this.files.content = _this.readFileAsString(to + 'content.ts');
	  _this.files.flexform = _this.readFileAsString(to + 'flexform.xml');
	  _this.files.locallang = _this.readFileAsString(to + 'locallang.xml');

      done(_this);
  });
};

WecceGenerator.prototype._promptCustom = function _promptCustom(_this) {
  var cb = _this.async();
  var newLine = [
  {
    name: 'customLine',
    message: "Do you wan't another item?",
    type: 'list',
    choices: [
      { value:'input', name:'Input' },
      { value:'textarea', name:'Textarea' },
      { value:'rte', name:'Textarea with RTE' },
      { value:'image', name:'Image' },
      { value:'loop', name:'Loop' },
      { value:'exit', name:'No thanks, that\'s enough.' },
    ]
  }
  ];

  _this.prompt(newLine, function (props) {
    if(props.customLine == 'exit'){
      _this._generateCustomLines();
    }else{
      _this._addCustomLine(props.customLine);
    }
    cb();
  }.bind(_this));
};

WecceGenerator.prototype._addCustomLine = function _addCustomLine(lineType){
  var cb = this.async();

  var prompts = [
  {
    name: 'itemName',
    message: "What's the name of the "+lineType+"?",
    default: 'Item'
  },
  {
    name: 'itemDescription',
    message: 'Provide a short description!',
    default: 'Description of the item'
  }
  ];

  this.prompt(prompts, function (props) {
    this.params.customLines.push({
          name: _.camelize(_.slugify(props.itemName)),
          description: props.itemDescription,
          type: lineType,
        });

    this._promptCustom(this);
    cb();
  }.bind(this));
};

WecceGenerator.prototype._generateCustomLines =  function _generateCustomLines(){
  var params = this.params;
  var to = params.slugifiedContentName+'/';
  var lines = this.params.customLines;

  if(lines.length) {
  	// prepare write
  	for(var i in lines) {
  		var line = lines[i];

	    switch(line.type){
	      case 'input':
	        this._addInputLine(i, line);
	        break;
	    }
  	}

  	// write files
  	this.write(to + 'content.ts', this.files.content);
		this.write(to + 'flexform.xml', this.files.flexform);
		this.write(to + 'locallang.xml', this.files.locallang);
	}
};

WecceGenerator.prototype._addInputLine =  function _addInputLine(cpt, line){
  var params = this.params;
  var index = (parseInt(cpt)+1)*10;

  this.files.content = this.files.content.replace("## // insert here", index+" = TEXT\n		"+index+"{\n			data = t3datastructure : pi_flexform->"+line.name+"\n		}\n\n		## // insert here");
  this.files.flexform = this.files.flexform.replace("<!-- insert here -->", "<"+line.name+">\n						<TCEforms>\n							<label>LLL:EXT:skinFlex/"+params.slugifiedContentName+"/locallang.xml:flexform."+params.slugifiedContentName+"."+line.name+"</label>\n							<config>\n								<type>input</type>\n							</config>\n						</TCEforms>\n					</"+line.name+">\n					\n\n					<!-- insert here -->");
  this.files.locallang = this.files.locallang.replace("<!-- insert here -->",	'<label index="flexform.'+params.slugifiedContentName+'.'+line.name+'"><![CDATA['+line.description+']]></label>\n			<!-- insert here -->');

};

WecceGenerator.prototype._copyClickToPlay = function _copyClickToPlay() {
  //extract params to this
  var params = this.params;
  var from = params.action+'/';
  var to = params.slugifiedContentName+'/';
  this.createDir = true;
  this.mkdir(params.slugifiedContentName+'/assets');

  this.template(from + '_content.ts', to + 'content.ts');
  this.template(from + '_flexform.xml', to + 'flexform.xml');
  this.template(from + '_locallang.xml', to + 'locallang.xml');
  this.template(from + 'assets/_clickToPlay.js', to + 'assets/'+params.slugifiedContentName+'.js');
  this.template(from + 'assets/_style.css', to + 'assets/style.css');

  this.copy(from + 'icon.gif', to + '/icon.gif');
  this.copy(from + 'wizard-icon.gif', to + '/wizard-icon.gif');
};

WecceGenerator.prototype._copyImageCaption = function _copyImageCaption() {
  //extract params to this
  var params = this.params;
  var from = params.action+'/';
  var to = params.slugifiedContentName+'/';
  this.createDir = true;
  this.mkdir(params.slugifiedContentName+'/assets');

  this.template(from + '_content.ts', to + 'content.ts');
  this.template(from + '_flexform.xml', to + 'flexform.xml');
  this.template(from + '_locallang.xml', to + 'locallang.xml');
  this.template(from + 'assets/_style.css', to + 'assets/style.css');

  this.copy(from + 'icon.gif', to + '/icon.gif');
  this.copy(from + 'wizard-icon.gif', to + '/wizard-icon.gif');
};

WecceGenerator.prototype._copyFull = function _copyFull() {
  //extract params to this
  var params = this.params;
  var from = params.action+'/';
  var to = params.slugifiedContentName+'/';
  this.createDir = true;
  this.mkdir(params.slugifiedContentName+'/assets');

  this.template(from + '_content.ts', to + 'content.ts');
  this.template(from + '_flexform.xml', to + 'flexform.xml');
  this.template(from + '_locallang.xml', to + 'locallang.xml');
  this.template(from + 'assets/_full.js', to + 'assets/'+params.slugifiedContentName+'.js');
  this.template(from + 'assets/_style.css', to + 'assets/style.css');

  this.copy(from + 'icon.gif', to + '/icon.gif');
  this.copy(from + 'wizard-icon.gif', to + '/wizard-icon.gif');
};

WecceGenerator.prototype._copyEmpty = function _copyEmpty() {
  //extract params to this
  var params = this.params;
  var from = params.action+'/';
  var to = params.slugifiedContentName+'/';

  this.template(from + '_content.ts', to + 'content.ts');
  this.template(from + '_flexform.xml', to + 'flexform.xml');
  this.template(from + '_locallang.xml', to + 'locallang.xml');

  this.copy(from + 'icon.gif', to + '/icon.gif');
  this.copy(from + 'wizard-icon.gif', to + '/wizard-icon.gif');
};


WecceGenerator.prototype.addWecce = function addWecce() {
  // var ext_tables = this.readFileAsString('ext_tables.php');
  // var ext_localconf = this.readFileAsString('ext_localconf.php');

  // ext_tables = ext_tables.replace("// ## insert here", "ux_tx_weccontentelements_lib::addContentElement($_EXTKEY, '"+this.params.slugifiedContentName+"');\n // ## insert here");
  // this.write('ext_tables.php',ext_tables);

  // ext_localconf = ext_localconf.replace("// ## insert here", "tx_weccontentelements_lib::addTyposcript($_EXTKEY, '"+this.params.slugifiedContentName+"');\n // ## insert here");
  // this.write('ext_localconf.php',ext_localconf);

  // if (this.createDir) {
  //  var ext_emconf = this.readFileAsString('ext_emconf.php');
  //  var matches = ext_emconf.match(/'createDirs' => '([a-zA-Z0-9,\/ ]*)'/g)
  //  if (matches) {
  //    if(matches[0].length < 30) {
  //      ext_emconf = ext_emconf.replace(/'createDirs' => '([a-zA-Z0-9,\/ ]*)'/g,  "'createDirs' => 'uploads/skinFlex/"+this.params.slugifiedContentName+"/'");
  //    }else {
  //      ext_emconf = ext_emconf.replace(/'createDirs' => '([a-zA-Z0-9,\/ ]*)'/g,  "'createDirs' => '$1, uploads/skinFlex/"+this.params.slugifiedContentName+"/'");
  //    }

  //    this.write('ext_emconf.php',ext_emconf);
  //  }
  // }
}
