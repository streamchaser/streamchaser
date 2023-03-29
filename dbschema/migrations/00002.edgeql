CREATE MIGRATION m1sxz62exzf5xnmknpucteidnhugqkkx543h6p5cmg2bxfxpgvcnyq
    ONTO m1xon2mhoznwht53zg43lrqxyxhrbvy2mccacgovlbtm3c6vzp2qea
{
  CREATE TYPE default::CustomList {
      CREATE MULTI LINK media -> default::Media {
          CREATE PROPERTY added -> std::datetime;
      };
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK custom_lists -> default::CustomList {
          ON TARGET DELETE DELETE SOURCE;
          CREATE CONSTRAINT std::exclusive;
          CREATE PROPERTY created -> std::datetime;
      };
      CREATE MULTI LINK favorites -> default::Media {
          CREATE PROPERTY added -> std::datetime;
      };
  };
};
