with
  providers := <json>$providers
for provider in json_array_unpack(providers) union (
  update Country
  filter .value = <str>$country_code
  set {
    providers := (
      select detached Provider {
        @display_priority := <int16>provider["display_priority"]
      }
      filter .provider_id = <int16>provider["provider_id"]
    )
  }
)
