/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as assert from 'assert';
import URI from 'vs/base/common/uri';
import { ExtHostWorkspace } from 'vs/workbench/api/node/extHostWorkspace';
import { TestThreadService } from './testThreadService';

suite('ExtHostWorkspace', function () {

	test('asRelativePath', function () {

		const ws = new ExtHostWorkspace(new TestThreadService(), [URI.file('/Coding/Applications/NewsWoWBot')]);

		assert.equal(ws.getRelativePath('/Coding/Applications/NewsWoWBot/bernd/das/brot'), 'bernd/das/brot');
		assert.equal(ws.getRelativePath('/Apps/DartPubCache/hosted/pub.dartlang.org/convert-2.0.1/lib/src/hex.dart'),
			'/Apps/DartPubCache/hosted/pub.dartlang.org/convert-2.0.1/lib/src/hex.dart');

		assert.equal(ws.getRelativePath(''), '');
		assert.equal(ws.getRelativePath('/foo/bar'), '/foo/bar');
		assert.equal(ws.getRelativePath('in/out'), 'in/out');
	});

	test('asRelativePath, same paths, #11402', function () {
		const root = '/home/aeschli/workspaces/samples/docker';
		const input = '/home/aeschli/workspaces/samples/docker';
		const ws = new ExtHostWorkspace(new TestThreadService(), [URI.file(root)]);

		assert.equal(ws.getRelativePath(input), input);

		const input2 = '/home/aeschli/workspaces/samples/docker/a.file';
		assert.equal(ws.getRelativePath(input2), 'a.file');
	});

	test('asRelativePath, no workspace', function () {
		const ws = new ExtHostWorkspace(new TestThreadService(), null);
		assert.equal(ws.getRelativePath(''), '');
		assert.equal(ws.getRelativePath('/foo/bar'), '/foo/bar');
	});

	test('asRelativePath, multiple folders', function () {
		const ws = new ExtHostWorkspace(new TestThreadService(), [URI.file('/Coding/One'), URI.file('/Coding/Two')]);
		assert.equal(ws.getRelativePath('/Coding/One/file.txt'), 'file.txt');
		assert.equal(ws.getRelativePath('/Coding/Two/files/out.txt'), 'files/out.txt');
		assert.equal(ws.getRelativePath('/Coding/Two2/files/out.txt'), '/Coding/Two2/files/out.txt');
	});
});
