export * as APP_CONSTANTS from './appconstants';
export const BCRYPT_SALT_ROUNDS = 10;

export const DECORATOR_KEYS = {
  roles: 'ROLES',
  public: 'IS_PUBLIC',
  groupPermission: 'GROUP_PERMISSION',
};
export const TOKEN_EXPIRY = {
  accessToken: '24h',
};
export const TOKEN_SECRET = {
  accessToken: 'hellothisisjwtsecret',
};

export const TABLES = {
  ADMIN: 'admin',
  USER: 'user',
  PLANT: 'plant',
  ORGANIZATION: 'organization',
  GROUP: 'group',
  SHOP: 'shop',
  Service:'service'
};
