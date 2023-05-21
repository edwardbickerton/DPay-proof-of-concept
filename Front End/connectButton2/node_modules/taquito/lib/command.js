/**
* @module gitty/command
*/

var childproc = require('child_process');
var exec = childproc.exec;
var execSync = childproc.execSync;

/**
* Setup function for running GIT commands on the command line
* @constructor
* @param {string} path
* @param {string} operation
* @param {array}  flags
* @param {string} options
*/
var Command = function(path, operation, flags, options) {
  flags = flags || [];
  options = options || '';
  var largeOperations = ['log', 'ls-files'];

  this.repo = path;
  this.command = 'git ' + operation + ' ' + flags.join(' ') + ' ' + options;
  // The log on long lived active repos will require more stdout buffer.
  // The default (200K) seems sufficient for all other operations.
  this.execBuffer = 1024 * 200;

  if (largeOperations.indexOf(operation) > -1) {
    this.execBuffer = 1024 * 5000;
  }
};

/**
* Executes the stored operation in the given path
* #exec
* @param {function} callback
*/
Command.prototype.exec = function(callback) {
  return exec(this.command, this._getExecOptions(), callback);
};

/**
* Executes the stored operation in the given path syncronously
* #execSync
*/
Command.prototype.execSync = function() {
  process.chdir(this.repo);
  return execSync(this.command, this._getExecOptions()).toString();
};

/**
* Return options to be passed to exec/execSync
* #_getExecOptions
*/
Command.prototype._getExecOptions = function() {
  return {
    cwd: this.repo,
    maxBuffer: this.execBuffer
  };
};

/**
* Export Contructor
* @constructor
* @type {object}
*/
module.exports = Command;