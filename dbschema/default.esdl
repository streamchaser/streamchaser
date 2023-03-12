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
};
