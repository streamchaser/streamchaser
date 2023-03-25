select Country {
  id,
  label,
  value,
  providers: {
    id,
    provider_id,
    logo_path,
    provider_name,
    @display_priority
  }
  order by @display_priority
}
filter .value = <str>$country_code
