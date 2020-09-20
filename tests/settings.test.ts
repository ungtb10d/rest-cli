
import test from 'tape';
import path from 'path';

import { Settings } from '../src/Settings';

const r = path.resolve.bind(null, __dirname);
const TEST_FILE = r("settings.json");

test("Settings: loadFile", a(async assert => {
    const settings = new Settings();
    
    // It's empty.
    assert.deepEquals(settings.environments, {
        '$shared': {}
    });
    
    await settings.loadFile(TEST_FILE);
    
    assert.true(!!settings.environments['$shared']);
    assert.true(!!settings.environments['local']);
    assert.true(!!settings.environments['production']);
    
    let env: Record<string, string>;
    
    env = settings.getEnvironment('$shared');
    assert.equals(env.id, 'custom');
    assert.equals(env.host, 'http://localhost:8080');
    assert.equals(env.api, '/api/v0');
    assert.equals(env.password, undefined);
    
    env = settings.getEnvironment('local');
    assert.equals(env.id, 'custom');
    assert.equals(env.host, 'http://localhost:8080');
    assert.equals(env.api, '/api/v0');
    assert.equals(env.password, '1234567890');
    
    env = settings.getEnvironment('production');
    assert.equals(env.id, 'custom');
    assert.equals(env.host, 'https://example.com');
    assert.equals(env.api, '/api/v0');
    assert.equals(env.password, 'REDACTED');
}));


test("Settings: loadVsCode", a(async assert => {
    const settings = new Settings();
    
    // It's empty.
    assert.deepEquals(settings.environments, {
        '$shared': {}
    });
    
    await settings.loadVsCode(process.cwd());
    
    assert.true(!!settings.environments['$shared']);
    assert.true(!!settings.environments['local']);
    assert.true(!!settings.environments['production']);
    
    let env: Record<string, string>;
    
    env = settings.getEnvironment('$shared');
    assert.equals(env.id, 'vscode'); 
    assert.equals(env.password, undefined);
    
    env = settings.getEnvironment('local');
    assert.equals(env.id, 'vscode'); 
    assert.equals(env.password, '1234567890');
    
    env = settings.getEnvironment('production');
    assert.equals(env.id, 'vscode'); 
    assert.equals(env.password, 'REDACTED');
}));


test("Settings: loadPackage", a(async assert => {
    const settings = new Settings();
    
    // It's empty.
    assert.deepEquals(settings.environments, {
        '$shared': {}
    });
    
    await settings.loadPackage(process.cwd());
    
    assert.true(!!settings.environments['$shared']);
    assert.true(!!settings.environments['local']);
    assert.true(!!settings.environments['production']);
    
    let env: Record<string, string>;
    
    env = settings.getEnvironment('$shared');
    assert.equals(env.id, 'package');
    assert.equals(env.password, undefined);
    
    env = settings.getEnvironment('local');
    assert.equals(env.id, 'package');
    assert.equals(env.password, '1234567890');
    
    env = settings.getEnvironment('production');
    assert.equals(env.id, 'package');
    assert.equals(env.password, 'REDACTED');
}));


function a(cb: (test: test.Test) => Promise<void>): (test: test.Test) => Promise<void> {
    return async (test) => {
        try {
            cb(test);
        }
        catch (error) {
            test.fail(error);
        }
        finally {
            test.end();
        }
    }
}