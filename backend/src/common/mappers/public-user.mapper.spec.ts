import { stripPasswordHash, toPublicUser } from './public-user.mapper';

describe('public user mapper', () => {
  it('removes password hashes from nested data', () => {
    const result = stripPasswordHash({
      passwordHash: 'secret',
      user: { passwordHash: 'nested-secret', name: 'Demo' },
    });

    expect(result).toEqual({
      user: { name: 'Demo' },
    });
  });

  it('maps a user to its public fields', () => {
    expect(
      toPublicUser({
        id: 1,
        name: 'Demo',
        email: 'demo@example.com',
        username: 'demo',
        title: 'Manager',
        avatar: null,
        isGuest: false,
        passwordHash: 'secret',
      }),
    ).toEqual({
      id: 1,
      name: 'Demo',
      email: 'demo@example.com',
      username: 'demo',
      title: 'Manager',
      avatar: null,
      isGuest: false,
    });
  });
});
