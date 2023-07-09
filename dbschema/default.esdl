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

    constraint exclusive on ( .streamchaser_id );
  }

  type User {
    # required property id -> str;  # TODO: I don't think we are supported to store this
    required property name -> str;
    # required property image_url -> str;  # Do we need this? We have it from Google in the frontend
    required property email -> str;  # Is this the only thing can that be unique?
    # required property joined -> datetime;  # TODO: Could be kinda interesting
    # required property logged_in -> datetime;  # Maybe? Last time the user logged in

    multi link providers -> Provider;

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

  type Provider {
    property logo_path -> str;
    required property provider_name -> str;
    required property provider_id -> int16;

    constraint exclusive on ( .provider_id );
  }
};
