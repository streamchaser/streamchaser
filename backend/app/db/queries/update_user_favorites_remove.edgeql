update User
filter .email = <str>$email
set {
  favorites -= (
    select Media filter .streamchaser_id = <str>$streamchaser_id
  )
};
