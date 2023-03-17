CREATE MIGRATION m1ze3ljf3pxex2dymzahr4runuuuip7e72og4necsthmefh6cvevoa
    ONTO m17e7qbzq3wubrvjev6ztzuzsxkyv3umjdaotdrfmz3uxegh3v47zq
{
  ALTER TYPE default::Media {
      CREATE REQUIRED PROPERTY streamchaser_id -> std::str {
          SET REQUIRED USING ('x123');
      };
      CREATE CONSTRAINT std::exclusive ON (.streamchaser_id);
  };
};
