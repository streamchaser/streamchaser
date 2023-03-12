CREATE MIGRATION m1ltrsm6y5htsumx2fzgc6tayanm3nwsiaznhes2osfpkye2vt6wta
    ONTO initial
{
  CREATE FUTURE nonrecursive_access_policies;
  CREATE TYPE default::Country {
      CREATE REQUIRED PROPERTY label -> std::str;
      CREATE REQUIRED PROPERTY value -> std::str;
      CREATE CONSTRAINT std::exclusive ON ((.label, .value));
  };
  CREATE TYPE default::Genre {
      CREATE REQUIRED PROPERTY label -> std::str;
      CREATE REQUIRED PROPERTY value -> std::str;
      CREATE CONSTRAINT std::exclusive ON ((.label, .value));
  };
};
