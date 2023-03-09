module default {
  type Person {
    required property name -> str;
    multi link media -> Media;
  }

  type Media {
    required property title -> str;
  }

  type Genre {
    required property label -> str;
    required property value -> str;
  }

  type Country {
    required property label -> str;
    required property value -> str;
  }
};
