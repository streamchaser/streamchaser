CREATE MIGRATION m1yzjqx4oznin4efex57cs56dgudxnacv3litmmf6qf4nhqvuyxlcq
    ONTO m1ltrsm6y5htsumx2fzgc6tayanm3nwsiaznhes2osfpkye2vt6wta
{
  CREATE TYPE default::Provider {
      CREATE REQUIRED PROPERTY provider_name -> std::str;
      CREATE CONSTRAINT std::exclusive ON (.provider_name);
  };
  ALTER TYPE default::Country {
      CREATE MULTI LINK providers -> default::Provider {
          CREATE CONSTRAINT std::exclusive;
          CREATE PROPERTY display_priority -> std::int16;
      };
  };
};
