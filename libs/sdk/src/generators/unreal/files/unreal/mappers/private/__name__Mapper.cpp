#include "helpers/GeneratedConstants.h"
#include "model/<%= name %>.h"
<% imports(definitions, definition).map((imp) => {-%>
#include "mappers/<%= imp.name %>Mapper.cpp"
<%_ }) -%>

// TODO: create TMap conversion functions for arbitrary types
// and generalize TArray conversions
// https://ikigai-technologies.atlassian.net/browse/LOG-205

<% kvTMaps(definitions, definition).map((kv) => {-%>
static TMap<FString, FString> <%= kv.type %>Conversion(std::optional<std::vector<std::optional<<%= kv.type %>>>> const& input)
{
	TMap<FString, FString> result;

	auto real<%= classify(kv.name) %> = input.value();

	for (auto const& optional<%= kv.type %> : real<%= classify(kv.name) %>)
	{
		auto real<%= kv.type %> = optional<%= kv.type %>.value();

		result.Add(
			ANSI_TO_TCHAR(real<%= kv.type %>.key.value().c_str()),
			ANSI_TO_TCHAR(real<%= kv.type %>.value.value().c_str())
		);
	}

	return result;
}

static std::optional<std::vector<std::optional<<%= kv.type %>Input>>> <%= kv.type %>ToModel(TMap<FString, FString> const& Input)
{
	std::vector<std::optional<<%= kv.type %>Input>> Result;

	for (auto const& Pair : Input)
	{
		<%= kv.type %>Input <%= kv.type %>Input;

		<%= kv.type %>Input.key = TCHAR_TO_ANSI(*Pair.Key);
		<%= kv.type %>Input.value = TCHAR_TO_ANSI(*Pair.Value);

		Result.push_back(<%= kv.type %>Input);
	}

	return std::make_optional(Result);
}

<%_ }) -%>

<% tArrays(definitions, definition).map((arr) => {-%>
static TArray<FString> <%= classify(arr.name) %>Conversion(std::optional<std::vector<std::optional<std::string>>> const& input)
{
	TArray<FString> result;

	const auto realInput = input.value();

	for (auto const& optionalValue : realInput)
	{
		result.Add(ANSI_TO_TCHAR(optionalValue.value().c_str()));
	}

	return TArray<FString>();
}

static std::optional<std::vector<std::optional<std::string>>> <%= classify(arr.name) %>ToModel(TArray<FString> const& Input)
{
	std::vector<std::optional<std::string>> Result;

	for (auto const& Value : Input)
	{
		Result.push_back(TCHAR_TO_ANSI(*Value));
	}

	return std::make_optional(Result);
}
<%_ }) -%>

static F<%= name %> <%= name %>ToF<%= name %>(std::optional<<%= name %>> const& Input)
{
	<%= name %> v = Input.value();

	return F<%= name %>{
		v.id.value_or("").c_str(),
		v.subjectId.value_or("").c_str(),
    <%_ definition.props.map((prop) => { -%>
    <%- propToF(prop) %>
    <%_ }); -%>
		v.createdAt.value_or("").c_str(),
		v.updatedAt.value_or("").c_str(),
	};
}

static <%= name %>Input F<%= name %>To<%= name %>Input(F<%= name %> const& Input)
{
	return {
		std::make_optional(TCHAR_TO_UTF8(*Input.id)),
		std::make_optional(TCHAR_TO_UTF8(*Input.subjectId)),
    <%_ definition.props.map((prop) => { -%>
    <%- propToInput(prop) %>
    <%_ }); -%>
		std::make_optional(TCHAR_TO_UTF8(*Input.createdAt)),
		std::make_optional(TCHAR_TO_UTF8(*Input.updatedAt)),
	};
}
