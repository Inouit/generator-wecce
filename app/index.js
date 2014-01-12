'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var _ = require('underscore.string');
var fs = require('fs');


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
      action: props.action
    }
    cb();
  }.bind(this));
};

WecceGenerator.prototype.switchAction = function switchAction() {
  this.mkdir(this.params.slugifiedContentName);
  var from = 'default/';
  var to = this.params.slugifiedContentName+'/';
  this.copy('default/icon.gif', to + '/icon.gif');
  this.copy('default/wizard-icon.gif', to + '/wizard-icon.gif');

  switch(this.params.action) {
    case 'clickToPlay':
      WecceGenerator.prototype._copyClickToPlay(this);
      break;
    case 'imageLegend':
      WecceGenerator.prototype._copyImageCaption(this);
      break;
    case 'full':
      WecceGenerator.prototype._copyFull(this);
      break;
    case 'empty':
      WecceGenerator.prototype._copyEmpty(this);
      break;
  }
};

WecceGenerator.prototype._copyClickToPlay = function _copyClickToPlay(_this) {
  //extract params to this
  var params = _this.params;
  var from = params.action+'/';
  var to = params.slugifiedContentName+'/';
  _this.createDir = true;
  _this.mkdir(params.slugifiedContentName+'/assets');

  _this.template(from + '_content.ts', to + 'content.ts');
  _this.template(from + '_flexform.xml', to + 'flexform.xml');
  _this.template(from + '_locallang.xml', to + 'locallang.xml');
  _this.template(from + 'assets/_clickToPlay.js', to + 'assets/'+params.slugifiedContentName+'.js');
  _this.template(from + 'assets/_style.css', to + 'assets/style.css');

  _this.copy(from + 'icon.gif', to + '/icon.gif');
  _this.copy(from + 'wizard-icon.gif', to + '/wizard-icon.gif');
};

WecceGenerator.prototype._copyImageCaption = function _copyImageCaption(_this) {
  //extract params to this
  var params = _this.params;
  var from = params.action+'/';
  var to = params.slugifiedContentName+'/';
  _this.createDir = true;
  _this.mkdir(params.slugifiedContentName+'/assets');

  _this.template(from + '_content.ts', to + 'content.ts');
  _this.template(from + '_flexform.xml', to + 'flexform.xml');
  _this.template(from + '_locallang.xml', to + 'locallang.xml');
  _this.template(from + 'assets/_style.css', to + 'assets/style.css');

  _this.copy(from + 'icon.gif', to + '/icon.gif');
  _this.copy(from + 'wizard-icon.gif', to + '/wizard-icon.gif');
};

WecceGenerator.prototype._copyFull = function _copyFull(_this) {
  //extract params to this
  var params = _this.params;
  var from = params.action+'/';
  var to = params.slugifiedContentName+'/';
  _this.createDir = true;
  _this.mkdir(params.slugifiedContentName+'/assets');

  _this.template(from + '_content.ts', to + 'content.ts');
  _this.template(from + '_flexform.xml', to + 'flexform.xml');
  _this.template(from + '_locallang.xml', to + 'locallang.xml');
  _this.template(from + 'assets/_full.js', to + 'assets/'+params.slugifiedContentName+'.js');
  _this.template(from + 'assets/_style.css', to + 'assets/style.css');

  _this.copy(from + 'icon.gif', to + '/icon.gif');
  _this.copy(from + 'wizard-icon.gif', to + '/wizard-icon.gif');
};

WecceGenerator.prototype._copyEmpty = function _copyEmpty(_this) {
  //extract params to this
  var params = _this.params;
  var from = params.action+'/';
  var to = params.slugifiedContentName+'/';

  _this.template(from + '_content.ts', to + 'content.ts');
  _this.template(from + '_flexform.xml', to + 'flexform.xml');
  _this.template(from + '_locallang.xml', to + 'locallang.xml');

  _this.copy(from + 'icon.gif', to + '/icon.gif');
  _this.copy(from + 'wizard-icon.gif', to + '/wizard-icon.gif');
};


WecceGenerator.prototype.addWecce = function addWecce() {
  var ext_tables = this.readFileAsString('ext_tables.php');
  var ext_localconf = this.readFileAsString('ext_localconf.php');

  ext_tables = ext_tables.replace("// ## insert here", "ux_tx_weccontentelements_lib::addContentElement($_EXTKEY, '"+this.params.slugifiedContentName+"');\n // ## insert here");
  this.write('ext_tables.php',ext_tables);

  ext_localconf = ext_localconf.replace("// ## insert here", "tx_weccontentelements_lib::addTyposcript($_EXTKEY, '"+this.params.slugifiedContentName+"');\n // ## insert here");
  this.write('ext_localconf.php',ext_localconf);

  if (this.createDir) {
    var ext_emconf = this.readFileAsString('ext_emconf.php');
    var matches = ext_emconf.match(/'createDirs' => '([a-zA-Z0-9,\/ ]*)'/g)
    if (matches) {
      if(matches[0].length < 30) {
        ext_emconf = ext_emconf.replace(/'createDirs' => '([a-zA-Z0-9,\/ ]*)'/g,  "'createDirs' => 'uploads/skinFlex/"+this.params.slugifiedContentName+"/'");  
      }else {
        ext_emconf = ext_emconf.replace(/'createDirs' => '([a-zA-Z0-9,\/ ]*)'/g,  "'createDirs' => '$1, uploads/skinFlex/"+this.params.slugifiedContentName+"/'");    
      }
      
      this.write('ext_emconf.php',ext_emconf);
    }
  }
}
