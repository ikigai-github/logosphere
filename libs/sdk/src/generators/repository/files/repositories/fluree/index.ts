<%_ index.map((def) => { -%>
  export * from './<%= dasherize(def.name) %>.fluree.repo';
<% }) -%>
export * from './user-auth.fluree.repo';