<%_ index.map((def) => { -%>
  export * from './<%= dasherize(def.name) %>.repo.interface';
<% }) %>