CREATE MIGRATION m1m7eayc7fmmb2ylknrxrukjyum3qyffk66pttlnfgnmafrvwszflq
    ONTO m1bh6sjk7f4mwmuhbgkq7lpe2ru6x44xsioxm7z2wyllyynmjavecq
{
  ALTER TYPE default::User {
      CREATE MULTI LINK providers -> default::Provider;
  };
};
