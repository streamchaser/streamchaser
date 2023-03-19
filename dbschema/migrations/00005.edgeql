CREATE MIGRATION m1px6id2noi2ptjowgjqtlkcvra5nwumtm7uonsikmecyar6jpo65q
    ONTO m1ze3ljf3pxex2dymzahr4runuuuip7e72og4necsthmefh6cvevoa
{
  ALTER TYPE default::Media {
      DROP PROPERTY title;
CREATE MIGRATION m1k2xrttwapwctzxh25lm67dxktsarudod2eipc4pfrbunbb7nt73q
    ONTO m1ze3ljf3pxex2dymzahr4runuuuip7e72og4necsthmefh6cvevoa
{
  CREATE TYPE default::Provider {
      CREATE REQUIRED PROPERTY provider_id -> std::int16;
      CREATE CONSTRAINT std::exclusive ON (.provider_id);
      CREATE REQUIRED PROPERTY logo_path -> std::str;
      CREATE REQUIRED PROPERTY provider_name -> std::str;
  };
};
