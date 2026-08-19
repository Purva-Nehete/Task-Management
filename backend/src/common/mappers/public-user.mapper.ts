export interface PublicUser {
  id: number;
  name: string;
  email: string;
  username: string;
  title: string | null;
  avatar: string | null;
  isGuest?: boolean;
}

export function toPublicUser<T extends PublicUser>(user: T): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    title: user.title,
    avatar: user.avatar,
    ...(typeof user.isGuest === 'boolean' ? { isGuest: user.isGuest } : {}),
  };
}

export function stripPasswordHash<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripPasswordHash(item)) as T;
  }

  if (value && typeof value === 'object') {
    const result = { ...(value as Record<string, unknown>) };
    delete result.passwordHash;

    for (const [key, item] of Object.entries(result)) {
      result[key] = stripPasswordHash(item);
    }

    return result as T;
  }

  return value;
}
