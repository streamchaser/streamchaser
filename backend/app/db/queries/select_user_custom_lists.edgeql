select User {
  id,
  custom_lists: {
    id,
    name,
    media: {
      id,
      streamchaser_id
    }
  }
}
filter .email = <str>$email;
