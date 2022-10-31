<%_ index.map((def) => { -%>
  export * from './<%= dasherize(def.name) %>.resolver'
<% }) -%>
export * from './wallet-service.resolver';
export * from './user-auth.resolver';