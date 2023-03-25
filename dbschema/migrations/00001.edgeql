CREATE MIGRATION m1xon2mhoznwht53zg43lrqxyxhrbvy2mccacgovlbtm3c6vzp2qea
    ONTO initial
{
  CREATE FUTURE nonrecursive_access_policies;
  CREATE TYPE default::Provider {
      CREATE REQUIRED PROPERTY provider_id -> std::int16;
      CREATE CONSTRAINT std::exclusive ON (.provider_id);
      CREATE REQUIRED PROPERTY logo_path -> std::str;
      CREATE REQUIRED PROPERTY provider_name -> std::str;
  };
  CREATE TYPE default::Country {
      CREATE REQUIRED PROPERTY label -> std::str;
      CREATE REQUIRED PROPERTY value -> std::str;
      CREATE CONSTRAINT std::exclusive ON ((.label, .value));
      CREATE MULTI LINK providers -> default::Provider {
          CREATE PROPERTY display_priority -> std::int16;
      };
  };
  CREATE TYPE default::Genre {
      CREATE REQUIRED PROPERTY label -> std::str;
      CREATE REQUIRED PROPERTY value -> std::str;
      CREATE CONSTRAINT std::exclusive ON ((.label, .value));
  };
  CREATE TYPE default::Media {
      CREATE REQUIRED PROPERTY streamchaser_id -> std::str;
      CREATE CONSTRAINT std::exclusive ON (.streamchaser_id);
  };
  CREATE TYPE default::User {
      CREATE MULTI LINK watch_list -> default::Media {
          CREATE PROPERTY added -> std::datetime;
      };
      CREATE REQUIRED PROPERTY email -> std::str;
      CREATE CONSTRAINT std::exclusive ON (.email);
      CREATE REQUIRED PROPERTY name -> std::str;
  };
};
