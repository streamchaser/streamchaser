select User {
  id,
  email,
  name,
  custom_lists: {
    id,
    name,
    media: {
      id,
      streamchaser_id
      }
    },
  favorites: {
    id,
    streamchaser_id
  },
  watch_list: {
    id,
    streamchaser_id
  },
  providers: {
    id,
    provider_id,
    logo_path,
    provider_name
  }
}
filter .email = <str>$email
