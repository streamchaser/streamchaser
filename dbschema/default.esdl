module default {
  type Genre {
    required property label -> str;
    required property value -> str;

    constraint exclusive on ( (.label, .value) );
  }

  type Country {
    required property label -> str;
    required property value -> str;

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

    multi link watch_list -> Media {
      property added -> datetime;
    };

    constraint exclusive on ( .email );
  }
};
