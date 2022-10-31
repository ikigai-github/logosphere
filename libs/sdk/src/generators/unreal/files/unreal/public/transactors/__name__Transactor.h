#pragma once

#include "gameobjects/<%= namePrefix %><%= name %>.h"
#include "LogosphereSubsystem.h"
#include "LogosphereTransactor.h"

#include "<%= name %>Transactor.generated.h"

// Any actor may utilize the Logosphere subsystem.
// Inheriting from ALogosphereTransactor gives actors additional flexibility and helper functions.
UCLASS(BlueprintType, Blueprintable)
class CBLOGOSPHERE_API A<%= name %>Transactor : public ALogosphereTransactor
{
	GENERATED_BODY()

public:
	// Request/Receive lifecycle for Query => <%= name %>FindOneById.
	UFUNCTION(BlueprintCallable)
	void Request<%= name %>FindOneById(FString const& Id);

	UFUNCTION(BlueprintCallable)
	F<%= namePrefix.toUpperCase() %><%= name %> Receive<%= name %>FindOneById(ULogosphereRequest const * Request);

	// Request/Receive lifecycle for Mutation => <%= name %>Save.
	UFUNCTION(BlueprintCallable)
	void Request<%= name %>Save();

	UFUNCTION(BlueprintCallable)
	F<%= namePrefix.toUpperCase() %><%= name %> Receive<%= name %>Save(ULogosphereRequest const * Request);

	<%_ if (definition.isNft) { -%>
	// Request/Receive lifecycle for Mutation => <%= name %>MintNft.
	UFUNCTION(BlueprintCallable)
	void Request<%= name %>MintNft();

	UFUNCTION(BlueprintCallable)
	F<%= namePrefix.toUpperCase() %><%= name %> Receive<%= name %>MintNft(ULogosphereRequest const * Request);

	UFUNCTION(BlueprintCallable)
	void Request<%= name %>MintNftTx();

	UFUNCTION(BlueprintCallable)
	FString Receive<%= name %>MintNftTx(ULogosphereRequest const * Request);
	<%_ } -%>

	// Helper functions for blueprint input.
	UFUNCTION(BlueprintCallable)
	void Set<%= name %>Id(FString <%= name %>Id);

	UFUNCTION(BlueprintCallable)
	void Set<%= name %>Input(F<%= namePrefix.toUpperCase() %><%= name %> <%= name %>);

	UPROPERTY()
	FString <%= name %>Id;

	ls::<%= name %>Input <%= name %>Input;
};
