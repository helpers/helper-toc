/*!
 * helper-toc <https://github.com/jonschlinkert/helper-toc>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

/* deps:mocha */
var fs = require('fs');
var assert = require('assert');
var should = require('should');
var Template = require('template');
var _ = require('lodash');
var helper = require('./');
var template;

function read(fp) {
  return fs.readFileSync(fp + '.md', 'utf8');
}
function fixtures(name) {
  return read('fixtures/' + name);
}
function expected(name) {
  return read('expected/' + name);
}

describe('table of contents', function () {
  it('should generate a toc:', function () {
    helper()('fixtures/a.md').should.equal([
      '**[A](fixtures/a.md)**',
      '',
      '- [A](fixtures/a.md/#a)',
      '  * [A 1](fixtures/a.md/#a-1)',
      '  * [A 2](fixtures/a.md/#a-2)',
      '    + [A 3](fixtures/a.md/#a-3)',
      '    + [A 4](fixtures/a.md/#a-4)\n',
    ].join('\n'));
  });

  it('should skip the section heading:', function () {
    helper()('fixtures/a.md', {section: false}).should.equal([
      '- [A](fixtures/a.md/#a)',
      '  * [A 1](fixtures/a.md/#a-1)',
      '  * [A 2](fixtures/a.md/#a-2)',
      '    + [A 3](fixtures/a.md/#a-3)',
      '    + [A 4](fixtures/a.md/#a-4)\n',
    ].join('\n'));
  });

  it('should skip the first h1:', function () {
    helper()('fixtures/a.md', {firsth1: false}).should.equal([
      '**[A](fixtures/a.md)**',
      '',
      '- [A 1](fixtures/a.md/#a-1)',
      '- [A 2](fixtures/a.md/#a-2)',
      '  * [A 3](fixtures/a.md/#a-3)',
      '  * [A 4](fixtures/a.md/#a-4)\n'
    ].join('\n'));
  });

  it('should skip the first h1 and section heading:', function () {
    helper()('fixtures/a.md', {firsth1: false, section: false}).should.equal([
      '- [A 1](fixtures/a.md/#a-1)',
      '- [A 2](fixtures/a.md/#a-2)',
      '  * [A 3](fixtures/a.md/#a-3)',
      '  * [A 4](fixtures/a.md/#a-4)\n'
    ].join('\n'));
  });

  it('should skip the TOC when the first heading is a template:', function () {
    helper()('fixtures/template-heading-first.md').should.equal('');
  });

  it('should skip the TOC when any heading has a template:', function () {
    helper()('fixtures/template-heading.md').should.equal('');
  });

  it('should not skip the TOC when templates are in content (like examples...)', function () {
    helper()('fixtures/template-examples.md').should.equal([
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
      helper()();
    }).should.throw('helper-toc expects patterns to be a string or array.');
  });

  it('should throw an error when an invalid `pattern` is passed:', function () {
    (function () {
      helper()({});
    }).should.throw('helper-toc expects patterns to be a string or array.');
  });
});

describe('helper', function () {
  function render(name, context) {
    _.mixin({toc: helper(context)});
    return _.template(fixtures(name))(context);
  }

  it('should work as a mixin:', function () {
    render('has-mixin').should.equal(expected('has-mixin'));
    render('has-mixin-skip').should.equal(expected('has-mixin-skip'));
    render('has-mixin-skip-no-section').should.equal(expected('has-mixin-skip-no-section'));
  });

  it('should work as a helper:', function () {
    render('has-helper', {toc: helper()}).should.equal(expected('has-helper'));
    render('has-helper-skip', {toc: helper()}).should.equal(expected('has-helper-skip'));
    render('has-helper-skip-no-section', {toc: helper()}).should.equal(expected('has-helper-skip-no-section'));
  });

  it('should take config settings:', function () {
    render('config/has-mixin-skip', {firsth1: false}).should.equal(expected('has-mixin-skip'));
    render('config/has-mixin-skip-no-section', {firsth1: false, section: false}).should.equal(expected('has-mixin-skip-no-section'));

    render('config/has-helper-skip', {toc: helper({firsth1: false})}).should.equal(expected('has-helper-skip'));
    render('config/has-helper-skip-no-section', {toc: helper({firsth1: false, section: false})}).should.equal(expected('has-helper-skip-no-section'));
  });

  it('should generate a toc for file names only:', function () {
    render('files', {toc: helper({read: false})}).should.equal([
      '# Files',
      '',
      '> TOC for a list of files.',
      '',
      '## Table of contents ',
      '',
      '  * [fixtures/a.md](fixtures/a.md)',
      '  * [fixtures/b.md](fixtures/b.md)',
      '  * [fixtures/c.md](fixtures/c.md)\n'
    ].join('\n'));
  });
});
