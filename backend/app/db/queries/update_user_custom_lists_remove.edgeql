update User
filter .email = <str>$email
set {
  custom_lists -= (
    select CustomList filter .id = <uuid>$id
  )
};
