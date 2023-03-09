CREATE MIGRATION m14jfkib7es2oelrayq2ye673joir2lg2gursfw3qqugpwcc4jzlwq
    ONTO m16za5argvv7t7a4t2lvobxrrwzm2rr52tekdjqisdmaoreysvqnyq
{
  CREATE TYPE default::Country {
      CREATE REQUIRED PROPERTY label -> std::str;
      CREATE REQUIRED PROPERTY value -> std::str;
  };
  CREATE TYPE default::Genre {
      CREATE REQUIRED PROPERTY label -> std::str;
      CREATE REQUIRED PROPERTY value -> std::str;
  };
};
