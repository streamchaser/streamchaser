CREATE MIGRATION m16za5argvv7t7a4t2lvobxrrwzm2rr52tekdjqisdmaoreysvqnyq
    ONTO m16smqiffrfejvy3augh3t5gv6entzyigx3h46sbvcsmsajdtgc6cq
{
  CREATE TYPE default::Media {
      CREATE REQUIRED PROPERTY title -> std::str;
  };
  CREATE TYPE default::Person {
      CREATE MULTI LINK media -> default::Media;
      CREATE REQUIRED PROPERTY name -> std::str;
  };
};
