<%_ index.map((def) => { -%>
  export * from './<%= dasherize(def.name) %>.dto';
<% }) -%>
export * from './user-auth.dto';
export * from './wallet.dto';