#pragma once

<% imports(definitions, definition).map((imp) => {-%>
#include "<%= imp.name %>.h"
<%_ }) -%>
#include "<%= name %>.generated.h"

<%_ if (isEntity(definition)) { -%>
USTRUCT(BlueprintType)
struct F<%= namePrefix.toUpperCase() %><%= name %>
{
  GENERATED_BODY()

  UPROPERTY(BlueprintReadWrite)
  FString id;

  UPROPERTY(BlueprintReadWrite)
  FString subjectId;

  <%_ definition.props.forEach((prop) => { -%>
  UPROPERTY(Blueprint<% if (prop.isReadOnly) { %>ReadOnly<% } else if (prop.isWriteOnly) { %>WriteOnly<% } else {%>ReadWrite<% } %>)
  <%- typeMap(definitions, prop, namePrefix.toUpperCase()) %> <%= prop.name %>;

  <%_ }) -%>
  UPROPERTY(BlueprintReadWrite)
  FString createdAt;

  UPROPERTY(BlueprintReadWrite)
  FString updatedAt;

};
<%_ } -%>

<%_ if (isEnum(definition)) { -%>
UENUM(BlueprintType)
enum class E<%= namePrefix.toUpperCase() %><%= name %> : uint8 {
<%_ definition.props.forEach((prop) => { -%>
  <%= prop.name %>,
<%_ }) -%>
};
<%_ } -%>