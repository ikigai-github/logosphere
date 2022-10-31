#pragma once

#include "<%= namePrefix %><%= name %>.h"
#include "ipfs/LSIpfsObject.h"

#include "<%= namePrefix %><%= name %>Ipfs.generated.h"

USTRUCT(BlueprintType)
struct F<%= namePrefix %><%= name %>Ipfs
{
  GENERATED_BODY()

  UPROPERTY(BlueprintReadWrite)
  F<%= namePrefix %><%= name %> <%= name %>;

  UPROPERTY(BlueprintReadWrite)
  FLSIpfsObject IpfsObject;
};
