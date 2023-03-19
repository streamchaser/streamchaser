CREATE MIGRATION m1wjvanirvtshebnf6lrxdr7zgws4rklbc5ozo2uepsko5xlfytm4q
    ONTO m12hui3yimgsswtwtkinxxwb6homg2zrsemznney4fwl5cd5l3xt4a
{
  ALTER TYPE default::Country {
      ALTER LINK providers {
          ALTER PROPERTY display_priority {
              SET TYPE std::int16 USING (1);
          };
      };
  };
};
