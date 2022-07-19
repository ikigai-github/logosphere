#pragma once

#include "helpers/GeneratedConstants.h"
#include "gameobjects/<%= name %>.h"
<% imports(definitions, definition).map((imp) => {-%>
#include "mappers/<%= imp.name %>Mapper.h"
<%_ }) -%>
#include "helpers/MapperHelpers.h"

<% kvTMaps(definitions, definition).map((kv) => {-%>
static TMap<FString, FString> <%= kv.type %>ModelToUnreal(std::optional<std::vector<std::optional<ls::<%= kv.type %>>>> const& input)
{
	return ModelVectorToTMap<ls::<%= kv.type %>>(input, ConvertModelString, ConvertModelString);
}

static std::optional<std::vector<std::optional<ls::<%= kv.type %>Input>>> <%= kv.type %>UnrealToModel(
	TMap<FString, FString> const& Input)
{
	return TMapToVectorModel<ls::<%= kv.type %>Input>(Input, ConvertUnrealString, ConvertUnrealString);
}

<%_ }) -%>
<% tArrays(definitions, definition).map((arr) => {-%>
static TArray<FString> <%= classify(arr.name) %>ModelToUnreal(std::optional<std::vector<std::optional<std::string>>> const& input)
{
	return ModelVectorToTArray(input, ConvertModelString);
}

static std::optional<std::vector<std::optional<std::string>>> <%= classify(arr.name) %>UnrealToModel(TArray<FString> const& Input)
{
	return TArrayToVectorModel<std::string>(Input, ConvertUnrealString);
}

<%_ }) -%>
static F<%= namePrefix.toUpperCase() %><%= name %> <%= name %>ToF<%= namePrefix.toUpperCase() %><%= name %>(std::optional<ls::<%= name %>> const& Input)
{
	ls::<%= name %> v;
	try {
		v = Input.value();
	}
	catch(const std::bad_optional_access)
	{
		return F<%= namePrefix.toUpperCase() %><%= name %>();
	}

	return F<%= namePrefix.toUpperCase() %><%= name %>{
		v.id.value_or("").c_str(),
		v.subjectId.value_or("").c_str(),
		<%_ definition.props.map((prop) => { -%>
		<%- propToF(prop, namePrefix.toUpperCase()) %>
		<%_ }); -%>
		v.createdAt.value_or("").c_str(),
		v.updatedAt.value_or("").c_str(),
	};
}

static ls::<%= name %>Input F<%= namePrefix.toUpperCase() %><%= name %>To<%= name %>Input(F<%= namePrefix.toUpperCase() %><%= name %> const& input)
{
	return {
		ConvertUnrealString(input.id),
		ConvertUnrealString(input.subjectId),
		<%_ definition.props.map((prop) => { -%>
		<%- propToInput(prop, namePrefix.toUpperCase()) %>
		<%_ }); -%>
		ConvertUnrealString(input.createdAt),
		ConvertUnrealString(input.updatedAt),
	};
}
