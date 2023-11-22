export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export enum PrismaValidation {
  ALREADY_EXITS = 'P2002',
  FOREIGN_KEY = 'P2003',
  RECORD_TO_DELETE_DOES_NOT_EXIST = 'P2025',
}

export enum GROUP_PERMISSIONS {
  READ = 'READ',
  WRITE = 'WRITE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
