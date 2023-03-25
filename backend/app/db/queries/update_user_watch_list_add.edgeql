update User
filter .email = <str>$email
set {
  watch_list += (
    insert Media { streamchaser_id := <str>$streamchaser_id }
    unless conflict on .streamchaser_id
    else (
      select Media filter .streamchaser_id = <str>$streamchaser_id
    )
  )
};
