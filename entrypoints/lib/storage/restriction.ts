import { storage } from "#imports";

export interface RestrictionStorage {
  youtube: boolean;
  facebook: boolean;
}

export const restrictionStorage = storage.defineItem<RestrictionStorage>(
  "local:restriction",
  {
    fallback: {
      youtube: false,
      facebook: false,
    },
  }
);