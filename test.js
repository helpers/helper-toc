/*!
 * helper-toc <https://github.com/jonschlinkert/helper-toc>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

/* deps:mocha */
var assert = require('assert');
var should = require('should');
var Template = require('template');
var helper = require('./');
var template;

describe('helper', function () {
  it('should:', function () {
    helper('fixtures/a.md').should.equal([
      '**[TOC fixture](fixtures/a.md)**',
      '',
      '- [TOC fixture](fixtures/a.md/#toc-fixture)',
      '  * [A 1](fixtures/a.md/#a-1)',
      '  * [A 2](fixtures/a.md/#a-2)',
      '    + [A 3](fixtures/a.md/#a-3)',
      '    + [A 4](fixtures/a.md/#a-4)\n'
    ].join('\n'));
  });

  it('should skip the section heading:', function () {
    helper('fixtures/a.md', {section: false}).should.equal([
      '- [TOC fixture](fixtures/a.md/#toc-fixture)',
      '  * [A 1](fixtures/a.md/#a-1)',
      '  * [A 2](fixtures/a.md/#a-2)',
      '    + [A 3](fixtures/a.md/#a-3)',
      '    + [A 4](fixtures/a.md/#a-4)\n'
    ].join('\n'));
  });

  it('should skip the first h1:', function () {
    helper('fixtures/a.md', {firsth1: false}).should.equal([
      '**[TOC fixture](fixtures/a.md)**',
      '',
      '- [A 1](fixtures/a.md/#a-1)',
      '- [A 2](fixtures/a.md/#a-2)',
      '  * [A 3](fixtures/a.md/#a-3)',
      '  * [A 4](fixtures/a.md/#a-4)\n'
    ].join('\n'));
  });

  it('should skip the first h1 and section heading:', function () {
    helper('fixtures/a.md', {firsth1: false, section: false}).should.equal([
      '- [A 1](fixtures/a.md/#a-1)',
      '- [A 2](fixtures/a.md/#a-2)',
      '  * [A 3](fixtures/a.md/#a-3)',
      '  * [A 4](fixtures/a.md/#a-4)\n'
    ].join('\n'));
  });

  it('should skip the TOC when the first heading is a template:', function () {
    helper('fixtures/template-heading-first.md').should.equal('');
  });

  it('should skip the TOC when any heading has a template:', function () {
    helper('fixtures/template-heading.md').should.equal('');
  });

  it('should not skip the TOC when templates are in content (like examples...)', function () {
    helper('fixtures/template-examples.md').should.equal([
      '**[File with templates](fixtures/template-examples.md)**',
      '',
      '- [File with templates](fixtures/template-examples.md/#file-with-templates)',
      '  * [A 1](fixtures/template-examples.md/#a-1)',
      '  * [A 2](fixtures/template-examples.md/#a-2)',
      '    + [A 3](fixtures/template-examples.md/#a-3)',
      '    + [A 4](fixtures/template-examples.md/#a-4)\n',
    ].join('\n'));
  });

  it('should throw an error when no `pattern` is passed:', function () {
    (function () {
      helper();
    }).should.throw('helper-toc expects patterns to be a string or array.');
  });

  it('should throw an error when an invalid `pattern` is passed:', function () {
    (function () {
      helper({});
    }).should.throw('helper-toc expects patterns to be a string or array.');
  });
});
