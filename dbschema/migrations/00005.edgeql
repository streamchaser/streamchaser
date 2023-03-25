CREATE MIGRATION m1px6id2noi2ptjowgjqtlkcvra5nwumtm7uonsikmecyar6jpo65q
    ONTO m1ze3ljf3pxex2dymzahr4runuuuip7e72og4necsthmefh6cvevoa
{
  ALTER TYPE default::Media {
      DROP PROPERTY title;
  };
};
