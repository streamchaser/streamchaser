select User {
  watch_list: {
    id,
    title,
    streamchaser_id
  }
}
filter .email = <str>$email
