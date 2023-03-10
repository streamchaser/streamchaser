with
  raw_data := <json>$data,
for item in json_array_unpack(raw_data) union (
  insert Genre { label := <str>item['label'], value := <str>item['value'] }
  unless conflict
)
