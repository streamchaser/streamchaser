CREATE MIGRATION m17e7qbzq3wubrvjev6ztzuzsxkyv3umjdaotdrfmz3uxegh3v47zq
    ONTO m1gutia4hvbiawjr2gqwawp6ggrk5lcldk25qplzm26bp3a6m65xya
{
  ALTER TYPE default::User {
      DROP PROPERTY image_url;
  };
};
