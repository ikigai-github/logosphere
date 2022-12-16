import axios from 'axios';

export function extractHeaderValue(headers: string[], key: string): string {
  const idx = headers.findIndex((k: string) => k === key);
  return idx > -1 ? headers[idx + 1] : '';
}

export async function gqlExec(
  query: any,
  variables: any = {},
  userId?: string
): Promise<any> {
  const GQL_API_URL =
    process.env.GQL_API_URL || 'http://localhost:3000/graphql';

  const headers = {
    'Content-Type': 'application/json',
  };

  if (userId) {
    headers['Authorization'] = userId;
  }

  return await axios
    .post(
      GQL_API_URL,
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: userId || '',
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error.response);
      console.log(JSON.stringify(error.response.data, null, 2));
    });
}
