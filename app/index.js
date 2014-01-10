'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var _ = require('underscore.string');


var WecceGenerator = module.exports = function WecceGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    console.log("Don't forget to add (if you need them) those lines to ext_emconf.php, ext_tables.php, and ext_localconf.php")
    console.log("'createDirs' => 'uploads/skinFlex/"+this.componentName+"/',")
    console.log("ux_tx_weccontentelements_lib::addContentElement($_EXTKEY, '"+this.componentName+"');")
    console.log("tx_weccontentelements_lib::addTyposcript($_EXTKEY, '"+this.componentName+"');")
  });

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
  }];

  this.prompt(prompts, function (props) {
    this.wecceComponentName = props.wecceComponentName;
    this.slug = _.slugify(this.wecceComponentName);
    this.description = props.description;
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
