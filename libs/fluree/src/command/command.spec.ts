import { create } from '../transact';
import { command, serializeCommand, signableCommand } from './command.util';
import { hash } from '../utils';
describe('Fluree command utils', () => {
  it('should create a valid command', () => {
    const tx = create('person').data({ name: 'test ' }).build();
    const cmd = command('test/testdb', tx);
    expect(cmd.db).toBe('test/testdb');
    expect(cmd.tx).toEqual(tx);
    expect(cmd.auth).toBeUndefined();
    expect(cmd.expire).toBeDefined();
    expect(cmd.expire).toBeGreaterThan(+Date.now());
    expect(cmd.fuel).toBeUndefined();
    expect(cmd.nonce).toBeDefined();
    expect(cmd.type).toBe('tx');
    expect(cmd.deps).toBeUndefined();
    expect(cmd.txidOnly).toBeFalsy();
  });

  it('should create a stable signable command', () => {
    const tx = create('person').data({ name: 'test ' }).build();
    const signable = signableCommand('test/testdb', tx);
    const { type, ...rest } = signable.command;
    // Normal JSON.stringify would output a different string for this copy
    const commandCopy = { ...rest, type };
    const serializedCopy = serializeCommand(commandCopy);
    const hashedCopy = hash(serializedCopy);
    expect(signable.command).toEqual(commandCopy);
    expect(signable.serialized).toBe(serializedCopy);
    expect(signable.hash).toBe(hashedCopy);
  });
});
