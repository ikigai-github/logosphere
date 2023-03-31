<%_ index.map((def) => { -%>
  export * from './<%= dasherize(def.name) %>.resolver'
<% }) -%>
export * from './lucid.resolver';