update User
filter .email = <str>$email
set {
  providers -= (
    select Provider
    filter .provider_id = <int16>$provider_id
  )
};
