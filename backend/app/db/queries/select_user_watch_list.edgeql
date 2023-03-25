select User {
  watch_list: {
    id,
    streamchaser_id
  }
}
filter .email = <str>$email
