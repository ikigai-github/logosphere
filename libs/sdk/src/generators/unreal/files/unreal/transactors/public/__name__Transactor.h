#pragma once

#include "model/<%= name %>.h"
#include "LogosphereSubsystem.h"
#include "LogosphereTransactor.h"

#include "<%= name %>Transactor.generated.h"

// TODO: enable back once it's tested and generalize
// to remove references to CB project
// https://ikigai-technologies.atlassian.net/browse/LOG-207

// Create the LogCryptoBisons log category.
// CBLOGOSPHERE_API DECLARE_LOG_CATEGORY_EXTERN(LogCryptoBisons, Log, All);

// Any actor may utilize the Logosphere subsystem.
// Inheriting from ALogosphereTransactor gives actors additional flexibility and helper functions.
UCLASS(BlueprintType, Blueprintable)
class CBLOGOSPHERE_API A<%= name %>Transactor : public ALogosphereTransactor
{
	GENERATED_BODY()

public:
	// Request/Receive lifecycle for Query => <%= name %>FindOneById.
	UFUNCTION(BlueprintCallable)
	void Request<%= name %>FindOneById();

	UFUNCTION(BlueprintCallable)
	F<%= name %> Receive<%= name %>FindOneById(ULogosphereRequest const * Request);

	// Request/Receive lifecycle for Mutation => <%= name %>Save.
	UFUNCTION(BlueprintCallable)
	void Request<%= name %>Save();

	UFUNCTION(BlueprintCallable)
	F<%= name %> Receive<%= name %>Save(ULogosphereRequest const * Request);

	<%_ if (definition.isNft) { -%>
	// Request/Receive lifecycle for Mutation => <%= name %>MintNft.
	UFUNCTION(BlueprintCallable)
	void Request<%= name %>MintNft();

	UFUNCTION(BlueprintCallable)
	F<%= name %> Receive<%= name %>MintNft(ULogosphereRequest const * Request);
	<%_ } -%>

	// Helper functions for blueprint input.
	UFUNCTION(BlueprintCallable)
	void Set<%= name %>Id(FString <%= name %>Id);

	UFUNCTION(BlueprintCallable)
	void Set<%= name %>Input(F<%= name %> <%= name %>);

	UPROPERTY()
	FString <%= name %>Id;

	<%= name %>Input <%= name %>Input;
};
