<%_ index.map((def) => { -%>
  export * from './<%= dasherize(def.name) %>.resolver'
<% }) -%>
export * from './user-auth.resolver';
export * from './minting.resolver';