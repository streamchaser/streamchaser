select User {
  id,
  providers: {
    id,
    provider_id,
    logo_path,
    provider_name
  }
}
filter .email = <str>$email
