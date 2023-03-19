CREATE MIGRATION m12hui3yimgsswtwtkinxxwb6homg2zrsemznney4fwl5cd5l3xt4a
    ONTO m1k2xrttwapwctzxh25lm67dxktsarudod2eipc4pfrbunbb7nt73q
{
  ALTER TYPE default::Country {
      CREATE MULTI LINK providers -> default::Provider {
          CREATE PROPERTY display_priority -> std::str;
      };
  };
};
