CREATE MIGRATION m1gutia4hvbiawjr2gqwawp6ggrk5lcldk25qplzm26bp3a6m65xya
    ONTO m1ltrsm6y5htsumx2fzgc6tayanm3nwsiaznhes2osfpkye2vt6wta
{
  CREATE TYPE default::Media {
      CREATE REQUIRED PROPERTY title -> std::str;
  };
  CREATE TYPE default::User {
      CREATE MULTI LINK watch_list -> default::Media {
          CREATE PROPERTY added -> std::datetime;
      };
      CREATE REQUIRED PROPERTY email -> std::str;
      CREATE CONSTRAINT std::exclusive ON (.email);
      CREATE REQUIRED PROPERTY image_url -> std::str;
      CREATE REQUIRED PROPERTY name -> std::str;
  };
};
