<%_ index.map((def) => { -%>
  export * from './<%= dasherize(def.name) %>.dto';
<% }) -%>