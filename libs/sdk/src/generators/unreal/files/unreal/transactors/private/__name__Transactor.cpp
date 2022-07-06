#include "<%= name %>Transactor.h"

#include "LogosphereSubsystem.h"
#include "gql/LogosphereRequest.h"

#include "model/<%= name %>.h"
#include "mappers/<%= name %>Mapper.cpp"

// TODO: enable back once it's tested
// https://ikigai-technologies.atlassian.net/browse/LOG-207

// CBLOGOSPHERE_API DEFINE_LOG_CATEGORY(LogCryptoBisons);

// This function should be executed as a callback after a request of ReceiveFindOneById is sent via ExecuteTransaction.
F<%= name %> A<%= name %>Transactor::Receive<%= name %>FindOneById(ULogosphereRequest const * Request)
{
	return RequestToUnrealObject<Query::<%= name %>FindOneByIdField, <%= name %>, F<%= name %>>(Request, <%= name %>ToF<%= name %>);
}

// Largely similar to ReceiveFindOneById, except the query is now a mutation, and the Unreal Engine object is populated differently.
// The data that the responses receive is dictated by the schema.
F<%= name %> A<%= name %>Transactor::Receive<%= name %>Save(ULogosphereRequest const * Request)
{
	return RequestToUnrealObject<Mutation::<%= name %>SaveField, <%= name %>, F<%= name %>>(Request, <%= name %>ToF<%= name %>);
}

void A<%= name %>Transactor::Set<%= name %>Id(FString _<%= name %>Id)
{
	<%= name %>Id = _<%= name %>Id;
}

// Convert an Unreal Engine object into a schema-based object.
void A<%= name %>Transactor::Set<%= name %>Input(F<%= name %> <%= name %>)
{
	<%= name %>Input = F<%= name %>To<%= name %>Input(<%= name %>);
}

// Execute a new transaction to the Logosphere Subsystem.
// Passing:
// 1. type (query/mutation and operation)
// 2. ResponseHandler (responsible for calling back to us)
// 3. Input variables as defined in the schema
void A<%= name %>Transactor::Request<%= name %>FindOneById()
{
	LogosphereSubsystem = GetLogosphereSubsystem();

	LogosphereSubsystem->ExecuteTransaction<Query::<%= name %>FindOneByIdField>(ResponseHandler, TCHAR_TO_ANSI(*<%= name %>Id));
}

void A<%= name %>Transactor::Request<%= name %>Save()
{
	LogosphereSubsystem = GetLogosphereSubsystem();

	LogosphereSubsystem->ExecuteTransaction<Mutation::<%= name %>SaveField>(ResponseHandler, <%= name %>Input);
}

<%_ if (definition.isNft) { -%>
void A<%= name %>Transactor::Request<%= name %>MintNft()
{
	LogosphereSubsystem = GetLogosphereSubsystem();

	LogosphereSubsystem->ExecuteTransaction<Mutation::<%= name %>MintNftField>(ResponseHandler, <%= name %>Input);
}

F<%= name %> A<%= name %>Transactor::Receive<%= name %>MintNft(ULogosphereRequest const * Request)
{
	return RequestToUnrealObject<Mutation::<%= name %>MintNftField, <%= name %>, F<%= name %>>(Request, <%= name %>ToF<%= name %>);
}
<%_ } -%>
