#include "transactors/<%= name %>Transactor.h"

#include "LogosphereSubsystem.h"
#include "api/LogosphereRequest.h"

#include "gameobjects/<%= namePrefix %><%= name %>.h"
#include "mappers/<%= name %>Mapper.h"


<%= module.toUpperCase() %>LOGOSPHERE_API DECLARE_LOG_CATEGORY_EXTERN(<%= classify(module) %>LogosphereApi, Log, All);

// This function should be executed as a callback after a request of ReceiveFindOneById is sent via ExecuteTransaction.
F<%= namePrefix.toUpperCase() %><%= name %> A<%= name %>Transactor::Receive<%= name %>FindOneById(ULogosphereRequest const * Request)
{
	return RequestToUnrealObject<ls::Query::<%= name %>FindOneByIdField, ls::<%= name %>, F<%= namePrefix.toUpperCase() %><%= name %>>(Request, <%= name %>ToF<%= namePrefix.toUpperCase() %><%= name %>);
}

// Largely similar to ReceiveFindOneById, except the query is now a mutation, and the Unreal Engine object is populated differently.
// The data that the responses receive is dictated by the schema.
F<%= namePrefix.toUpperCase() %><%= name %> A<%= name %>Transactor::Receive<%= name %>Save(ULogosphereRequest const * Request)
{
	UE_LOG(<%= classify(module) %>LogosphereApi, Display, TEXT("Received <%= name %>Save Response"));
	return RequestToUnrealObject<ls::Mutation::<%= name %>SaveField, ls::<%= name %>, F<%= namePrefix.toUpperCase() %><%= name %>>(Request, <%= name %>ToF<%= namePrefix.toUpperCase() %><%= name %>);
}

void A<%= name %>Transactor::Set<%= name %>Id(FString _<%= name %>Id)
{
	<%= name %>Id = _<%= name %>Id;
}

// Convert an Unreal Engine object into a schema-based object.
void A<%= name %>Transactor::Set<%= name %>Input(F<%= namePrefix.toUpperCase() %><%= name %> <%= name %>)
{
	<%= name %>Input = F<%= namePrefix.toUpperCase() %><%= name %>To<%= name %>Input(<%= name %>);
}

// Execute a new transaction to the Logosphere Subsystem.
// Passing:
// 1. type (query/mutation and operation)
// 2. ResponseHandler (responsible for calling back to us)
// 3. Input variables as defined in the schema
void A<%= name %>Transactor::Request<%= name %>FindOneById(FString const& Id)
{
	LogosphereSubsystem = GetLogosphereSubsystem();

	UE_LOG(<%= classify(module) %>LogosphereApi, Display, TEXT("Sending <%= name %>FindOneById  Request"));

	LogosphereSubsystem->ExecuteTransaction<ls::Query::<%= name %>FindOneByIdField>(ResponseHandler, TCHAR_TO_UTF8(*Id));
}

void A<%= name %>Transactor::Request<%= name %>Save()
{
	LogosphereSubsystem = GetLogosphereSubsystem();
	
	UE_LOG(<%= classify(module) %>LogosphereApi, Display, TEXT("Sending <%= name %>Save  Request"));

	LogosphereSubsystem->ExecuteTransaction<ls::Mutation::<%= name %>SaveField>(ResponseHandler, <%= name %>Input);
}

<%_ if (definition.isNft) { -%>
void A<%= name %>Transactor::Request<%= name %>MintNft()
{
	LogosphereSubsystem = GetLogosphereSubsystem();

	UE_LOG(<%= classify(module) %>LogosphereApi, Display, TEXT("Sending <%= name %>MintNft  Request"));

	LogosphereSubsystem->ExecuteTransaction<ls::Mutation::<%= name %>MintNftField>(ResponseHandler, <%= name %>Input);
}

F<%= namePrefix.toUpperCase() %><%= name %> A<%= name %>Transactor::Receive<%= name %>MintNft(ULogosphereRequest const * Request)
{
	UE_LOG(<%= classify(module) %>LogosphereApi, Display, TEXT("Received <%= name %>MintNft Response"));
	return RequestToUnrealObject<ls::Mutation::<%= name %>MintNftField, ls::<%= name %>, F<%= namePrefix.toUpperCase() %><%= name %>>(Request, <%= name %>ToF<%= namePrefix.toUpperCase() %><%= name %>);
}

void A<%= name %>Transactor::Request<%= name %>MintNftTx()
{
	LogosphereSubsystem = GetLogosphereSubsystem();

	UE_LOG(CbLogosphereApi, Display, TEXT("Sending <%= name %>MintNftTx Request"));

	LogosphereSubsystem->ExecuteTransaction<ls::Mutation::<%= name %>MintNftTxField>(ResponseHandler, <%= name %>Input);
}

FString A<%= name %>Transactor::Receive<%= name %>MintNftTx(ULogosphereRequest const* Request)
{
	UE_LOG(CbLogosphereApi, Display, TEXT("Received <%= name %>MintNftTx Response"));
	return RequestToUnrealObject<ls::Mutation::<%= name %>MintNftTxField, std::string, FString>(Request, StdStringToFString);
}

<%_ } -%>
