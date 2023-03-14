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

  type Provider {
    required property provider_name -> str;

    constraint exclusive on ( .provider_name );
  }

};
