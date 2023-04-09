CREATE MIGRATION m1uiwtgmjhhlcnzyhljdpnur7wznn2jivua6cm7s3nq5dotgsrr6bq
    ONTO initial
{
  CREATE FUTURE nonrecursive_access_policies;
  CREATE TYPE default::Provider {
      CREATE REQUIRED PROPERTY provider_id -> std::int16;
      CREATE CONSTRAINT std::exclusive ON (.provider_id);
      CREATE PROPERTY logo_path -> std::str;
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
  CREATE TYPE default::LocalProviders {
      CREATE LINK country -> default::Country;
      CREATE MULTI LINK flatrate_providers -> default::Provider;
      CREATE MULTI LINK free_providers -> default::Provider;
  };
  CREATE TYPE default::Media {
      CREATE MULTI LINK local_providers -> default::LocalProviders;
      CREATE REQUIRED PROPERTY streamchaser_id -> std::str;
      CREATE CONSTRAINT std::exclusive ON (.streamchaser_id);
      CREATE REQUIRED PROPERTY genres -> array<std::str>;
      CREATE REQUIRED PROPERTY imdb_id -> std::str;
      CREATE REQUIRED PROPERTY original_title -> std::str;
      CREATE REQUIRED PROPERTY overview -> std::str;
      CREATE REQUIRED PROPERTY popularity -> std::float32;
      CREATE REQUIRED PROPERTY poster_path -> std::str;
      CREATE PROPERTY providers -> std::json;
      CREATE REQUIRED PROPERTY release_date -> std::str;
      CREATE REQUIRED PROPERTY supported_provider_countries -> array<std::str>;
      CREATE REQUIRED PROPERTY title -> std::str;
      CREATE REQUIRED PROPERTY title_translations -> std::str;
      CREATE REQUIRED PROPERTY type -> std::str;
      CREATE REQUIRED PROPERTY updated_at -> std::datetime;
      CREATE REQUIRED PROPERTY updated_at_unix -> std::int64;
  };
  CREATE TYPE default::CustomList {
      CREATE MULTI LINK media -> default::Media {
          CREATE PROPERTY added -> std::datetime;
      };
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  CREATE TYPE default::User {
      CREATE MULTI LINK custom_lists -> default::CustomList {
          ON TARGET DELETE DELETE SOURCE;
          CREATE CONSTRAINT std::exclusive;
          CREATE PROPERTY created -> std::datetime;
      };
      CREATE MULTI LINK favorites -> default::Media {
          CREATE PROPERTY added -> std::datetime;
      };
      CREATE MULTI LINK watch_list -> default::Media {
          CREATE PROPERTY added -> std::datetime;
      };
      CREATE REQUIRED PROPERTY email -> std::str;
      CREATE CONSTRAINT std::exclusive ON (.email);
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  CREATE TYPE default::Genre {
      CREATE REQUIRED PROPERTY label -> std::str;
      CREATE REQUIRED PROPERTY value -> std::str;
      CREATE CONSTRAINT std::exclusive ON ((.label, .value));
  };
};
