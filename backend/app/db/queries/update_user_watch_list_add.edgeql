update User
filter .email = <str>$email
set {
  watch_list += (
    select Media filter .streamchaser_id = <str>$streamchaser_id
  )
};
