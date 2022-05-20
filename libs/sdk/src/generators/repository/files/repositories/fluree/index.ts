<%_ index.map((def) => { -%>
  export * from './<%= dasherize(def.name) %>.repository'
<% }) %>