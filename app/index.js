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

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'wecceComponentName',
    message: "What's the name of your flexible content?"
  },
  {
    name: 'description',
    message: 'Provide a short description for your flex!'
  },
  {
    name: 'createDir',
    message: 'Would you like me to create an upload directory for your flex?',
    type: 'confirm',
    default: false
  }];

  this.prompt(prompts, function (props) {
    this.wecceComponentName = props.wecceComponentName;
    this.description = props.description;
    this.createDir = props.createDir

    this.slug = _.slugify(this.wecceComponentName);
    this.validVariableName = _.capitalize(_.slugify(this.wecceComponentName)).replace('-','');
    cb();
  }.bind(this));
};

WecceGenerator.prototype.app = function app() {
  this.componentName = _.slugify(this.wecceComponentName);
  this.mkdir(this.componentName);
  this.mkdir('assets');

  this.template('_content.ts', this.componentName + '/content.ts');
  this.template('_flexform.xml', this.componentName + '/flexform.xml');
  this.template('_locallang.xml', this.componentName + '/locallang.xml');

  this.copy('icon.gif', this.componentName + '/icon.gif');
  this.copy('wizard-icon.gif', this.componentName + '/wizard-icon.gif');
};

WecceGenerator.prototype.addWecce = function addWecce() {
  var ext_tables = this.readFileAsString('ext_tables.php');
  var ext_localconf = this.readFileAsString('ext_localconf.php');

  ext_tables = ext_tables.replace("?>", "ux_tx_weccontentelements_lib::addContentElement($_EXTKEY, '"+this.componentName+"');\n?>");
  this.write('ext_tables.php',ext_tables);

  ext_localconf = ext_localconf.replace("?>", "tx_weccontentelements_lib::addTyposcript($_EXTKEY, '"+this.componentName+"');\n?>");
  this.write('ext_localconf.php',ext_localconf);

  if (this.createDir) {
    var ext_emconf = this.readFileAsString('ext_emconf.php');
    ext_emconf = ext_emconf.replace("'createDirs' => '","'createDirs' => 'uploads/skinFlex/"+this.componentName+",");
    this.write('ext_emconf.php',ext_emconf);
  }
}