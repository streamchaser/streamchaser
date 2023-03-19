with
  raw_data := <json>$data,
for item in json_array_unpack(raw_data) union (
  insert Provider {
    logo_path := <str>item['logo_path'],
    provider_name := <str>item['provider_name'],
    provider_id := <int16>item['provider_id']
  }
  unless conflict
)
