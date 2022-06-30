import { gqlSelectionSetToFql } from './util';
describe('GraphQL to FlureeQL', () => {
  it('should convert GQL to FQL', () => {
    const selectionSetList = [
      'identifier',
      'currentPrice',
      'reservePrice',
      'buyNowPrice',
      'startDate',
      'endDate',
      'likeCount',
      'watchCount',
      'isLiked',
      'isWatched',
      'bidHistory',
      'bidHistory/bidPrice',
      'bidHistory/date',
      'bidHistory/user',
      'bidHistory/user/username',
      'bidHistory/user/displayName',
      'bidHistory/user/profileImageVariants',
      'bidHistory/user/profileImageVariants/size',
      'bidHistory/user/profileImageVariants/url',
      'bidHistory/user/profileImageVariants/__typename',
      'bidHistory/user/__typename',
      'bidHistory/__typename',
      'artwork',
      'artwork/title',
      'artwork/imageVariants',
      'artwork/imageVariants/size',
      'artwork/imageVariants/url',
      'artwork/imageVariants/__typename',
      'artwork/__typename',
      'listedBy',
      'listedBy/username',
      'listedBy/displayName',
      'listedBy/isFollowed',
      'listedBy/profileImageVariants',
      'listedBy/profileImageVariants/size',
      'listedBy/profileImageVariants/url',
      'listedBy/profileImageVariants/__typename',
      'listedBy/__typename',
    ];

    const fql = gqlSelectionSetToFql(selectionSetList);
    expect(JSON.stringify(fql)).toEqual(
      JSON.stringify([
        'identifier',
        'currentPrice',
        'reservePrice',
        'buyNowPrice',
        'startDate',
        'endDate',
        'likeCount',
        'watchCount',
        'isLiked',
        'isWatched',
        {
          bidHistory: [
            'bidPrice',
            'date',
            {
              user: [
                'username',
                'displayName',
                {
                  profileImageVariants: [
                    'size',
                    'url',
                    'createdAt',
                    'updatedAt',
                  ],
                },
                'createdAt',
                'updatedAt',
              ],
            },
            'createdAt',
            'updatedAt',
          ],
        },
        {
          artwork: [
            'title',
            {
              imageVariants: ['size', 'url', 'createdAt', 'updatedAt'],
            },
            'createdAt',
            'updatedAt',
          ],
        },
        {
          listedBy: [
            'username',
            'displayName',
            'isFollowed',
            {
              profileImageVariants: ['size', 'url', 'createdAt', 'updatedAt'],
            },
            'createdAt',
            'updatedAt',
          ],
        },
        'createdAt',
        'updatedAt',
      ])
    );
  });
});
