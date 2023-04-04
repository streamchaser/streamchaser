select User {
  favorites: {
    id,
    streamchaser_id
  }
}
filter .email = <str>$email
