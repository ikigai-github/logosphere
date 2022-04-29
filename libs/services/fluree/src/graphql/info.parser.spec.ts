import { parseInfo, parseSelectionSet } from './info.parser';
import infoFixture from './info.fixture';
import infoFragmentFixture from './info.fragment.fixture';
import { FieldNode, GraphQLResolveInfo } from 'graphql';

describe('Resolver Info Parser', () => {
  it('should return selections from info', () => {
    const resolveInfo = infoFixture as GraphQLResolveInfo;
    const { info } = parseInfo(resolveInfo);
    expect(info).toBeDefined();
    expect(info.selectionSetList).toBeDefined();
    expect(info.selectionSetList.length).toBe(6);
    expect(info.selectionSetList[0]).toBe('identifier');
    expect(info.selectionSetList[1]).toBe('artwork');
    expect(info.selectionSetList[2]).toBe('artwork/identifier');
    expect(info.selectionSetList[3]).toBe('artwork/imageVariants');
    expect(info.selectionSetList[4]).toBe('artwork/imageVariants/identifier');
    expect(info.selectionSetList[5]).toBe('artwork/imageVariants/size');
  });

  it('should return selections from selection set', () => {
    const resolveInfo = infoFixture as GraphQLResolveInfo;
    const { info } = parseSelectionSet(
      resolveInfo,
      (resolveInfo.operation.selectionSet.selections[0] as FieldNode)
        .selectionSet
    );
    expect(info).toBeDefined();
    expect(info.selectionSetList).toBeDefined();
    expect(info.selectionSetList.length).toBe(6);
    expect(info.selectionSetList[0]).toBe('identifier');
    expect(info.selectionSetList[1]).toBe('artwork');
    expect(info.selectionSetList[2]).toBe('artwork/identifier');
    expect(info.selectionSetList[3]).toBe('artwork/imageVariants');
    expect(info.selectionSetList[4]).toBe('artwork/imageVariants/identifier');
    expect(info.selectionSetList[5]).toBe('artwork/imageVariants/size');
  });

  it('should return selections from info with fragments', () => {
    const resolveInfo = infoFragmentFixture as GraphQLResolveInfo;
    const { info } = parseInfo(resolveInfo);
    expect(info).toBeDefined();
    expect(info.selectionSetList).toBeDefined();
    expect(info.selectionSetList.length).toBe(27);
    expect(info.selectionSetList).toEqual([
      'identifier',
      'currentPrice',
      'reservePrice',
      'buyNowPrice',
      'startDate',
      'endDate',
      'isLiked',
      'isWatched',
      'artwork',
      'artwork/title',
      'artwork/imageVariants',
      'artwork/imageVariants/size',
      'artwork/imageVariants/url',
      'artwork/author',
      'artwork/author/username',
      'artwork/author/displayName',
      'artwork/author/isFollowed',
      'artwork/author/profileImageVariants',
      'artwork/author/profileImageVariants/size',
      'artwork/author/profileImageVariants/url',
      'listedBy',
      'listedBy/username',
      'listedBy/displayName',
      'listedBy/isFollowed',
      'listedBy/profileImageVariants',
      'listedBy/profileImageVariants/size',
      'listedBy/profileImageVariants/url',
    ]);
  });

  it('should return selections from selection set with fragments', () => {
    const resolveInfo = infoFragmentFixture as GraphQLResolveInfo;
    const { info } = parseSelectionSet(
      resolveInfo,
      (resolveInfo.operation.selectionSet.selections[0] as FieldNode)
        .selectionSet
    );
    expect(info).toBeDefined();
    expect(info.selectionSetList).toBeDefined();
    expect(info.selectionSetList.length).toBe(27);
    expect(info.selectionSetList).toEqual([
      'identifier',
      'currentPrice',
      'reservePrice',
      'buyNowPrice',
      'startDate',
      'endDate',
      'isLiked',
      'isWatched',
      'artwork',
      'artwork/title',
      'artwork/imageVariants',
      'artwork/imageVariants/size',
      'artwork/imageVariants/url',
      'artwork/author',
      'artwork/author/username',
      'artwork/author/displayName',
      'artwork/author/isFollowed',
      'artwork/author/profileImageVariants',
      'artwork/author/profileImageVariants/size',
      'artwork/author/profileImageVariants/url',
      'listedBy',
      'listedBy/username',
      'listedBy/displayName',
      'listedBy/isFollowed',
      'listedBy/profileImageVariants',
      'listedBy/profileImageVariants/size',
      'listedBy/profileImageVariants/url',
    ]);
  });
});
