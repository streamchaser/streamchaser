module default {
  type Genre {
    required property label -> str;
    required property value -> str;

    constraint exclusive on ( (.label, .value) );
  }

  type Country {
    required property label -> str;
    required property value -> str;

    multi link providers -> Provider {
      property display_priority -> int16;
    };

    constraint exclusive on ( (.label, .value) );
  }

  type Media {
    required property streamchaser_id -> str;
    required property imdb_id -> str;
    required property type -> str;
    required property title -> str;
    required property original_title -> str;
    required property overview -> str;
    required property release_date -> str;
    required property genres -> array<str>;
    required property poster_path -> str;
    required property popularity -> float32;
    required property supported_provider_countries -> array<str>;
    required property title_translations -> str;
    required property updated_at -> datetime;
    required property updated_at_unix -> int64;

    property providers -> json;

    # TODO: An idea for later for if we want to get rid of the providers JSON
    multi link local_providers -> LocalProviders;

    constraint exclusive on ( .streamchaser_id );
  }

  type User {
    # required property id -> str;  # TODO: I don't think we are supported to store this
    required property name -> str;
    # required property image_url -> str;  # Do we need this? We have it from Google in the frontend
    required property email -> str;  # Is this the only thing can that be unique?
    # required property joined -> datetime;  # TODO: Could be kinda interesting
    # required property logged_in -> datetime;  # Maybe? Last time the user logged in

    multi link watch_list -> Media {
      property added -> datetime;
    };

    multi link favorites -> Media {
      property added -> datetime;
    };

    multi link custom_lists -> CustomList {
      property created -> datetime;

      # The idea is that a custom list belongs to an user
      # We could share lists between users in the future maybe
      on target delete delete source;
      constraint exclusive;
    };

    constraint exclusive on ( .email );
  }

  type CustomList {
    required property name -> str;

    multi link media -> Media {
      property added -> datetime;
    };
  }

  # TODO: An idea for later for if we want to get rid of the providers JSON
  type LocalProviders {
    link country -> Country;

    multi link flatrate_providers -> Provider;
    multi link free_providers -> Provider;
  }

  type Provider {
    property logo_path -> str;
    required property provider_name -> str;
    required property provider_id -> int16;

    constraint exclusive on ( .provider_id );
  }
};
