CREATE MIGRATION m1x3lknsybhvzzswek6thmm5k3u2reu627u35iththa26bog4e4c2q
    ONTO m14jfkib7es2oelrayq2ye673joir2lg2gursfw3qqugpwcc4jzlwq
{
  ALTER TYPE default::Country {
      CREATE CONSTRAINT std::exclusive ON ((.label, .value));
  };
  ALTER TYPE default::Genre {
      CREATE CONSTRAINT std::exclusive ON ((.label, .value));
  };
};
