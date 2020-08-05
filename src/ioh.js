// ✊🏿

'use strict';

const Oath = require('@castlelemongrab/oath');

/**
  Basic browser-based input and output
**/
const IOH = class {

  /**
    Write a string to the console; linefeed is unavoidable.
    @arg _message {string} - The message to emit.
  **/
  stdout (_message) {

    let message = _message.replace(/[\r\n]*$/, '');
    console.log(message);
    return this;
  }

  /**
    Write a string to console error; linefeed is unavoidable.
    @arg _message {string} - The message to emit.
  **/
  stderr (_message, _is_critical) {

    let message = _message.replace(/[\r\n]*$/, '');

    if (_is_critical) {
      console.error(message);
    } else {
      console.debug(_message);
    }

    return this;
  }

  /**
    Terminate execution.
    @arg _status {number} - The process exit code. Defaults to non-zero.
  **/
  exit (_status) {

    throw new Error(`Process exited with status ${_status || 127}\n`);
  }

  /**
    Raise a fatal error and terminate execution.
    @arg _message {string} - The message to emit.
    @arg _status {number} - The process exit code. Defaults to non-zero.
  **/
  fatal (_message, _status) {

    this.log('fatal', `${_message}`, true);
    throw new Error(`Process exited with status ${_status || 127}\n`);
  }

  /**
    Warn the user of an exigent circumstance
    @arg _message {string} - The message to emit.
  **/
  warn (_message) {

    this.log('warn', `${_message}`, true);
    return this;
  }

  /**
    Log a message to standard error.
    @arg {_type} {string} - The type of message being logged.
    @arg {_message} {string} - The message to log to standard error.
  **/
  log (_type, _message) {

    this.stderr(`[${_type}] ${_message}\n`);
    return this;
  }

  /**
    Log a message to standard error while obeying a numeric log level.
    @arg {_type} {string} - The type of message being logged.
    @arg {_message} {string} - The message to log to standard error.
    @arg {_limit} {number} - The current log level limit.
    @arg {_level} {number} - The log level of this message.
  **/
  log_level (_type, _message, _limit, _level) {

    if (_level > _limit) {
      return this;
    }

    return this.log(_type, _message);
  }

  /**
    Read a file from `_path` asynchronously, and return a Buffer.
    @arg {_path} {string} - The potentially-relative path to read from
  **/
  async read_file (_path) {

    throw new Error('Method is not implemented');
  }

  /**
    Write `_data` to the file at `_path`, asynchronously.
    @arg {_path} {string} - The potentially-relative path to write into
    @arg {_data} {string|Buffer} - The data to write to `_path`
  **/
  async write_file (_path, _data) {

    throw new Error('Method is not implemented');
  }
};

/**
  A Node.js specialization of the `IOJ` base class.
  @extends IOH
**/
const NodeIOH = class extends IOH {

  constructor (_options) {

    super(_options);

    /* To do: this probably isn't ideal */
    this._fs = require('fs');
    this._process = require('process');

    this._read_file = (
      this._fs.promises ?
        this._fs.promises.readFile : Oath.promisify(this._fs.readFile)
    );

    this._write_file = (
      this._fs.promises ?
        this._fs.promises.writeFile : Oath.promisify(this._fs.writeFile)
    );

    return this;
  }

  /**
    Write a string to standard output.
  **/
  stdout (_message) {

    this._process.stdout.write(_message);
    return this;
  }
  /**
    Write a string to standard error.
  **/
  stderr (_message, _is_critical) {

    this._process.stderr.write(_message);
    return this;
  }

  /**
    Terminate execution.
    @arg _status {number} - The process exit code. Defaults to non-zero.
  **/
  exit (_status) {

    this._process.exit(_status);
  }

  /**
    Raise a fatal error and terminate execution.
  **/
  fatal (_message, _status) {

    try {
      super.fatal(_message, _status);
    } catch (_e) {
      /* Ignore exception */
    }

    this.exit(_status || 127);
  }

  /**
    Read a file from `_path` asynchronously, and return a Buffer.
    @arg {_path} {string} - The potentially-relative path to read from
  **/
  async read_file (_path) {

    return (await this._read_file(_path)).toString();
  }

  /**
    Write `_data` to the file at `_path`, asynchronously.
    @arg {_path} {string} - The potentially-relative path to write into
    @arg {_data} {string|Buffer} - The data to write to `_path`
  **/

  async write_file (_path, _data) {

    return await this._write_file(_path, _data);
  }
};

/**
  A mix-in to force all output to be be buffered in memory.
  This is either beautiful, a programmer war crime, or both.
**/
const Plug = (_class) => class extends _class {

  constructor (_options) {

    super(_options);

    return this.reset();
  }

  /**
  **/
  reset () {

    this._files = {};
    this._stdout = null;
    this._stderr = null;

    return this;
  }

  /**
  **/
  get files () {

    return this._files;
  }

  /**
  **/
  get_file (_path) {

    return this._files[_path];
  }

  /**
    Write a string to standard output.
  **/
  stdout (_message) {

    if (this._stdout === null) {
      this._stdout = '';
    }

    this._stdout += _message;
    return this;
  }

  /**
    Write a string to standard error.
  **/
  stderr (_message, _is_critical) {

    if (this._stderr === null) {
      this._stderr = '';
    }

    this._stderr += _message;
    return this;
  }

  /**
  **/
  async write_file (_path, _data) {

    if (this._files[_path] == null) {
      this._files[_path] = '';
    }

    this._files[_path] += _data.toString();
    return Promise.resolve();
  }

  /**
  **/
  toString (_want_stderr) {

    return (_want_stderr ? this._stderr : this._stdout);
  }
};

/**
  All available output classes.
**/
const Exports = {
  Base: IOH,
  Node: NodeIOH,
  Plug: class extends Plug(IOH) {},
  NodePlug: class extends Plug(NodeIOH) {},
};

/* Export symbols */
module.exports = Exports;

